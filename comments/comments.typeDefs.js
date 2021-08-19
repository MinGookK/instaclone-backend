import { gql } from 'apollo-server';

export default gql`
  type Comment{
    id: Int!
    createdAt: String!
    updatedAt: String!
    payload: String!
    user: User!
    photo: Photo!
    isMine: Boolean!
  }
`