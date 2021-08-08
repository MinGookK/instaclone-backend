import jwt from 'jsonwebtoken'
import client from '../../client';
import * as bcrypt from 'bcrypt'

export default {
  Mutation: {
    login: async (_, {username, password}) => {
      const user = await client.user.findUnique({where:{username}});
      if(!user){
        return {
          ok: false,
          error: "username 을 찾을 수 없습니다."
        }
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if(!passwordOk){
        return{
          ok: false,
          error: "잘못된 비밀번호입니다. 다시 입력해주세요."
        }
      }
      if(passwordOk){
        const token = jwt.sign({id: user.id}, process.env.TOKEN_GENERATE_KEY);
        return{
          ok: true,
          token: token
        }
      }
    },
  }
}