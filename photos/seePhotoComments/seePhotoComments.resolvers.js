import client from '../../client';

// photo 게시글에서 댓글 보기를 누르면 나오는 창을 위한 resolver pagination 필요
export default{
  Query:{
    seePhotoComments: (_, { id, lastCommentId }) => {
      const takeNum = 5;
      return client.comment.findMany({
      where:{
        photoId: id
      },
      take: takeNum,
      skip: lastCommentId ? 1 : 0,
      ...( lastCommentId && {cursor: { id: lastCommentId }})
    })}
  }
}