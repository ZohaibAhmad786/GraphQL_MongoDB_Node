const express = require("express");
const bodyParser = require("body-parser");

const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');



const Event = require('./models/event')
const User = require('./models/user')


const events = [];

var schema = buildSchema(`

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String
    }
    
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type EventQuery { 
        events: [Event!]!
        
    }

    type MutationQuery { 
        createEvents(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }

    schema {
        query: EventQuery
        mutation: MutationQuery
    }
`);

var root = {
    events: (parent, args, context, info) => {
        return Event
            .find()
            .then((events) => {
                return events.map((event) => {
                    return { ...event._doc }
                })
            }).catch((err) => {
                console.log(err)
                throw err
            })// if we don't pass argument it will return all data
    },
    createEvents: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "62fbacf04b63d8bb9a6bb645"
        })

        // events.push(event);
        let createdEvent;
        return event
            .save()
            .then((result) => {
                // console.log(result);
                createdEvent = { ...result._doc }
                return User.findById("62fbacf04b63d8bb9a6bb645")
            })
            .then((user) => {
                if (!user) {
                    throw new Error("User not found!");
                }
                user.createdEvents.push(event)
                user.save()
            })
            .then((result) => {
                return createdEvent;
            })
            .catch((err) => {
                console.log(err)
                throw err
            })

    },
    createUser: (parent, args, context, info) => {
        return User.findOne({ email: args.userInput.email })
            .then((user) => {
                if (user) {
                    throw new Error("User Already Exists!")
                }
                return bcrypt.hash(args.userInput.password, 12)
            }).then((password) => {
                const user = new User({
                    email: args.userInput.email,
                    password: password
                })
                return user.save();

            }).then((result) => {
                return { ...result._doc, password: null }
            })
            .catch((err) => {
                throw err
            })

    }


};

var app = express();

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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









