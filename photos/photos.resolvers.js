import client from '../client';

export default {
  Photo: {
    // Photo의 userId 값과 일치하는 user를 찾아서 return
    user: ({userId}) => client.user.findUnique({where:{id: userId}}),
    // Photo의 id를 가져와서 hashtag에 photos에 id가 일치하는게 하나라도 있는 hashtag를 return함
    hashtags: ({id}) => client.hashtag.findMany({where:{photos:{some:{id}}}})
  }
}