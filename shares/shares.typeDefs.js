import { gql } from 'apollo-server';

export default gql`
  type mutationResult{
    ok: Boolean!,
    error: String
  }
`