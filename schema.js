import { gql } from 'apollo-server';
import client from './client'

// The GraphQL schema
export const typeDefs = gql`
  type Movie {
    id: Int!
    title: String!
    year: Int!
    genre: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
  }
  type Mutation {
    createMovie(title: String!, year: Int!, genre: String): Movie
    deleteMovie(id: Int!): Movie
    updateMovie(id: Int! year: Int!): Movie
  }
`;

// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    movies: () => client.movie.findMany(),
    movie: (_,  { id }) => client.movie.findUnique({
      where:{
        id
      }
    }),
  },
  Mutation: {
    createMovie: (_, { title, year, genre }) => client.movie.create({data:{
      title,
      year,
      genre
    }}),
    deleteMovie: (_, { id }) => client.movie.delete({
      where: {
        id
      }
    }),
    updateMovie: (_, {id, year}) => client.movie.update({
      where: { id }, data: { year }
    })
  },
  
};