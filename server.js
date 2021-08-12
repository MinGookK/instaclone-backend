require('dotenv').config();
import { ApolloServer } from 'apollo-server';
import schema from './schema'
import { getUserByToken } from './users/users.utils';


const server = new ApolloServer({
  schema,
  context: async({req})=> ({ loggedInUser: await getUserByToken(req.headers.authorization)})
});

const PORT = process.env.PORT;

server.listen(PORT).then(() => console.log(`🚀 Server is running on http://localhost:${PORT}/`));
