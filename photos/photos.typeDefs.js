import { gql } from 'apollo-server';

export default gql`
  type Photo{
    id: Int!
    createdAt: String!
    updatedAt: String!
    file: String!
    caption: String
    user: User!
    hashtags: [Hashtag]
    comments: Int!
    totalLike: Int!
    isMine: Boolean!
  },
  type Hashtag{
    id: Int!
    createdAt: String!
    updatedAt: String!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
  }
  type Like{
    id: Int!
    createdAt: String!
    updatedAt: String!
    userId: Int!
    photoId: Int!
  }
`