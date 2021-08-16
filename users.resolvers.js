import client from './client'

export default {
  User: {
    totalFollowers: ({ id }) => client.user.count({where:{following:{some:{id}}}}),
    totalFollowing: ({ id }) => client.user.count({where:{followers:{some:{id}}}}),
    isMe: ({ id }, _, { loggedInUser }) => id === loggedInUser?.id,
    isFollowing: async ({ id }, _ , { loggedInUser }) => {
      // login한 user의 following list에 보고있는 user(root)가 들어가 있다면 true고 없다면 false.
      if(!loggedInUser){
        return false;
      }
      const ok = await client.user.count({where:{
        id: loggedInUser.id,
        following: {
          some:{ id }
        }
      }});
      return ok ? true : false;
    }
    
  }
}