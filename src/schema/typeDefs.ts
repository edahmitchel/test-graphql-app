// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

#   my data 
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

 
type RootQuery {
    login(email:String!,pass:String!):AuthData!
}

type RootMutation{
    createUser(userInput:UserInputData):User!
}

`;
