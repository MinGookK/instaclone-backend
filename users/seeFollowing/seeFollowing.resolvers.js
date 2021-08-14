import client from '../../client';

export default {
  Query: {
    seeFollowing: async(_, {username, page}) => {
      const ok = await client.user.findUnique({where:{username},select:{id: true}});
      if(!ok){
        return {
          ok: false,
          error: "username does not exist."
        }
      }
      
      const takeNum = 3;
      const followers = await client.user
      .findUnique({ where: { username } })
      .followers({
        take: takeNum,
        skip: (page - 1) * takeNum,
      });
      
      const totalFollowers = await client.user.count({
        where:{following:{some:{username}}}
      });

      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers/takeNum),
        totalFollowers
      };
    }
  },
}