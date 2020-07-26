import {Express, Request, Response} from 'express';
import {QueryBuilder} from '../../builders/query.builder';
import {SubredditBase, RedditorBase} from '../../models';
import {RedditEmailService} from '../../services/reddit-email.service';
import {EEntities, ESqlCommand, IQuery} from '../../types';

import {DataAccessService} from '../../services/data-access.service';

/**
 * @swagger
 *
 * definitions:
 *   redditor:
 *     type: object
 *     required:
 *       - email_address
 *     properties:
 *       email_address:
 *         type: string
 *       first_name:
 *         type: string
 *         nullable: true
 *       id:
 *         type: string
 *       last_name:
 *         type: string
 *         nullable: true
 *       time_zone_identifier:
 *         type: string
 *         nullable: true
 *       email_enabled:
 *         type: boolean
 *         nullable: true
 *       create_date:
 *         type: number
 *       update_date:
 *         type: number
 *       delete_date:
 *         type: number
 *         nullable: true
 *   subreddit:
 *     type: object
 *     required:
 *       - subreddit
 *     properties:
 *       description:
 *         type: string
 *         nullable: true
 *       favorite:
 *         type: boolean
 *         nullable: true
 *       id:
 *         type: string
 *       redditor_id:
 *         type: string
 *       subreddit:
 *         type: string
 *       create_date:
 *         type: number
 *       update_date:
 *         type: number
 *       delete_date:
 *         type: number
 *         nullable: true
 */

/**
 * @swagger
 *
 * /v1/redditors:
 *   get:
 *     description: Gets All redditors
 *     parameters:
 *       - name: columns
 *         description: columns
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: deleted
 *         description: show deleted
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: redditors
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/redditor'
 */

export const getRedditors: (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => (
    request: Request,
    response: Response
) => void =
    (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => async(
        request: Request,
        response: Response
    ) =>
    {
        queryBuilder.raze();
        try
        {
            const data: any = await dataAccessService.query(queryBuilder
                                                                .command(ESqlCommand.SELECT)
                                                                .entity(EEntities.REDDITORS)
                                                                .columns(request.query.columns as string)
                                                                .deleted(request.query.deleted as string)
                                                                .query());
            response.json(data.rows);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };

/**
 * @swagger
 *
 * /v1/redditors/{redditor_id}:
 *   get:
 *     description: Gets the redditor With Corresponding redditor_id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: redditor_id
 *         description: redditor id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: columns
 *         description: columns
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: deleted
 *         description: show deleted
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: redditors
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/definitions/redditor'
 */

export const getRedditorsRedditor: (
    dataAccessService: DataAccessService,
    queryBuilder: QueryBuilder
) => (request: Request, response: Response) => void =
    (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => async(
        request: Request,
        response: Response
    ) =>
    {
        queryBuilder.raze();
        try
        {
            const data: any = await dataAccessService.query(queryBuilder
                                                                .command(ESqlCommand.SELECT)
                                                                .entity(EEntities.REDDITORS)
                                                                .columns(request.query.columns as string)
                                                                .deleted(request.query.deleted as string)
                                                                .where({
                                                                           column: 'id',
                                                                           value:  request.params.redditor_id
                                                                       })
                                                                .query());
            response.json(data.rows);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };

/**
 * @swagger
 *
 * /v1/redditors:
 *   post:
 *     description: Creates a New Redditor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: redditor
 *         description: redditor object
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/redditor'
 *       - name: columns
 *         description: columns
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: deleted
 *         description: show deleted
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: redditor
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/definitions/redditor'
 */
export const postRedditors: (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => (
    request: Request,
    response: Response
) => void =
    (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => async(
        request: Request,
        response: Response
    ) =>
    {
        queryBuilder.raze();
        try
        {
            const data: any = await dataAccessService.query(queryBuilder
                                                                .command(ESqlCommand.INSERT)
                                                                .entity(EEntities.REDDITORS)
                                                                .baseObject(RedditorBase())
                                                                .valueObject(request.body)
                                                                .columns(request.query.columns as string)
                                                                .deleted(request.query.deleted as string)
                                                                .query());
            response.json(data.rows);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };

/**
 * @swagger
 *
 * /v1/redditors/{redditor_id}:
 *   put:
 *     description: Updates a redditor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: redditor_id
 *         description: redditor id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: redditor
 *         description: redditor object
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/redditor'
 *       - name: columns
 *         description: columns
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: deleted
 *         description: show deleted
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: redditor
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/definitions/redditor'
 */
export const putRedditors: (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => (
    request: Request,
    response: Response
) => void =
    (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => async(
        request: Request,
        response: Response
    ) =>
    {
        queryBuilder.raze();
        try
        {
            const data: any = await dataAccessService.query(queryBuilder
                                                                .command(ESqlCommand.UPDATE)
                                                                .entity(EEntities.REDDITORS)
                                                                .baseObject({
                                                                                ...RedditorBase(),
                                                                                id: request.params.redditor_id
                                                                            })
                                                                .valueObject(request.body)
                                                                .where({
                                                                           column: 'id',
                                                                           value:  request.params.redditor_id
                                                                       })
                                                                .columns(request.query.columns as string)
                                                                .deleted(request.query.deleted as string)
                                                                .query());
            response.json(data.rows);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };

/**
 * @swagger
 *
 * /v1/redditors/{redditor_id}:
 *   delete:
 *     description: Deletes a redditor and all of their subreddits
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: redditor_id
 *         description: redditor id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: columns
 *         description: columns
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: redditor
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/definitions/redditor'
 */
export const deleteRedditors: (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => (
    request: Request,
    response: Response
) => void =
    (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => async(
        request: Request,
        response: Response
    ) =>
    {
        queryBuilder.raze();
        try
        {
            const columnArray: string[] = request.query.columns ? (request.query.columns as string).split(',') : [];
            const columns: string = request.query.columns ? Object.keys(RedditorBase())
                .filter((key: string) => columnArray.includes(key))
                .join(',') : '*';
            
            const subredditsData: any = await dataAccessService.query(
                {
                    text:   `UPDATE subreddits SET delete_date=EXTRACT(epoch from NOW()) WHERE redditor_id=$1`,
                    values: [request.params.redditor_id]
                });
            
            const data: any = await dataAccessService.query({
                                                                text:   `UPDATE redditors SET delete_date=EXTRACT(epoch from NOW()) WHERE id=$1 RETURNING ${columns}`,
                                                                values: [request.params.redditor_id]
                                                            });
            
            response.json(data.rows);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };

/**
 * @swagger
 *
 * /v1/redditors/{redditor_id}/subreddits:
 *   get:
 *     description: Gets All redditor subreddits
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: redditor_id
 *         description: redditor id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: columns
 *         description: columns
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: deleted
 *         description: show deleted
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: subreddits
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/subreddit'
 */

export const getRedditorsSubreddits: (
    dataAccessService: DataAccessService,
    queryBuilder: QueryBuilder
) => (request: Request, response: Response) => void =
    (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => async(
        request: Request,
        response: Response
    ) =>
    {
        queryBuilder.raze();
        try
        {
            const data: any = await dataAccessService.query(queryBuilder
                                                                .command(ESqlCommand.SELECT)
                                                                .entity(EEntities.SUBREDDITS)
                                                                .columns(request.query.columns as string)
                                                                .deleted(request.query.deleted as string)
                                                                .where({
                                                                           column: 'redditor_id',
                                                                           value:  request.params.redditor_id
                                                                       })
                                                                .query());
            response.json(data.rows);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };

export const getRedditorsSubredditsEmail: (
    dataAccessService: DataAccessService,
    queryBuilder: QueryBuilder
) => (request: Request, response: Response) => void =
    (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => async(
        request: Request,
        response: Response
    ) =>
    {
        queryBuilder.raze();
        try
        {
            const data: any = await dataAccessService.query(queryBuilder
                                                                .command(ESqlCommand.SELECT)
                                                                .entity(EEntities.SUBREDDITS)
                                                                .where({
                                                                           column: 'redditor_id',
                                                                           value:  request.params.redditor_id
                                                                       })
                                                                .query());
            
            const email: string = await RedditEmailService.generateSubredditEmail(data.rows);
            
            response.setHeader('Content-Type', 'text/html');
            response.end(email);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };

/**
 * @swagger
 *
 * /v1/redditors/{redditor_id}/subreddits:
 *   post:
 *     description: Creates a Redditor's Subreddit
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: redditor_id
 *         description: redditor id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: subreddit
 *         description: subreddit object
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/subreddit'
 *       - name: columns
 *         description: columns
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: deleted
 *         description: show deleted
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: subreddit
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/definitions/subreddit'
 */
export const postRedditorsSubreddits: (
    dataAccessService: DataAccessService,
    queryBuilder: QueryBuilder
) => (request: Request, response: Response) => void =
    (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => async(
        request: Request,
        response: Response
    ) =>
    {
        queryBuilder.raze();
        try
        {
            const data: any = await dataAccessService.query(queryBuilder
                                                                .command(ESqlCommand.INSERT)
                                                                .entity(EEntities.SUBREDDITS)
                                                                .baseObject(SubredditBase())
                                                                .valueObject({
                                                                                 ...request.body,
                                                                                 redditor_id: request.params.redditor_id
                                                                             })
                                                                .columns(request.query.columns as string)
                                                                .deleted(request.query.deleted as string)
                                                                .query());
            response.json(data.rows);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };
