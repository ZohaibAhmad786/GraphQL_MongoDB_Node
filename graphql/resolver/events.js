

const Event = require('./../../models/event')
const User = require('./../../models/user');
const { dateToString } = require('./../../helpers/date');
const { transformEvent } = require('./merge');



module.exports = {
    events: async () => {
        try {
            const events = await Event.find()//.populate('creator')// if you have created a reference then you can get the referenced data by passing ref to populate
            return events.map((event) => {
                return transformEvent(event)
            })
        } catch (err) {
            console.log(err)
            throw err
        }// if we don't pass argument it will return all data
    },
    createEvents: async (args, req) => {

        if (!req.isAuthenticated) {
            throw new Error("Unauthenticated!")
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: req.userId
        })

        // events.push(event);
        try {
            let createdEvent;
            const result = await event.save()
            // console.log(result);
            createdEvent = transformEvent(result);
            const creator = await User.findById(req.userId)

            if (!creator) {
                throw new Error("User not found!");
            }
            creator.createdEvents.push(event)
            await creator.save()
            return createdEvent;
        } catch (error) {
            throw error
        }

    }
}