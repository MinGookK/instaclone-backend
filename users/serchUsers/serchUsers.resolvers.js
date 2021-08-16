import client from '../../client'

export default {
  Query:{
    serchUsers: async ( _, { keyword, lastId }) => {
      // 어떤 keyword를 담아서 전달을 하면, username이 그 keyword로 시작하는 [User]를 return한다.
      // 전부 load하면 부하가 심해질 수 있기 때문에 pagination으로 구현한다.
      const takeNum = 3;
      return await client.user.findMany({
        where:{
          username:{
            startsWith: keyword
          }
        },
        take: takeNum,
        skip: lastId ? 1 : 0,
        ...(lastId && {cursor: {id: lastId}})
      });
    }
  }
}