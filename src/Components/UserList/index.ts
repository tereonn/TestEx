import express from 'express'
import { userListOffsValidator } from './validators';
import { readUserListWithRankCheckPaginated } from '../../DB/Components/UserList';


interface RequestWithOffset extends Request {
    query: {
        offset: any;
    }
}

export async function limitedUserReader(req: express.Request, res: express.Response) {
    try {
        const offset = (req as unknown as RequestWithOffset).query.offset;
        const validationResult = userListOffsValidator(offset)

        if (!validationResult.isValid) {
            throw new Error(validationResult.message);
        }

        const dbRes = await readUserListWithRankCheckPaginated(20, offset, 10);

        res.send(dbRes);


    } catch (e) {
        res.send({
            message: e.message
        }).status(500);
    }
}