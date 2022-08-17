
const bcrypt = require('bcryptjs');
const Event = require('./../../models/event')
const User = require('./../../models/user');
const Booking = require('./../../models/booking');


const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        events.map(event => {
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
        return events;
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findOne({ _id: eventId });
        return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event.creator)
        }
    } catch (error) {
        throw error
    }
}

const user = async (userId) => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    }
    catch (err) {
        throw err
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()//.populate('creator')// if you have created a reference then you can get the referenced data by passing ref to populate
            return events.map((event) => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            })
        } catch (err) {
            console.log(err)
            throw err
        }// if we don't pass argument it will return all data
    },
    createEvents: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "62fbacf04b63d8bb9a6bb645"
        })

        // events.push(event);
        try {
            let createdEvent;
            const result = await event.save()
            // console.log(result);
            createdEvent = {
                ...result._doc,
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            const creator = await User.findById("62fbacf04b63d8bb9a6bb645")

            if (!creator) {
                throw new Error("User not found!");
            }
            creator.createdEvents.push(event)
            await creator.save()
            return createdEvent;
        } catch (error) {
            throw error
        }

    },
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })

            if (existingUser) {
                throw new Error("User Already Exists!")
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save();
            return { ...result._doc, password: null }

        } catch (err) {
            throw err
        }

    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    event: singleEvent.bind(this, booking._doc.event),
                    user: user.bind(this, booking._doc.user),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })

        } catch (error) {
            throw error
        }
    },
    bookEvent: async (args) => {
        try {
            const fetchEvent = await Event.findOne({ _id: args.eventId })
            const booking = new Booking({
                user: "62fbacf04b63d8bb9a6bb645",
                event: fetchEvent
            })
            const result = await booking.save();
            return {
                ...result._doc,
                event: singleEvent.bind(this, booking._doc.event),
                user: user.bind(this, booking._doc.user),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            }

        } catch (error) {
            throw error
        }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate("event");
            console.log(booking.event._doc)
            const event = { ...booking.event._doc, creator: user.bind(this, booking.event._doc.creator) }
            await Booking.deleteOne({_id:args.bookingId})
            return event

        } catch (error) {
            throw error
        }
    }
}