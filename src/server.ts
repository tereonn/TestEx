import express from 'express';
import { initRouter } from './Router';

export function startServer(port: number) {

    const app = express();

    initRouter(app);

    app.listen(port, () => {
        console.log("listen on port", port);
    });
}