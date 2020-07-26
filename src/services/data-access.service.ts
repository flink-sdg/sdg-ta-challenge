import {Pool} from 'pg';
import {IQuery} from '../types';

export class DataAccessService
{
    private static _dataAccessService: DataAccessService | null = null;
    
    public query(query: string | IQuery): Promise<any>
    {
        return this._pool.query(query);
    }
    
    private constructor(
        private _pool: any
    )
    {
    
    }
    
    public static instance(
        pool: any = new Pool(),
    ): DataAccessService
    {
        if(!DataAccessService._dataAccessService)
        {
            DataAccessService._dataAccessService = new DataAccessService(pool);
        }
        
        return DataAccessService._dataAccessService;
    }
    
    public static newInstance(
        pool: any = new Pool(),
    ): DataAccessService
    {
        return new DataAccessService(pool);
    }
    
    public end()
    {
        this._pool.end();
    }
}
