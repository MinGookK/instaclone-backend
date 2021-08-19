import { gql } from 'apollo-server';

export default gql`
  type Query{
    seeFeed(lastPhotoId: Int):[Photo]
  }
`