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
    },
    login: async (_, {username, password}) => {
      const user = await client.user.findUnique({where:{username}});
      if(!user){
        return {
          ok: false,
          error: "username 을 찾을 수 없습니다."
        }
      }
      const pass = await bcrypt.compare(password, user.password);
      if(pass){
        return{
          ok: true,
          token: "성공이에용~, 토큰발급코드 넣기"
        }
      }
      if(!pass){
        return{
          ok: false,
          error: "잘못된 비밀번호입니다. 다시 입력해주세요."
        }
      }
    }
  }
}
