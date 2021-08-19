import client from '../../client';

export default {
  Query:{
    seePhotoLikes: ( _ , { id } ) => client.user.findMany({
      where:{
        likes:{
          some: {photoId: id}
        }
      }
    })
  }
}