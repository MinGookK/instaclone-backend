require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
import http from "http"
import express from "express";
import logger from 'morgan'
import {typeDefs, resolvers} from './schema'
import { getUserByToken } from './users/users.utils';

//loggedInUser는 http header 토큰에 해당되는 사용자 데이터를 객체로 return 한다.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async(ctx)=> {
    if(ctx.req){
      return{ loggedInUser: await getUserByToken(ctx.req.headers.token)}
    }else{
      const {connection: { context }} = ctx;
      return {
        loggedInUser: context.loggedInUser,
      };
    }
  },
  subscriptions:{
    onConnect: async ({token}) =>{
      if(!token){
        throw new Error("you can't listen");
      }
      const loggedInUser = await getUserByToken(token);
      return {loggedInUser};
    }
  }
});

const PORT = process.env.PORT;

const app = express();
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);


httpServer.listen(PORT, ()=>{
  console.log(`🚀 Server is running on http://localhost:${PORT}/`);
});
