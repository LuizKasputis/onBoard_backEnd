import { Repository } from "typeorm/repository/Repository";
import { User } from "../entity/User";
import { hashPassword } from "../hasPassword/haspassword";
import { getRepository } from "typeorm";
import {SECRET_KEY, TEN_MINUTES, ONE_WEEK} from '../const/const';
import { UserType } from "../type/UserType";
import { INVALID_CREDENTIALS} from "../const/errors";
import * as jwt from 'jsonwebtoken';

export default {

    Mutation: { 
        Login: async (parent, args ) => {

            const data: Repository<User> = getRepository(User);
            const loginInput = args.data;       
            const user: User = await data.findOne({
                where: [
                { email: loginInput.email },
                ]
            });

            if(!user){
                throw new Error(INVALID_CREDENTIALS);
            }
                
            if (user.password === hashPassword(loginInput.password)) {

                const exp_time: number = loginInput.rememberMe ? ONE_WEEK : TEN_MINUTES;
                const token = jwt.sign({ userId: user.id }, SECRET_KEY, {expiresIn: exp_time});           
                
                return(new UserType(user, token));

            }else{
                throw new Error(INVALID_CREDENTIALS);
            }
        }   
    }
}