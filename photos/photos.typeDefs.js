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
  },
  type Hashtag{
    id: Int!
    createdAt: String!
    updatedAt: String!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
  }
`