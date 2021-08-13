import client from '../../client'
import * as bcrypt from 'bcrypt'
import { protectedResolver } from '../users.utils';
import fs from 'fs'

export default {
  Mutation: {
    editProfile: protectedResolver(async (_, 
      {firstName, lastName, username, email, password: newPassword, bio, avatar}, 
      {loggedInUser}) => {
        let avatarUrl = undefined;
        if(avatar){
          const {filename, createReadStream} = await avatar;
          const newFileName = `${loggedInUser.id}-${Date.now()}-${filename}`
          const readStream = createReadStream();
          const writeStream = fs.createWriteStream(process.cwd()+"/uploads/" + newFileName);
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:4000/static/${newFileName}`
        }

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
            avatar: avatarUrl,
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
      }
    )
  }
}
