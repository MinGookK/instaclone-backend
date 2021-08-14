import { gql } from 'apollo-server';

export default gql`
  type seeFollowingResult{
    ok: Boolean!
    error: String
    followers: [User]
    totalPages: Int
    totalFollowers: Int
  }
  type Query {
    seeFollowing(username: String!, page: Int!): seeFollowingResult!
  }
`