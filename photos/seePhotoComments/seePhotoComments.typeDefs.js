import { gql } from 'apollo-server';

export default gql`
  type Query{
    seePhotoComments(id:Int!, lastCommentId: Int):[Comment]
  }
`