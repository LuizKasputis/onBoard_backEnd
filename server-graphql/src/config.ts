import {createConnection} from 'typeorm';

export function configServer() {
    createConnection()
        .catch(error => console.log(error));
}