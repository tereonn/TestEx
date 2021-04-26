import express from 'express';
import UserRouter from './UserList';

export function initRouter(app: express.Application) {
    app.use('/', UserRouter);
}