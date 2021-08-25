import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

// export default {
//   Mutation:{
//     readMessage: protectedResolver(
//       async (_, {id}, {loggedInUser}) => {
//         // Q. 의문점인데 메세지를 id로 읽어오는게 아니라 roomId를 불러와서 그 안의 안읽은 메세지가 한번에 없어져야 하는 것이 아닌가?
//         // message의 id를 받아온거고 찾은 메세지는 loggedInUser가 보낸 것이 아니고, room안에는 loggedInUser가 있어야 함
//         const message = await client.message.findFirst({
//           where: {
//             id,
//             userId: {
//               not: loggedInUser.id,
//             },
//             room: {
//               users: {
//                 some: {
//                   id: loggedInUser.id,
//                 },
//               },
//             },
//           },
//           select: {
//             id: true,
//           },
//         });
//         console.log(message);
//         if(!message){
//           return{
//             ok: false,
//             error: "Message not found"
//           }
//         }
//         await client.message.update({
//           where:{id},
//           data:{
//             read:true
//           }
//         });
//         return{
//           ok:true
//         }
//       }
//     )
//   }
// }

export default {
  Mutation: {
    readMessage: protectedResolver(async (_, { id }, { loggedInUser }) => {
      console.log(id, loggedInUser)
      const message = await client.message.findFirst({
        where: {
          id,
          userId: {
            not: loggedInUser.id
          },
          room: {
            users: {
              some: {
                id: loggedInUser.id,
              },
              
            },
          },
        },
        select: {
          id: true,
        },
      });
      console.log(message);
      if (!message) {
        return {
          ok: false,
          error: "Message not found.",
        };
      }
      await client.message.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      });
      return {
        ok: true,
      };
    }),
  },
};