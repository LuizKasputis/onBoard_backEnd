import { startServer } from "../server";
import { configServer } from "../config";
import { Connection } from "typeorm";

let dbConnection: Connection;

before(async () => {
    dbConnection = await configServer();
    startServer();
});

require('./test-login');

after( async () => {
    await dbConnection.close();
});