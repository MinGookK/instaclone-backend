import client from '../../client';
import { protectedResolver } from '../users.utils';

export default {
  Mutation: {
    followUser: protectedResolver(async (_, 
      {username}, 
      {loggedInUser}) => {
        try {
          const existUser = await client.user.findUnique({where:{username}});
          if(!existUser){
            return {
              ok: false,
              error: "username is not exist."
            }
          }
          await client.user.update({
            where: {
              username: loggedInUser.username
            },
            data: {
              following:{
                connect:{
                  username
                }
              }
            }
          });
          return {ok: true}
        } catch (error) {
          return {
            ok: false,
            error: "promise error"
          }
        }
      }
    )
  }
}