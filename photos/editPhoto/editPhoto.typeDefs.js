import { gql } from 'apollo-server';

export default gql`
  type editPhotoResult{
    ok: Boolean!
    error: String
    photo: Photo
  }
  type Mutation{
    # 무슨 photo인지 알기 위해 id 가져와서 caption을 보낸 값으로 변경한다.
    editPhoto(id:Int!, caption: String!): editPhotoResult!
  }
`