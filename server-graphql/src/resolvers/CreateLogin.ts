import { User } from "../entity/User";
import { hashPassword } from "../hasPassword/haspassword";
import { getRepository } from "typeorm";
import {SECRET_KEY} from '../const/const';
import { INVALID_TOKEN, INVALID_VALIDATE_PASSWORD, INVALID_USER_DB } from "../const/errors";
import * as jwt from 'jsonwebtoken';

const Regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

export default {

    Mutation: { 
        CreateLogin: async (parent, args, context) => {

            const token =  context.request.headers.authorization;

            if(!Regex.exec(args.data.password)){
                throw new Error(INVALID_VALIDATE_PASSWORD);
            }

            const loginInput = {
                name: args.data.name,
                cpf: args.data.cpf,
                email: args.data.email,
                birthDate: args.data.birthDate,
                password: hashPassword(args.data.password),
            };

                
            try {
                await jwt.verify(token, SECRET_KEY);
            } catch(err) {
                throw new Error(INVALID_TOKEN);
            }
            
            try{
                await getRepository(User).save(loginInput);
            }catch(err){
                throw new Error(INVALID_USER_DB);
            }

            return {sucess: 'Usuário salvo com sucesso!'};
            
        }
    }
}