
const bcrypt = require('bcryptjs');
const User = require('./../../models/user');
var jwt = require('jsonwebtoken');

module.exports = {
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
    login: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.email });

            if (existingUser) {
                const isEqual = await bcrypt.compare(args.password, existingUser.password)
                if (isEqual) {
                    const token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, "someSuperKeyThatCanBeAnything", {
                        expiresIn: "1h"
                    });
                    return {
                        userId: existingUser.id,
                        token: token,
                        tokenExpiration: 60 * 60 * 1
                    }

                } else {
                    throw new Error("Password is incorrect!")
                }
            } else {
                throw new Error("User doest not exist!")
            }
        } catch (err) {
            throw err
        }
    }
}