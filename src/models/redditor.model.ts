import {uuid} from 'uuidv4';

export interface IRedditor
{
    email_address?: string | null;
    first_name?: string | null;
    id: string;
    last_name?: string | null;
    time_zone_identifier?: string | null;
    email_enabled?: boolean | null;
    create_date: number;
    update_date: number;
    delete_date?: number | null;
}

export const RedditorBase: () => IRedditor = () => ({
    email_address:        null,
    first_name:           null,
    id:                   uuid(),
    last_name:            null,
    time_zone_identifier: null,
    email_enabled:        false,
    create_date:          0,
    update_date:          0,
    delete_date:          null
});
