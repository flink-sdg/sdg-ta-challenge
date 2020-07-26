import {QueryBuilder} from '../builders/query.builder';
import {EEntities, ESqlCommand} from '../types';

let queryBuilder: QueryBuilder;

beforeEach(() => queryBuilder = new QueryBuilder());

describe('query.builder.ts tests', () => {
    test('raze should reset all properties to undefined', () => {
        expect(queryBuilder.command(ESqlCommand.SELECT)
                   .entity(EEntities.REDDITORS)
                   .query()).toEqual( {
                                                  text: 'SELECT * from redditors WHERE delete_date IS NULL',
                                                  values: []
                                              });
        expect(queryBuilder.raze()
                   .entity(EEntities.REDDITORS)
                   .query()).toBeNull();
    });
    
   test('query returns null if command or entity is not set', () => {
        expect(queryBuilder.command(ESqlCommand.SELECT)
                   .query()).toBeNull();
       expect(queryBuilder
                  .raze()
                  .entity(EEntities.REDDITORS)
                  .query()).toBeNull();
   });
   
   test('query to return a basic select all query where delete_date IS NULL when query is build with only command and entity', () => {
       expect(queryBuilder.command(ESqlCommand.SELECT)
                  .entity(EEntities.REDDITORS)
                  .query()).toEqual( {
                                         text: 'SELECT * from redditors WHERE delete_date IS NULL',
                                         values: []
                                     });
   });
    
    test('query to return a basic select all query including items with a delete_date when query is build with, command, entity and deleted argument string true', () => {
        expect(queryBuilder.command(ESqlCommand.SELECT)
                   .entity(EEntities.REDDITORS)
                   .deleted('true')
                   .query()).toEqual( {
                                          text: 'SELECT * from redditors',
                                          values: []
                                      });
    });
});
