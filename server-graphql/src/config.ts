import {createConnection, Connection} from 'typeorm';
import * as dotenv from 'dotenv';
import path = require('path');

export async function configServer(): Promise<Connection>{
    const envFileName = process?.env?.TEST ? '.env.test' : '.env';
    dotenv.config({ path: path.join(__dirname, '..' , envFileName) });
    return await createConnection();
}