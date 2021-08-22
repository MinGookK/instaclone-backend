import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation:{
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        // 기본적으로 message data를 create 한다.
        console.log(payload, roomId, userId, loggedInUser.id)
        let room = null;
        if(!roomId && !userId){
          return{
            ok: false,
            error: "userId 혹은 roomId가 필요합니다."
          }
        }
        // roomId가 전달되면 기존의 room에 loggedInUser를 연결해서 create
        else if(roomId){
          room = await client.room.findUnique({where:{id:roomId},select:{id: true}});
          if(!room){
            return{
              ok: false,
              error: "room not found"
            }
          }
        }
        // userId가 전달되면 loggedInUser와 userId 두 사람이 포함된 Room이 있는지 확인 후,
        // 없으면 둘이 포함된 room을 create 한다.
        else if(userId){
          const user = await client.user.findUnique({where:{id:userId}});
          if(!user){
            return{
              ok: false,
              error: "User not found"
            }
          }
          room = await client.room.findFirst({
            where:{
              AND:[
                {users:{some:{id:loggedInUser.id}}},
                {users:{some:{id:userId}}},
              ]
            },
            select:{id:true}
          });
          if(!room){
            // 둘 간의 room이 없는 상태이므로 둘이 포함된 room을 생성한다.
            room = await client.room.create({
              data:{
                users:{connect:[
                  {id: userId},
                  {id: loggedInUser.id}
                ]}
              }
            });
          }
        }
        // message를 생성한다.
        await client.message.create({
          data:{
            payload,
            user:{connect:{id:loggedInUser.id}},
            room:{connect:{id:room.id}}
          }
        });
        return{
          ok: true
        }
      }
    )
  }
}