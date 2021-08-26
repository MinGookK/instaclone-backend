import { withFilter } from 'apollo-server-express';
import client from '../../client';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';

export default{
  Subscription:{
    roomUpdates: {
      subscribe: async(root, args, context, info) => {
        const room = await client.room.findFirst({where:{
          id:args.roomId,
          users:{some:{id:context.loggedInUser.id}}
        }});
        if(!room){
          throw new Error("room not exist.");
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({roomUpdates}, {roomId}) => {
            return roomUpdates.roomId === roomId;
          }
        )(root, args, context, info);
      }
    }
  }
}