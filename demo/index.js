const http = require('http');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');


const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/graphql-demo', { useNewUrlParser: true })
    .then(
        () => { console.log('Tietokantayhteys onnistui'); },
        err => { console.log(err); }
    );

const port = process.env.PORT || 3000;

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    playground: {
        endpoint: '/graphql'
    }
});
server.applyMiddleware({ app });

app.listen({ port: port }, () => {
    console.log(`Servu pystyssä osoitteessa http://localhost:${port}${server.graphqlPath}`);
    console.log(`Playgroundin endpoint on ${server.playgroundOptions.endpoint}`);
});