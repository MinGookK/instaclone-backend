import client from '../client';

export default {
  Photo: {
    user: async({userId}) => {
      return client.user.findUnique({
        where: {
          id: userId
        }
      })
    }
  }
}