import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation:{
    deletePhoto: protectedResolver(
      async (_, { id }, { loggedInUser }) => {
        //지워졌을 때 hashtag가 0개인 것이 생기면 지워줘야 할까?
        // 지워주자
        const photo = await client.photo.findUnique({where:{id}});
        if(!photo){
          return {
            ok: false,
            error: "Photo not found"
          };
        }else if(photo.userId !== loggedInUser.id){
          return {
            ok: false,
            error: "authorization failed"
          };
        }else{
          await client.photo.delete({where:{id}});
          return{
            ok: true
          }
        }
      }
    )
  }
}