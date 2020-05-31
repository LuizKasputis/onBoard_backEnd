import { configServer } from "./config";
import {User} from './entity/User';
import {getRepository, Repository} from 'typeorm';
import { UserType } from './type/UserType';
const { GraphQLServer } = require('graphql-yoga')


configServer();

const resolvers = {
  Mutation: { 
    Login: async (parent, args) => {

      const data: Repository<User> = getRepository(User);
      try {
        
        const user: User = await data.findOne({
          where: [
            { email: args.data.email },
          ]
        });
        if(!user){
          throw new Error("Credências inválidas, confira seu email e senha");
        }

        const token = '';
        return(new UserType(user, token));
        
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