
const Event = require('./../../models/event')
const User = require('./../../models/user');
const {dateToString} = require('./../../helpers/date');

const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}
const transformBooking = booking => {
    return {
        ...booking._doc,
        event: singleEvent.bind(this, booking._doc.event),
        user: user.bind(this, booking._doc.user),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}


const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return transformEvent(event)
        })
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findOne({ _id: eventId });
        return transformEvent(event)
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

exports.user = user;
exports.singleEvent = singleEvent;
exports.events = events;
exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;