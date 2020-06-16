import { getRepository,Repository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { sucessCreate} from "../const/sucess";
import { INVALID_TOKEN, INVALID_VALIDATE_PASSWORD, INVALID_USER_DB} from "../const/errors";
import * as request from 'supertest';

const NAME = "leandro";
const EMAIL = "leandro@gmail.com";
const EMAIL2 = "leandro1@gmail.com";
const BIRTHDATE = '2019/01/20';
const CPF = 12312313;
const PASSWORD = '123456a';
const PASSWORD2 = '123456';
const TOKEN_ONE_WEEK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJpYXQiOjE1OTIyNDQxNDIsImV4cCI6MTU5Mjg0ODk0Mn0.ezzLyZiEOb9g3DChibwwcSu3qmbvQh9L6-o4-Sqk000';

describe('Simple create test login',() =>{

    let agent;
    let repository: Repository<User>;
    let user: User;

    const loginCreate = (variable: {data}, token ) => {
        const mutation = `
            mutation ( $data: CreateLoginInput! ) { 
                CreateLogin(data: $data) { 
                    sucess 
                }
            }
        `;
    
        return agent.post("/").send({ query: mutation, variables: variable }).set('Authorization', token);
    }

    before(async () => {

        agent = request('http://localhost:4000');
        repository = getRepository(User);

    });

    after(async() =>{
        await repository.delete({ email: EMAIL});
        await repository.delete({ email: EMAIL2});
    });

    it('should create login sucessfully', async function(){
        const res = await loginCreate( 
            {
                data: {
                    name: NAME,
                    cpf: CPF,
                    email: EMAIL,
                    birthDate: BIRTHDATE,
                    password: PASSWORD,
                }
            },
            TOKEN_ONE_WEEK
        );
        expect(sucessCreate).to.be.equals(res.body?.data?.CreateLogin?.sucess);
    });

    it('should error token', async function(){
        const res = await loginCreate( 
            {
                data: {
                    name: NAME,
                    cpf: CPF,
                    email: EMAIL,
                    birthDate: BIRTHDATE,
                    password: PASSWORD,
                }
            },
            TOKEN_ONE_WEEK+'1'
        );

        expect(INVALID_TOKEN).to.be.equals(res.body?.errors[0].message);
    });

    it('should create user error password', async function(){
        const res = await loginCreate( 
            {
                data: {
                    name: NAME,
                    cpf: CPF,
                    email: EMAIL2,
                    birthDate: BIRTHDATE,
                    password: PASSWORD2,
                }
            },
            TOKEN_ONE_WEEK
        );

        expect(INVALID_VALIDATE_PASSWORD).to.be.equals(res.body?.errors[0].message);
    });

    it('should create user error create user DB', async function(){
        const res = await loginCreate( 
            {
                data: {
                    name: NAME,
                    cpf: CPF,
                    email: EMAIL,
                    birthDate: BIRTHDATE,
                    password: PASSWORD,
                }
            },
            TOKEN_ONE_WEEK
        );

        expect(INVALID_USER_DB).to.be.equals(res.body?.errors[0].message);
    });

});