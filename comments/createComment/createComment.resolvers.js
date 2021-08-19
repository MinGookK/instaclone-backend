import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation:{
    createComment: protectedResolver(
      async (_, { id, payload }, { loggedInUser }) => {
        // photo id 가 유효한지 검사
        const ok = client.photo.findUnique({where:{id},select:{id}});
        if(!ok){
          return{
            ok: false,
            error: "Photo not found"
          }
        }
        await client.comment.create({
          data:{
            user:{connect:{id: loggedInUser.id}},
            photo:{connect:{id}},
            payload
          }
        });
        return {
          ok: true
        }
      }
    )
  }
}