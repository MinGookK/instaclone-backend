import { gql } from 'apollo-server';

export default gql`
  type Query{
    serchUsers(keyword: String!, lastId: Int):[User]!
  }
`