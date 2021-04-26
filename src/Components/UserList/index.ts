import express from 'express'
import { userListOffsValidator } from './validators';
import { readUserListWithRankCheckPaginated, getUserRowsNumber } from '../../DB/Components/UserList';


interface RequestWithOffset extends Request {
    query: {
        offset: any;
    }
}

export async function limitedUserReader(req: express.Request, res: express.Response) {
    try {
        const offset = (req as unknown as RequestWithOffset).query.offset;
        const validationResult = userListOffsValidator(offset)
        const usersOnPage = 20;
        const minimalRank = 20;

        if (!validationResult.isValid) {
            throw new Error(validationResult.message);
        }

        const queryResults = await Promise.all([readUserListWithRankCheckPaginated(minimalRank, offset, usersOnPage), getUserRowsNumber()]);

        res.send({
            total: queryResults[1],
            userCount: usersOnPage,
            page: offset,
            users: queryResults[0],
        });

    } catch (e) {
        res.send({
            message: e.message
        }).status(500);
    }
}