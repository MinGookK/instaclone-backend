import client from '../../client';
import { protectedResolver } from '../users.utils';

export default {
  Mutation:{
    unfollowUser: protectedResolver(async(_,{username},{loggedInUser}) =>{
      try {
        const existUser = await client.user.findUnique({where:{username}});
        if(!existUser){
          return{
            ok: false,
            error: "username is not exist."
          }
        }
        await client.user.update({
          where: {
            username: loggedInUser.username
          },
          data:{
            following:{
              disconnect:{
                username
              }
            }
          }
        });
        return {ok: true};
      } catch (error) {
        return{
          ok: false,
          error: "Promise error"
        }
      }
    })
  }
}