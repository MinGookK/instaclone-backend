import client from '../../client';

export default {
  Query:{
    // caption에 keyword를 포함하고 있는 모든 photo를 찾는다. 
    // 역시 많아지면 무리가 가기 때문에 cursor-based pagination 사용
    searchPhotos: ( _, { keyword, lastId }) => client.photo.findMany({
      where:{
        caption: {
          contains: keyword
        }
      },
      take: 5,
      skip: 1,
      cursor: {id:lastId}
    })
  }
}