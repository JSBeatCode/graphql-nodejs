const express = require('express')
const cors = require('cors');
const app = express();

const expGraphQL = require('express-graphql').graphqlHTTP;
const graphQLSchema = require('./schema.js');

app.use('/graphql', expGraphQL({
    schema: graphQLSchema,
    graphiql: true
}));

app.listen(8899, () => {
    console.log('http://localhost:'+ 8899 + '/graphql')
});
