import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Request } from 'express';

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
  username: string
  email: string
  password: string
}
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>("User", schema);

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }
  type User {
    _id: ID!
    email: String!
    password: String!
    username: String!
    
}
type AuthData {
    user:User!
    token:String!
}
input UserInputData {
    email: String!
    username: String!
    pass: String!
}

 
type Query {
    login(email:String!,pass:String!):AuthData!
}

type Mutation{
    createUser(userInput:UserInputData):User!
}

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
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
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books
  },
  Mutation: {
    createUser: async function ({ userInput }: any, req: any) {
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

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);