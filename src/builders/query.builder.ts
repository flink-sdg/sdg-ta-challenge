import winston from 'winston';

import {IRedditor, ISubreddit, RedditorBase, SubredditBase} from '../models';
import {EEntities, ESqlCommand, IQuery} from '../types';

export class QueryBuilder
{
    private _baseObject: IRedditor | ISubreddit;
    private _columns: string;
    private _command: ESqlCommand;
    private _deleted: string;
    private _entity: EEntities;
    private _valueObject: IRedditor | ISubreddit;
    private _where: {column: string, value: any};
    
    public constructor(private _logger: any = winston.createLogger({
                                                                       level:      process.env.LOGLEVEL,
                                                                       format:     winston.format.json(),
                                                                       transports: [new winston.transports.Console()]
                                                                   }))
    {
        
    }
    
    public baseObject(baseObject: IRedditor | ISubreddit): QueryBuilder
    {
        this._baseObject = baseObject;
        
        return this;
    }
    
    public command(command: ESqlCommand): QueryBuilder
    {
        this._command = command;
        
        return this;
    }
    
    public deleted(deleted?: string): QueryBuilder
    {
        this._deleted = deleted;
        
        return this;
    }
    
    public entity(entity: EEntities): QueryBuilder
    {
        this._entity = entity;
        
        return this;
    }
    
    public filter(filter?: string): QueryBuilder
    {
        return this;
    }
    
    public columns(columns?: string): QueryBuilder
    {
        this._columns = columns;
        
        return this;
    }
    
    public valueObject(valueObject: IRedditor | ISubreddit): QueryBuilder
    {
        this._valueObject = valueObject;
        
        return this;
    }
    
    public where(condition: {column: string, value: any}): QueryBuilder
    {
        this._where = condition;
        
        return this;
    }
    
    public query(): IQuery | null
    {
        if(this._command && this._entity)
        {
            let text: string = this._command === ESqlCommand.DELETE ? ESqlCommand.UPDATE : this._command;
            let values: any[] = [];
            
            const columnArray: string[] = this._columns ? this._columns.split(',') : [];
            const columns: string = this._columns ? Object.keys(this.getBaseObjectFromEntity(this._entity))
                .filter((key: string) => columnArray.includes(key))
                .join(',') : '*';
            
            if(this._command === ESqlCommand.SELECT)
            {
                text += ` ${columns} from ${this._entity}`;
            }
            else if(this._command === ESqlCommand.INSERT && this._baseObject && this._valueObject)
            {
                const query: IQuery = this.generateValueText(this._baseObject, this._valueObject, this._command);
                
                values = [...values, ...query.values];
                
                text += ` into ${this._entity} ${query.text}`;
            }
            else if((this._command === ESqlCommand.UPDATE || this._command === ESqlCommand.DELETE) && this._baseObject && this._valueObject)
            {
                const query: IQuery = this.generateValueText(this._baseObject, this._valueObject, this._command);
                
                values = [...values, ...query.values];
                
                text += ` ${this._entity} SET ${query.text}`;
            }
            else
            {
                return null;
            }
            
            if(this._command !== ESqlCommand.INSERT && ((this._where && Object.keys(this.getBaseObjectFromEntity(this._entity))
                .includes(this._where.column)) || (!this._deleted || this._deleted !== 'true')))
            {
                text += ` WHERE `;
                
                if((this._where && Object.keys(this.getBaseObjectFromEntity(this._entity))
                    .includes(this._where.column)) && (!this._deleted || this._deleted !== 'true'))
                {
                    text += `${this._where.column}=%% AND delete_date IS NULL`;
                    
                    values = [...values, this._where.value];
                }
                else if(this._where && Object.keys(this.getBaseObjectFromEntity(this._entity))
                    .includes(this._where.column))
                {
                    text += `${this._where.column}=%%`;
                    
                    values = [...values, this._where.value];
                }
                else
                {
                    text += `delete_date IS NULL`;
                }
            }
            
            if(!this._deleted || this._deleted !== 'true')
            {
            
            }
            
            //TODO: This could use some improvement, we run a risk of end users entering %% within their values and having incorrect replacements.
            
            let index: number = 0;
            while(text.indexOf('%%') >= 0)
            {
                text = text.replace('%%', `$${++index}`);
            }
            
            if(this._command === ESqlCommand.INSERT || this._command === ESqlCommand.UPDATE || this._command === ESqlCommand.DELETE)
            {
                text += ` RETURNING ${columns}`;
            }
            
            this._logger.debug({
                                  text,
                                  values
                              });
            
            return {
                text,
                values
            };
        }
        
        return null;
    }
    
    public raze()
    {
        this._baseObject = undefined;
        this._columns = undefined;
        this._command = undefined;
        this._deleted = undefined;
        this._entity = undefined;
        this._valueObject = undefined;
        this._where = undefined;
    }
    
    private generateValueText(baseObject: any, valueObject: any, sqlCommand: ESqlCommand): IQuery
    {
        delete valueObject.id;
        delete baseObject.create_date;
        delete baseObject.update_date;
        delete baseObject.delete_date;
        
        Object.keys(baseObject).forEach((key: string) =>
                                        {
                                            if(Object.keys(valueObject).includes(key))
                                            {
                                                baseObject[key] = valueObject[key];
                                            }
                                            else if(key !== 'id')
                                            {
                                                delete baseObject[key];
                                            }
                                        });
        
        //TODO: This could use some improvement, we run a risk of end users entering %% within their values and having incorrect replacements.
        
        return {
            text:   `(${Object.keys(baseObject)
                .join(',')}) ${sqlCommand === ESqlCommand.INSERT ? 'VALUES' : sqlCommand === ESqlCommand.UPDATE ? '= ' : ''}(${Object.keys(
                baseObject).map(() => '%%').join(',')})`,
            values: Object.values(baseObject)
        };
    }
    
    //TODO: Could use factory here, though as this will likely not be used often, would only create a factory with more usage.
    
    private getBaseObjectFromEntity(entity: EEntities): IRedditor | ISubreddit | null
    {
        if(entity === EEntities.REDDITORS)
        {
            return RedditorBase();
        }
        else if(entity === EEntities.SUBREDDITS)
        {
            return SubredditBase();
        }
        
        return null;
    }
}
