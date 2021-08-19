import client from '../../client';
import { protectedResolver } from '../../users/users.utils';
import { hashtagConnectOrCreate } from '../photos.utils';

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async( _, { file, caption }, { loggedInUser }) => {
        // login 했는지 검사하기
        if(!loggedInUser){
          return {
            ok: false,
            error: "need login",
          }
        }
        // caption에서 hashtag 분리해내기 (reqular expression: String.match();)
        // 한글도 지원하기 위해 nico랑은 다른 regular expression 사용
        let hashtagsObj = [];
        if(caption){
          hashtagsObj = hashtagConnectOrCreate(caption);
        }
        // loggedInUser의 id를 가진 Photo 생성해내기
        const newPhoto = client.photo.create({
          data: {
            file,
            caption,
            user: {
              //user랑 연결지어줘야 하니가 connect 사용하는거임
              connect:{
                id: loggedInUser.id
              }
            },
            ...( hashtagObj.length>0 && {hashtags:{
              //hashtag는 이미 존재한다면 그 곳과 connect하고 없다면 create하기 위해 connectOrCreate 사용.
              //connectOrCreate를 multiple로 적용할 때는 Array로 전달하면 됨.
              connectOrCreate: hashtagObj
              //photos는 지금 Photo 를 create 하고있어서 자동으로 연결 됨.
            }})
          }
        });
        return {
          ok: true,
          photo: newPhoto
        }
      }
    )
  }
};