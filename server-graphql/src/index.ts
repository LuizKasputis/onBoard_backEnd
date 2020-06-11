import { configServer } from "./config";
import {User} from './entity/User';
import {getRepository, Repository} from 'typeorm';
import { UserType } from './type/UserType';
import { hashPassword } from "./hasPassword/haspassword";
const { GraphQLServer } = require('graphql-yoga')


var jwt = require('jsonwebtoken');
const SECRET_KEY = 'CHAVESECRETA';
const TEN_MINUTES = 600;
const ONE_WEEK = 300000;

configServer();

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
          throw new Error("Credências inválidas, confira seu email e senha");
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
          throw new Error("Credências inválidas, confira seu email e senha");
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

server.start(() => console.log(`Server is running on http://localhost:4000`))