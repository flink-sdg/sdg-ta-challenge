import {uuid} from 'uuidv4';

export interface ISubreddit
{
    description?: string | null;
    favorite?: boolean | null;
    id: string;
    name?: string | null;
    redditor_id: string;
    subreddit: string;
    create_date: number;
    update_date: number;
    delete_date?: number | null;
}

export const SubredditBase: () => ISubreddit = () => ({
    description: null,
    favorite: false,
    id: uuid(),
    name: null,
    redditor_id: '',
    subreddit: '',
    create_date: 0,
    update_date: 0,
    delete_date: null
});
