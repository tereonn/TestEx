import {connection} from '../connection';
import { getRowsNumber } from '../shared';

interface userList {
    name: string;
    rank: number;
}

const TABLE_NAME = 'tst_user';

export function readUserListWithRankCheckPaginated(minRank:number, offset: number, elementsOnPage: number): Promise<userList[]> {
    return new Promise((rslv, rjct) => {
        const queryString = `SELECT firstname, rank FROM ${TABLE_NAME} WHERE rank >= ${minRank} limit ${(offset)*elementsOnPage}, ${elementsOnPage}`;

        connection.query(queryString, (err, data) => {
            if (err){
                return rjct(err);
            }

            return rslv(data);
        });

    })
}

export function getUserRowsNumber(): Promise<number> {
    return getRowsNumber(TABLE_NAME);
}