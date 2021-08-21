import client from '../../client';

export default {
  Query: {
    seeFollowing: async(_, {username, lastId}) => {
      const ok = await client.user.findUnique({where:{username},select:{id: true}});
      if(!ok){
        return {
          ok: false,
          error: "username does not exist."
        }
      }
      
      const takeNum = 3;
      //cursor는 하나 이상 전달이 되어야 하기 때문에 lastId 값이 있을때만 전달되도록 한다.
      const following = await client.user
      .findUnique({ where: { username } })
      .following({
        take: takeNum,
        skip: lastId? 1 : 0,
        ...(lastId && {cursor: {id: lastId}})
      });
      
      return following
    }
  },
}