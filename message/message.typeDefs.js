import { gql } from 'apollo-server';

export default gql`
  type Room{
    id: Int!
    users: [User]
    messages: [Message]
    createdAt: String!
    updatedAt: String!
    unreadTotal: Int!
  }
  type Message{
    id: Int!
    payload: String!
    read: Boolean!
    user: User!
    room: Room!
    createdAt: String!
    updatedAt: String!
  }
`