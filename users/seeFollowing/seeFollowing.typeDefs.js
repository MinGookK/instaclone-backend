import { gql } from 'apollo-server';

export default gql`
  type Query {
    seeFollowing(username: String!, lastId: Int): [User]
  }
`