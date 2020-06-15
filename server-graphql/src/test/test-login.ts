import { getRepository,Repository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { sucessCreate } from "../const/sucess";
import * as request from 'supertest';
import { INVALID_CREDENTIALS } from "../const/errors";
import { ONE_WEEK, TEN_MINUTES } from "../const/const";

const NAME = "jean2";
const EMAIL = "jean2@gmail.com";
const BIRTHDATE = '2019/01/20';
const CPF = 12312313;
const PASSWORD = '123456';

describe('Simple test login',() =>{

    let agent;
    let repository: Repository<User>;
    let user: User;

    const loginMutation = (variable: {data} ) => {
        const mutation = `
            mutation ( $data: LoginInputType! ) { 
            Login(data: $data) { 
                user { 
                    id 
                    name 
                    email 
                    birthDate 
                    cpf 
                } 
                token 
            }
        }`;
    
        return agent.post("/").send({ query: mutation, variables: variable })
    };

    const loginCreate = (variable: {data} ) => {
        const mutation = `
            mutation ( $data: CreateLoginInput! ) { 
                CreateLogin(data: $data) { 
                    sucess 
                }
            }
        `;
    
        return agent.post("/").send({ query: mutation, variables: variable })
    }

    before(async () => {

        agent = request('http://localhost:4000');
        repository = getRepository(User);

    });

    after(async() =>{
        await repository.delete({ email: EMAIL});
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
            }
        );
        expect(sucessCreate).to.be.equals(res.body?.data?.CreateLogin?.sucess);
    });

    it('should login sucessfully', async function(){
        const res = await loginMutation( 
            {
                data: {
                    email: EMAIL,
                    password: PASSWORD,
                    rememberMe: true, 
                }
            }
        );
        expect(NAME).to.be.equals(res.body?.data?.Login.user.name);
        expect(EMAIL).to.be.equals(res.body?.data?.Login.user.email);
        expect(CPF).to.be.equals(res.body?.data?.Login.user.cpf);
        expect(BIRTHDATE).to.be.equals(res.body?.data?.Login.user.birthDate);
    });

    it('should return invalid credations', async function(){
        const res = await loginMutation( 
            {
                data: {
                    email: EMAIL,
                    password: '123',
                    rememberMe: false, 
                }
            }
        );
        expect(res.body.errors[0].message).to.be.equals(INVALID_CREDENTIALS);
    });

    it('should token experiation 10 min', async function(){
        const res = await loginMutation( 
            {
                data: {
                    email: EMAIL,
                    password: PASSWORD,
                    rememberMe: false, 
                }
            }
        );

        const timeToken = jwt.decode(res.body.data.Login.token);
        expect(timeToken.exp - timeToken.iat).to.be.equals(TEN_MINUTES);

    });

    it('should token experiation 1 week', async function(){
        const res = await loginMutation( 
            {
                data: {
                    email: EMAIL,
                    password: PASSWORD,
                    rememberMe: true, 
                }
            }
        );

        const timeToken = jwt.decode(res.body.data.Login.token);
        expect(timeToken.exp - timeToken.iat).to.be.equals(ONE_WEEK);
    });

});