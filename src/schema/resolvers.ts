import { Request } from "express";
import User from "../models/user";

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

export const resolvers = {
    Query: {
        books: () => books,
        login: async function ({ email, pass }: {
            email: string
            pass: string

        }, req: Request) {
            // retrieve the user from the database by email
            const user = await User.findOne({ email });
            if (!user) {
                const error: any = new Error("user does not exist");
                error.code = 401;
                throw error;
            }

            // compare the hashed password using bcrypt
            const isMatch = await bcrypt.compare(pass, user.password);
            if (!isMatch) {
                const error: any = new Error("invalid password");
                error.code = 401;
                throw error;
            }

            // generate a JSON Web Token (JWT)
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
            return { token: token, user: user };
        }

    },
    Mutation: {
        createUser: async function (_, { userInput }: any, req: any) {
            console.log(userInput.email, userInput.pass, userInput.username);
            const errors = [];
            // if (!validator.default.isEmail(userInput.email)) {
            //   errors.push({ message: "email is invalid" });
            // }
            // if (validator.default.isEmpty(userInput.pass)) {
            //   errors.push({ message: "password is invalid" });
            // }
            // if (validator.default.isEmpty(userInput.username)) {
            //   errors.push({ message: "username is invalid" });
            // }
            // if (errors.length > 0) {
            //   const error = new Error("invalid input");
            //   console.log(errors);
            //   error.data = errors;
            //   error.code = 422;
            //   throw error;
            // }
            const existingUser = await User.findOne({ email: userInput.email });
            if (existingUser) {
                const error = new Error("user already exists");
                throw error;
            }
            const email = userInput.email;
            const username = userInput.username;
            const password = userInput.pass;
            // hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // create a new user document and save it to the database
            const user = new User({
                username,
                email,
                password: hashedPassword,
            });
            const createdUser = await user.save();
            return { email: createdUser.email, username: createdUser.username, _id: createdUser._id.toString() };
        },

    }



};


// export const resolvers = {
//     Query: {
//         books: () => books,
//     },
//     createUser: async function ({ userInput }: any, req: any) {
//         console.log(userInput.email, userInput.pass, userInput.username);
//         const errors = [];
//         // if (!validator.default.isEmail(userInput.email)) {
//         //   errors.push({ message: "email is invalid" });
//         // }
//         // if (validator.default.isEmpty(userInput.pass)) {
//         //   errors.push({ message: "password is invalid" });
//         // }
//         // if (validator.default.isEmpty(userInput.username)) {
//         //   errors.push({ message: "username is invalid" });
//         // }
//         // if (errors.length > 0) {
//         //   const error = new Error("invalid input");
//         //   console.log(errors);
//         //   error.data = errors;
//         //   error.code = 422;
//         //   throw error;
//         // }
//         const existingUser = await User.findOne({ email: userInput.email });
//         if (existingUser) {
//             const error = new Error("user already exists");
//             throw error;
//         }
//         const email = userInput.email;
//         const username = userInput.username;
//         const password = userInput.pass;
//         // hash the password using bcrypt
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // create a new user document and save it to the database
//         const user = new User({
//             username,
//             email,
//             password: hashedPassword,
//         });
//         const createdUser = await user.save();
//         return { email: createdUser.email, username: createdUser.username, _id: createdUser._id.toString() };
//     },
//     hello: () => {
//         return "Hello world!";
//     },
//     login: async function ({ email, pass }: {
//         email: string
//         pass: string

//     }, req: Request) {
//         // retrieve the user from the database by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             const error: any = new Error("user does not exist");
//             error.code = 401;
//             throw error;
//         }

//         // compare the hashed password using bcrypt
//         const isMatch = await bcrypt.compare(pass, user.password);
//         if (!isMatch) {
//             const error: any = new Error("invalid password");
//             error.code = 401;
//             throw error;
//         }

//         // generate a JSON Web Token (JWT)
//         const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
//         return { token: token, user: user };
//     }
// };
