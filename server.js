import { ApolloServer, gql } from 'apollo-server';

// The GraphQL schema
const typeDefs = gql`
  type Movie {
    id: Int
    title: String
    year: Int
  }
  type Query {
    movies: [Movie]
    movie: Movie
  }
  type Mutation {
    createMovie(title: String!): Boolean
    deleteMovie(title: String!): Boolean
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    movies: () => [],
    movie: () => ({ title: 'hello', year: 2021 }),
  },
  Mutation: {
    createMovie: (_, { title }) => {
      console.log(title);
      return true;
    },
    deleteMovie: (_, { title }) => {
      console.log(title);
      return false;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(() => console.log('Server is running on http://localhost:4000/'));
