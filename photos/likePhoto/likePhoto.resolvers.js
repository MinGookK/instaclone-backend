import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation:{
    toggleLike: protectedResolver(
      async ( _, { id }, { loggedInUser }) => {
        // 받아온 photo id의 photo가 있는지 검사하기
        const photo = await client.photo.findUnique({where:{id}});
        if(!photo){
          return{
            ok: false,
            error: "Photo not found"
          };
        }
        // like 데이터 중에 userid가 loggedInUser의 id와 photo id를 가지고 있는 데이터가 있다면 delete, 없다면 create
        // photoId_userId field는 count 함수에서는 불러올 수가 없다. 그냥 난 이게 0개인지 1개인지 알고 싶은데 다 불러와서 좀 비효율적인 면이 있네.
        // 왜 안만들었는지 아직은 모르겠는데 별로 성능차이가 나지 않아서 그런건가?
        const ok = await client.like.findUnique({
          where:{
            photoId_userId:{
              photoId: id,
              userId: loggedInUser.id
            }
          },
          select:{id}
        });
        if(ok){
          await client.like.delete({
            where:{
              id: ok.id
            }
          });
        }else{
          await client.like.create({
            data:{
              userId: loggedInUser.id,
              photoId: photo.id
            }
          });
        }
        return{
          ok: true,
        }
      }
    ) 
  }
}
