import { Router } from 'express';
import { UserList } from '../Components';

const r = Router();

r.get('/', UserList.limitedUserReader);

export default r;

