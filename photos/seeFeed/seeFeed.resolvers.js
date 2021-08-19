import client from '../../client'

export default {
  Query:{
    seeFeed: async ( _, __, { loggedInUser }) =>{
      // loggedInUser의 following list에 있는 user들의 Photo들을 최신순으로 정렬해야 함.
      // 정보는 loggedInUser 밖에 없으므로, loggedInUser의 id를 follower로 가지고 있는 user의 photo를 찾겠음.
      const followersPhoto = await client.photo.findMany({
        where:{
          user:{
            OR: [
              {
                followers:{
                  some:{
                    id: loggedInUser.id
                  }
                },
              },
              {
                id: loggedInUser.id
              }
            ]
            
          }
        },
        orderBy:{
          updatedAt:"desc"
        }
      });
      return followersPhoto;
    }
  }
}