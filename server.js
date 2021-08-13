require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
import express from "express";
import logger from 'morgan'
import {typeDefs, resolvers} from './schema'
import { getUserByToken } from './users/users.utils';


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({req})=> ({ loggedInUser: await getUserByToken(req.headers.authorization)})
});

const PORT = process.env.PORT;

const app = express();
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
server.applyMiddleware({ app });
app.listen(PORT, ()=>{
  console.log(`🚀 Server is running on http://localhost:${PORT}/`);
});
