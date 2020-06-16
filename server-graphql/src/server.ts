import { default as resolvers } from './resolvers';
const { GraphQLServer } = require('graphql-yoga')

export const startServer = async () => {
        
    const server = new GraphQLServer({
        typeDefs : './src/schema/schema.graphql',
        resolvers,
        context: ({ request, response }) => {
            return { request, response };
        },
    })
    
    await server.start(() => console.log(`Server is running on http://localhost:4000`));
};