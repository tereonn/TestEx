import { connection } from "./connection";

export function getRowsNumber(tableName: string): Promise<number> {
    return new Promise((rslv, rjct) => {
        const queryString = `SELECT count(*) as total FROM ${tableName}`;

        connection.query(queryString, (err, data) => {
            if (err) {
                return rjct(err);
            }

            return rslv(data[0].total);
        })
    })
}
