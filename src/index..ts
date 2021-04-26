import express from 'express';

const app = express();

app.use((req: express.Request, res: express.Response) => {
    res.send('hello');
})

app.listen('3000', () => {
    console.log("listen on port 3000")
});
