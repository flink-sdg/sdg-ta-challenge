import dotenv from 'dotenv';
import express, {Express, Router} from 'express';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import expressWinston from 'express-winston';
import winston from 'winston';

import {QueryBuilder} from './builders/query.builder';
import {DataAccessService} from './services/data-access.service';
import {RedditEmailService} from './services/reddit-email.service';
import {swaggerDefinition} from './types';

import {
    getRedditors,
    getRedditorsRedditor,
    getRedditorsSubreddits,
    postRedditors,
    postRedditorsSubreddits,
    deleteSubredditsSubreddit,
    getSubreddits,
    getSubredditsSubreddit,
    postSubreddits,
    putSubredditsSubreddit,
    putRedditors,
    deleteRedditors,
    getRedditorsSubredditsEmail
} from './routes/v1';

dotenv.config();

const app: Express = express();
const port: number = +process.env.PORT || 8080;
const router: any = Router();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

if(process.env.NODE_ENV === 'development')
{
    const options: any = {
        swaggerDefinition,
        apis: ['./dist/models/*.*.js', './dist/routes/v1/*.js']
    };
    const swaggerSpec: any = swaggerJSDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    if(process.env.LOGREQUESTS === 'true')
    {
        app.use(expressWinston.logger({
                                          transports: [
                                              new winston.transports.Console()
                                          ],
                                          format:     winston.format.combine(
                                              winston.format.json({space: 2})
                                          ),
                                          meta:       true,
                                          msg:        'HTTP {{req.method}} {{req.url}}'
                                      }));
    }
}

const dataAccessService: DataAccessService = DataAccessService.instance();

RedditEmailService.setupEmails(
    dataAccessService,
    new QueryBuilder(),
    RedditEmailService.generateSubredditEmail,
    RedditEmailService.emailSubreddits
);

router.get('/redditors', getRedditors(dataAccessService, new QueryBuilder()));
router.get('/redditors/:redditor_id', getRedditorsRedditor(dataAccessService, new QueryBuilder()));
router.post('/redditors', postRedditors(dataAccessService, new QueryBuilder()));
router.put('/redditors/:redditor_id', putRedditors(dataAccessService, new QueryBuilder()));
router.delete('/redditors/:redditor_id', deleteRedditors(dataAccessService, new QueryBuilder()));
router.get('/redditors/:redditor_id/subreddits', getRedditorsSubreddits(dataAccessService, new QueryBuilder()));
router.get(
    '/redditors/:redditor_id/subreddits-email',
    getRedditorsSubredditsEmail(dataAccessService, new QueryBuilder())
);
router.post('/redditors/:redditor_id/subreddits', postRedditorsSubreddits(dataAccessService, new QueryBuilder()));

router.get('/subreddits', getSubreddits(dataAccessService, new QueryBuilder()));
router.get('/subreddits/:subreddit_id', getSubredditsSubreddit(dataAccessService, new QueryBuilder()));
router.post('/subreddits', postSubreddits(dataAccessService, new QueryBuilder()));
router.put('/subreddits/:subreddit_id', putSubredditsSubreddit(dataAccessService, new QueryBuilder()));
router.delete('/subreddits/:subreddit_id', deleteSubredditsSubreddit(dataAccessService, new QueryBuilder()));

app.use('/v1', router);

app.listen(port, () =>
{
    console.log(`server started at http://localhost:${port}`);
});
