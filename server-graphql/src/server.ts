import { Repository } from "typeorm/repository/Repository";
import { User } from "./entity/User";
import { hashPassword } from "./hasPassword/haspassword";
import { getRepository } from "typeorm";
import {SECRET_KEY, TEN_MINUTES, ONE_WEEK} from './const/const';
import { UserType } from "./type/UserType";
import { INVALID_CREDENTIALS } from "./const/errors";

const { GraphQLServer } = require('graphql-yoga')
var jwt = require('jsonwebtoken');

export const startServer = async () => {
    const resolvers = {
        Mutation: { 
        Login: async (parent, args) => {
    
            const data: Repository<User> = getRepository(User);
            const loginInput = args.data;
            try {
            
            const user: User = await data.findOne({
                where: [
                { email: loginInput.email },
                ]
            });
    
            if(!user){
                throw new Error(INVALID_CREDENTIALS);
            }
            
            if (user.password === hashPassword(loginInput.password)) {
                
                var exp_time: number;
    
                if (loginInput.rememberMe){
                exp_time = ONE_WEEK;
                }else{
                exp_time = TEN_MINUTES;
                }
    
                const token = jwt.sign({ userId: user.id }, SECRET_KEY, {expiresIn: exp_time});           
                return(new UserType(user, token));
    
            }else{
                throw new Error(INVALID_CREDENTIALS);
            }
            
            }catch(error){
            return error;
            }
        },
        CreateLogin: async (parent, args) => {
            const loginInput = {
            name: args.data.name,
            cpf: args.data.cpf,
            email: args.data.email,
            birthDate: args.data.birthDate,
            password: hashPassword(args.data.password),
            };
            try{
            await getRepository(User).save(loginInput);
            return {sucess: 'Usuário salvo com sucesso!'};
            }catch(error){
            return error;
            }
        }
        },
        
    }
    
    const server = new GraphQLServer({
        typeDefs : './src/schema/schema.graphql',
        resolvers,
    })
    
    await server.start(() => console.log(`Server is running on http://localhost:4000`));
};