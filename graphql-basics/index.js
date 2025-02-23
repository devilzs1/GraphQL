import {ApolloServer} from '@apollo/server'
import {startStandAloneServer} from '@apollo/server/standalone'


const typedefs = {}
const resolvers = {}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const {url} = await startStandAloneServer(server, {
    listen : {port : 4000},
});


console.log(`Server listening at : ${url}`);