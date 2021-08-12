import jwt from 'jsonwebtoken';
import client from '../client';

export const getUserByToken = async(token) => {
  if(!token){
    return null;
  }
  const verifiedToken = jwt.verify(token, process.env.TOKEN_GENERATE_KEY);
  const {id} = verifiedToken;
  const user = await client.user.findUnique({where:{id}});
  if(user){
    return user;
  }else{
    return null;
  }
}