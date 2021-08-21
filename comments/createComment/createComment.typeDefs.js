import { gql } from 'apollo-server';

export default gql`
  type Mutation{
    createComment(id: Int!, payload: String!):mutationResult!
  }
`