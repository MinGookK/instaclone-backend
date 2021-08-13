import jwt from 'jsonwebtoken';
import client from '../client';

export const getUserByToken = async(token) => {
  try{
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
  }catch{
    return null
  }
}

export const protectedResolver = (ourResolverFn) => (root, args, context, info) => {
  if(!context.loggedInUser){
    return{
      ok: false,
      error: "you should login."
    }
  }
  return ourResolverFn(root,args,context,info);
}