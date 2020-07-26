export interface IQuery
{
    text: string,
    values: any[]
}

export enum ESqlCommand
{
    INSERT = 'INSERT',
    UPDATE = 'UPDATE',
    SELECT = 'SELECT',
    DELETE = 'DELETE'
}

export enum EEntities
{
    REDDITORS = 'redditors',
    SUBREDDITS = 'subreddits'
}
