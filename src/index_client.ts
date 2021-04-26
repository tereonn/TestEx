import { TestRequester } from './client';

const r = new TestRequester('http://some.site/user', 'offset');

r.getLimitedUserData().then(data => {
    console.log(data);
})