import {connection} from '../connection';

interface userList {
    name: string;
    rank: number;
}

export interface userListWithData {
    total: number;
    userCount: number;
    page: number;
    users: userList[];
}

const TABLE_NAME = 'test_user';

export function readUserListWithRankCheckPaginated(minRank:number, offset: number, elementsOnPage: number): Promise<userListWithData> {

    return new Promise((rslv, rjct) => {
        const queryString = `SELECT firstname, rank FROM ${TABLE_NAME} WHERE rank >= ${minRank} limit ${(offset)*elementsOnPage}, ${elementsOnPage}`;

        connection.query(queryString, (err, data) => {
            if (err){
                return rjct(err);
            }

            return rslv(data);
        });

    }).then(r => {
        return new Promise((rslv, rjct) => {
            const queryString = `SELECT count(*) as total FROM ${TABLE_NAME}`;

            connection.query(queryString, (err, data) => {
                if (err) {
                    return rjct(err);
                }

                const rowCount = data[0];

                return rslv({
                    total: data[0].total,
                    userCount: elementsOnPage,
                    page: offset,
                    users: r as userList[],
                });
            })
        })
    })
}
