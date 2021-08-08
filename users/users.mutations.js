import client from '../client'

export default {
  Mutation: {
    createAccount: async (_,  {
      firstName,
      lastName,
      username,
      email,
      password,
    }) => {
      // unique 한 인자가 정말 unique한지 db에서 확인하기
      const existUser = await client.user.findFirst({
        where: {
          OR: [{username}, {email}]
        }
      });

      console.log(existUser);
      // password hash
      // save & return user
    }
  }
}