const express = require("express");
const bodyParser = require("body-parser");



const mongoose = require('mongoose');

var { graphqlHTTP } = require('express-graphql');
var GraphQLSchema = require('./graphql/schema');
var GraphQLResolvers = require('./graphql/resolver');

var isAuthenticated= require("./middleware/is-auth")




var schema = GraphQLSchema;

var root = GraphQLResolvers;

var app = express();

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(isAuthenticated)

app.use('/graphql', graphqlHTTP({
    schema: schema,//scehma
    rootValue: root,// resolvers
    graphiql: true, // graphiql interface
}));



app.get('/', (req, res, next) => {
    res.send("Hi From Server!")
})


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWD}@cluster0.5tgljgt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000, () => {
            console.log("Server listening!!!")
        })
    }).catch(err => console.log(err));;









