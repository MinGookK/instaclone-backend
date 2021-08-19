import client from '../client';

export default {
  Photo: {
    // Photo의 userId 값과 일치하는 user를 찾아서 return
    user: ({userId}) => client.user.findUnique({where:{id: userId}}),
    // Photo의 id를 가져와서 hashtag에 photos에 id가 일치하는게 하나라도 있는 hashtag를 return함
    hashtags: ({id}) => client.hashtag.findMany({where:{photos:{some:{id}}}})
  },
  Hashtag: {
    // hashtag의 id를 포함하고 있는 모든 photo를 return
    // photo가 겁나게 많을 수 있기 때문에 pagination을 사용해야 함.
    // arg를 photos에 받도록 코드를 짬
    photos: ({id}, {page}) => {
      const takeNum = 3;
      return client.photo.findMany(
        {
          where: {
            hashtags:{some:{id}}
          },
          take: takeNum,
          skip: (page-1)*takeNum
        }
      )
    },
    //hashtag의 id를 포함하고 있는 모든 photo의 숫자를 return
    totalPhotos: ({id}) => client.photo.count({where:{hashtags:{some:{id}}}})
  }
}