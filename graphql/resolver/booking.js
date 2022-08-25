
const Event = require('./../../models/event')
const Booking = require('./../../models/booking');
const { transformBooking, transformEvent } = require('./merge');



module.exports = {
    bookings: async (args, req) => {
        try {
            if (!req.isAuthenticated) {
                throw new Error("Unauthenticated!")
            }
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking)
            })

        } catch (error) {
            throw error
        }
    },
    bookEvent: async (args, req) => {
        try {
            if (!req.isAuthenticated) {
                throw new Error("Unauthenticated!")
            }
            const fetchEvent = await Event.findOne({ _id: args.eventId })
            const booking = new Booking({
                user: req.userId,
                event: fetchEvent
            })
            const result = await booking.save();
            return transformBooking(result)

        } catch (error) {
            throw error
        }
    },
    cancelBooking: async (args, req) => {
        try {
            if (!req.isAuthenticated) {
                throw new Error("Unauthenticated!")
            }
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })
            return event

        } catch (error) {
            throw error
        }
    }
}