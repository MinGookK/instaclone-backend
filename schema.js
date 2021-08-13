// GraphQL tools 가 movies 폴더에서 typeDefs, resolvers를 합쳐주는 역할을 함
import {
  loadFilesSync, 
  mergeResolvers, 
  mergeTypeDefs
} from 'graphql-tools'

const loadTypes= loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadResolvers= loadFilesSync(`${__dirname}/**/*.resolvers.js`);

export const typeDefs = mergeTypeDefs(loadTypes);
export const resolvers = mergeResolvers(loadResolvers);