require('dotenv').config()

import mysql, { Connection } from 'mysql';
import Repository from './repository/Repository';
import MySQL from './repository/MySQL';
import Handler from './delivery/http/Handler';
import Router from './delivery/http/Router';
import { Router as ExpressRouter } from 'express';
import Server from './delivery/http/Server';

const connection: Connection = mysql.createConnection(String(process.env.DATABASE));
const repository: Repository = new MySQL(connection);
const router: ExpressRouter = Router(Handler(repository));
const server: Server = new Server(router);

server.run(Number(process.env.PORT));
