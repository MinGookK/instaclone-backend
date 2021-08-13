import client from '../../client'
import * as bcrypt from 'bcrypt'
import { protectedResolver } from '../users.utils';

export default {
  Mutation: {
    editProfile: protectedResolver(async (_, 
      {firstName, lastName, username, email, password: newPassword, bio}, 
      {loggedInUser}) => 
      {

      //password를 바꾼다면 hash해서 넘겨줘야 함
      let hashedPassword = undefined;
      if(newPassword){
        hashedPassword = await bcrypt.hash(newPassword,10);
      }

      //editProfile에서 넘겨준 데이터로 user를 업데이트 해줘야 함
      const updateUser = await client.user.update({
        where:{id: loggedInUser.id},
        data:{
          firstName, 
          lastName, 
          username, 
          email,
          password: hashedPassword,
          // ...(hashedPassword && { password: hashedPassword }),
          bio,
        },
      });
      //update 되었으면 return 해주기
      if(updateUser){
        return {
          ok: true
        }
      }else{
        return {
          ok: false,
          error: 'Could not update user'
        }
      }

    })
  }
}
