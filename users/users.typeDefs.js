import { gql } from 'apollo-server';

export default gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    following: [User]
    followers: [User]
    createdAt: String!
    updatedAt: String!
    bio: String
    avatar: String
    totalFollowing: Int!
    totalFollowers: Int!
    isFollowing: Boolean!
    isMe: Boolean!
  }
`

// totalFollowing
// totalFollowers
// isFollowing
// isMe