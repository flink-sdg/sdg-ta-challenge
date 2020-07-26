import nodeFetch, {Response} from 'node-fetch';
import {QueryBuilder} from '../builders/query.builder';

import {IRedditor, ISubreddit} from '../models';
import {EEntities, ESqlCommand} from '../types';
import {DataAccessService} from './data-access.service';

import moment from 'moment-timezone';

export class RedditEmailService
{
    //TODO: This could be improved... need to clean up dangling timer and optimize... but low on time.
    public static setupEmails(
        dataAccessService: DataAccessService,
        queryBuilder: QueryBuilder,
        generateSubredditEmail: (subreddits: ISubreddit[]) => Promise<string>,
        emailSubreddits: (
            redditor: IRedditor,
            dataAccessService: DataAccessService,
            queryBuilder: QueryBuilder,
            generateSubredditEmail: (subreddits: ISubreddit[]) => Promise<string>
        ) => Promise<any>
    )
    {
        let queried: number;
        const redditors: {[key: string]: IRedditor} = {};
        
        const updatedRedditors: () => void = () =>
        {
            (async() =>
            {
                const lastQueried: number = queried;
                queried = moment.utc().valueOf() / 1000;
                const data: any = await dataAccessService.query(`SELECT id,email_enabled,email_address,time_zone_identifier,delete_date FROM redditors ${lastQueried ? `WHERE update_date > ${lastQueried}` : ''}`);
                
                data.rows.forEach((redditor: IRedditor) =>
                                  {
                                      if(redditor.delete_date || !redditor.email_enabled)
                                      {
                                          delete redditors[redditor.id];
                                      }
                                      else
                                      {
                                          redditors[redditor.id] = redditor;
                                      }
                                  });
                
                Object.values(redditors).forEach((redditor: IRedditor) =>
                                                 {
                                                     const redditorMoment: any = moment.tz(redditor.time_zone_identifier);
                                                     if(redditor.email_address && /(.+)@(.+){2,}\.(.+){2,}/.test(
                                                         redditor.email_address) && redditorMoment.hour() === 8 && redditorMoment.minute() === 0)
                                                     {
                                                         emailSubreddits(redditor, dataAccessService, queryBuilder, generateSubredditEmail);
                                                     }
                                                 });
            })();
        };
        
        updatedRedditors();
        setInterval(updatedRedditors, 60000);
    }
    
    public static async emailSubreddits(
        redditor: IRedditor,
        dataAccessService: DataAccessService,
        queryBuilder: QueryBuilder,
        generateSubredditEmail: (subreddits: ISubreddit[]) => Promise<string>
    ): Promise<any>
    {
        const data: any = await dataAccessService.query(queryBuilder
                                                            .command(ESqlCommand.SELECT)
                                                            .entity(EEntities.SUBREDDITS)
                                                            .where({
                                                                       column: 'redditor_id',
                                                                       value:  redditor.id
                                                                   })
                                                            .query());
        
        const email: string = await generateSubredditEmail(data.rows);
        const body: string = JSON.stringify({
                                                personalizations: [
                                                    {
                                                        to:      [
                                                            {
                                                                email: redditor.email_address
                                                            }
                                                        ],
                                                        subject: 'Your Daily Dose of Wake Up Media'
                                                    }
                                                ],
                                                content:          [
                                                    {
                                                        type:  'text/html',
                                                        value: email
                                                    }
                                                ],
                                                from:             {
                                                    email: process.env.SENDGRIDEMAIL,
                                                    name:  process.env.SENDGRIDENAME
                                                },
                                                reply_to:         {
                                                    email: process.env.SENDGRIDEMAIL,
                                                    name:  process.env.SENDGRIDENAME
                                                }
                                            });
        
        const response: Response = await nodeFetch(`https://api.sendgrid.com/v3/mail/send`, {
                                                       method:  'post',
                                                       body,
                                                       headers: {
                                                           'Content-Type':  'application/json',
                                                           'Authorization': `Bearer ${process.env.SENDGRIDAPIKEY}`
                                                       }
                                                   }
        );
        
        
        return response;
    }
    
    public static async generateSubredditEmail(subreddits: ISubreddit[]): Promise<string>
    {
        const favoriteData: any = [];
        
        for(const subreddit of subreddits)
        {
            if(subreddit.favorite)
            {
                //TODO: Probably want some better error handling here...
                try
                {
                    const response: Response = await nodeFetch(`${subreddit.subreddit}${subreddit.subreddit[subreddit.subreddit.length - 1] !== '/' ? '/' : ''}top/.json?count=1`);
                    const responseData: any = await response.json();
                    
                    if(responseData && responseData.data && responseData.data.children && Array.isArray(responseData.data.children) && responseData.data.children.length > 0)
                    {
                        const favorite: any = responseData.data.children[0].data;
                        favoriteData.push({
                                              href:      `https://reddit.com${favorite.permalink}`,
                                              subreddit: favorite.subreddit,
                                              title:     favorite.title,
                                              thumbnail: favorite.thumbnail,
                                              score:     favorite.score
                                          });
                    }
                }
                catch(error)
                {
                
                }
            }
        }
        
        return `
<!DOCTYPE html>
<html>
<head>
<title>Favorite Reddits</title>
<style>
.card {
  border: 1px solid #ddd;
  border-radius: 4px;
  -webkit-box-shadow: 5px 5px 10px lightgrey;
  -moz-box-shadow: 5px 5px 10px lightgrey;
  box-shadow: 5px 5px 10px lightgrey;
  display: inline-block;
  margin: 24px;
  padding: 24px;
  position: relative;
  width: 400px;
}
.top-right
{
    position: absolute;
    top: 8px;
    right: 8px;
}
a:link, a:visited {
    text-decoration: none;
    color: black;
    cursor: pointer;
}
</style>
</head>
<body>
${
            favoriteData.map((favorite: any) => `
<a class="card" href="${favorite.href}">
    <h3>${favorite.subreddit}</h3>
    <p>${favorite.title}</p>
    <p class="top-right" style="padding: .5rem; margin: 0px;color: white;background-color: black;width: fit-content;border-radius:50%;">${favorite.score}</p>
    <img src="${favorite.thumbnail}" style="object-fit: contain;width: 400px;">
</a>
    `).join('')
        }
</body>
</html>
`;
    }
}
