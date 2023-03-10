const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema.js');
const cors = require('cors');
const app = express();

// app.use('/graphql', expressGraphQL({
//     schema:schema,
//     graphql:true
// }));
app.use(cors());

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}));


app.listen(4000, () => {
    console.log('Server is running on port 4000...');
});