import client from '../../client';
import { protectedResolver } from '../../users/users.utils';
import { hashtagConnectOrCreate } from '../photos.utils';

export default {
  Mutation:{
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        // 0. 받은 id와 일치하는 photo가 있는지 검사한다.
        // 1. 그 photo의 userId가 loggedInUser의 id와 같은지 확인.
        const oldHashtags = await client.photo.findFirst({
          where:{
            id,
            userId: loggedInUser.id
          }
        }).hashtags({select:{hashtag:true}});
        if(!oldHashtags){
          return{
            ok: false,
            error: "photo not found"
          };
        }
        // 2. 있다면 새로운 caption으로 업데이트 한다.
        // 2-1. 이전 hashtags를 모두 disconnect 한다.
        // 2-2. 받은 caption에 있는 hashtags를 createOrConnect한다.
        const photo = await client.photo.update({
          where: {id},
          data:{
            caption,
            hashtags: {
              disconnect: oldHashtags,
              connectOrCreate: hashtagConnectOrCreate(caption)
            }
          }
        });
        return {
          ok: true,
          photo
        }
      }
    )
  }
}