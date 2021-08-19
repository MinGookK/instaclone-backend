import { gql } from 'apollo-server';

export default gql`
  type Query{
    # 좋아요 누른 user들이 보이는 거시기인 듯
    seePhotoLikes(id: Int!): [User]
  }
`