import client from '../client';

export default{
  Room:{
    users: ({id}) => client.user.findMany({
      where:{
        rooms:{
          some:{
            id
          }
        }
      }
    }),
    messages: ({id}, {lastId}) => {
      const takeNum = 10;
      return client.message.findMany({
        where:{
          roomId:id
        },
        orderBy:{
          createdAt:"desc"
        },
        take: takeNum,
        skip: lastId ? 1 : 0,
        ...(lastId && {cursor: {id:lastId}})
      })
    },
    unreadTotal: ({id}, _, {loggedInUser}) => {
      // message를 찾아, 근데 roomId로 찾아. 그러고 read: false인 message의 개수를 count해. 근데 loggedInUser가 보낸 것이면 안됨
      return client.message.count({
        where:{
          roomId:id,
          read:false,
          user:{
            id:{not:loggedInUser.ids}
          }
        }
      });
    }
  },
  Message:{
    user: ({id}) => client.message.findUnique({where:{id}}).user(),
    room: ({id}) => client.message.findUnique({where:{id}}).room()
  }
}