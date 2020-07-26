import {Request, Response} from 'express';
import {QueryBuilder} from '../../builders/query.builder';
import {SubredditBase} from '../../models';

import {DataAccessService} from '../../services';
import {EEntities, ESqlCommand} from '../../types';

/**
 * @swagger
 *
 * definitions:
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
 * /v1/subreddits:
 *   get:
 *     description: Gets All subreddits
 *     produces:
 *       - application/json
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
 *     responses:
 *       200:
 *         description: subreddits
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/subreddit'
 */

export const getSubreddits: (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => (
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
                                                                .entity(EEntities.SUBREDDITS)
                                                                .columns(request.query.columns as string)
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
 * /v1/subreddits/{subreddit_id}:
 *   get:
 *     description: Gets the subreddits With Corresponding subreddit_id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: subreddit_id
 *         description: subreddit id
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
 *           type: object
 *           items:
 *             $ref: '#/definitions/subreddit'
 */

export const getSubredditsSubreddit: (
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
                                                                           column: 'id',
                                                                           value:  request.params.subreddit_id
                                                                       })
                                                                .columns(request.query.columns as string)
                                                                .query()
            );
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
 * /v1/subreddits:
 *   post:
 *     description: Creates a subreddit
 *     produces:
 *       - application/json
 *     parameters:
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
export const postSubreddits: (dataAccessService: DataAccessService, queryBuilder: QueryBuilder) => (
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
                                                                .entity(EEntities.SUBREDDITS)
                                                                .baseObject(SubredditBase())
                                                                .valueObject(request.body)
                                                                .columns(request.query.columns as string)
                                                                .query()
            );
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
 * /v1/subreddits/{subreddit_id}:
 *   put:
 *     description: Update a subreddit
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: subreddit_id
 *         description: subreddit id
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
export const putSubredditsSubreddit: (
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
                                                                .command(ESqlCommand.UPDATE)
                                                                .entity(EEntities.SUBREDDITS)
                                                                .baseObject({
                                                                                ...SubredditBase(),
                                                                                id: request.params.subreddit_id
                                                                            })
                                                                .valueObject(request.body)
                                                                .where({
                                                                           column: 'id',
                                                                           value:  request.params.subreddit_id
                                                                       })
                                                                .columns(request.query.columns as string)
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
 * /v1/subreddits/{subreddit_id}:
 *   delete:
 *     description: Delete a subreddit
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: subreddit_id
 *         description: subreddit id
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
 *         description: subreddit
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/definitions/subreddit'
 */
export const deleteSubredditsSubreddit: (
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
            const columnArray: string[] = request.query.columns ? (request.query.columns as string).split(',') : [];
            const columns: string = request.query.columns ? Object.keys(SubredditBase())
                .filter((key: string) => columnArray.includes(key))
                .join(',') : '*';
            
            const data: any = await dataAccessService.query(
                {
                    text:   `UPDATE subreddits SET delete_date=EXTRACT(epoch from NOW()) WHERE id=$1 RETURNING ${columns}`,
                    values: [request.params.subreddit_id]
                });
            response.json(data.rows);
        }
        catch(error)
        {
            response.status(500).json(error);
        }
    };
