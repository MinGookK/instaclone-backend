import client from '../client'
import * as bcrypt from 'bcrypt'

export default {
  Mutation: {
    createAccount: async (_,  {
      firstName,
      lastName,
      username,
      email,
      password,
    }) => {
      try{
        // unique 한 인자가 정말 unique한지 db에서 확인하기
        const existUser = await client.user.findFirst({
        where: {
          OR: [{username}, {email}]
        }
        });
        if(existUser){
          throw new Error('username 혹은 email이 이미 존재합니다.')
        }
        // password hash
        const hashedPassword = await bcrypt.hash( password, 10 );
        // save & return user
        return client.user.create({data : {
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword
        }});
      }catch(e){
        return e;
      }
    }
  }
}
