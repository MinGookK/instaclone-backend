# 설명

Nomard coder Insta 클론코딩 클래스 따라해보기임.
무지성으로 따라하지 말고 궁금한 것, 기억할 것이 생기면 README에 추가하고 결론을 적어도보도록 하자.

# 알게된 잡지식들

## 1. Promise & await

이거 진짜 너무 쉬운건데 자꾸 실수해서 적는다.
내가 어떤 라이브러리를 사용해서 어떤 함수를 사용한다고 하자.

이때 그냥 무지성으로 함수 찍고 넘어가는 경우가 많은데, 그러지 말고 사용하기 전에 사용하려는 함수에 마우스 커서를 살포시 올려놓아 보자.
그럼 친절하게 무슨 형태로 리턴되는지 알려준다. Promise로 반환된다면 비동기 처리를 고려해야된다.
이렇게 안하고 뒷부분 주르륵 코딩하면 뭐에서 잘못되었는지 알 수 가 없다.
async / await 구문 써서 함수가 성공적으로 실행되는 것을 기다려주자.

코드 한줄 한줄 테스트 해보며 해도 되지만 이정도는 코드 쓰기 전에 확인하는 습관을 들여보자.

> 실수했던 코드

```javascript
//bcrypt는 password를 hash할 때 쓰이는 라이브러리로 hash 함수는 Promise를 반환한다.
let hashedPassword = null;
if (newPassword) {
  hashedPassword = await bcrypt.hash(newPassword, 10);
}
```

## 2. 객체 내부에서 조건문 사용하기

유저 정보를 업데이트 하는 상황에서 받은 정보를 바탕으로 데이터 객체를 서버로 넘겨주어야 할 것이다.
이 때, 조건에 따라 값을 넘겨주거나 넘겨주지 않고 싶다면 어떻게 해야 할까? 이럴 때 사용하는 코드 되시겠다~

```javascript
//password를 바꾼다면 hash해서 넘겨줘야 함
let hashedPassword = null;
if (newPassword) {
  hashedPassword = await bcrypt.hash(newPassword, 10);
}

//editProfile에서 넘겨준 데이터로 user를 업데이트 해줘야 함
const updateUser = await client.user.update({
  where: { id: 1 },
  data: {
    firstName,
    lastName,
    username,
    email,
    ...(hashedPassword && { password: hashedPassword }),
  },
});
```

위의 코드에서 나는 2가지 문제가 있었다.

1. password를 hash화 해야 했다.
2. hashedPassword가 있는 경우에만 password 값을 hashedPassword로 보내고 싶었다.

`...(hashedPassword && { password: hashedPassword }),`
결론은 이렇게 작성하면 된다.
풀어쓰자면,

1. ()로 감싸 조건문을 만든다.
2. hashedPassword가 `true`라면(있다면) `{ password: hashedPassword }`가 된다.
3. `...`(spread operator)를 앞에 붙여 객체를 푼다.
4. `password: hashedPassword`가 된다.

> 애초에 조건문 없이 코드 작성도 가능 할 것 같아 고쳐봄

```javascript
//이전에는 기본값이 null이었는데 이러면 password 필드에 null이 들어갈 수 없어 오류가 뜬다.
//그래서 undefied로 바꾸니까 잘된다.
let hashedPassword = undefined;
if (newPassword) {
  hashedPassword = await bcrypt.hash(newPassword, 10);
}

const updateUser = await client.user.update({
  where: { id: 1 },
  data: {
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    // ...(hashedPassword && { password: hashedPassword }),
  },
});
```

## 3. Currying

함수를 리턴하는 함수 basic
이용하면 함수를 리턴하는 함수 같은 거 만들 수 있음.

예를 들면, 처음에 받는 arg 값에 따라 다른 함수가 리턴되도록 만들 수 있음
a(1)(2)와 같은 함수를 만들 수 있음

## 4. include VS computed field

기본적으로 prisma에서는 관계형 데이터베이스를 쿼리로 요구하면 null을 return한다.
이유는 데이터베이스가 커질 수록 그 쿼리의 양이 너무 방대해서 서버에 무리가 가기 때문이다.

하지만 관계형 데이터가 필요할 때도 있는데 이 때, 두가지 해결방법이 있는데 include와 computed field이다.

```js
import client from '../../client'

export default {
  Query:{
    seePhoto: ( _, {id}) => client.photo.findUnique({where:{id}}, include:{hashtags: true})
  }
}
```

이렇게 애초에 resolver 안에 hashtag를 불러올 수 있도록 include 하는 방법이 첫 번째이고.

```js
import client from '../client';

export default {
  Photo: {
    // Photo의 id를 가져와서 hashtag에 photos에 id가 일치하는게 하나라도 있는 hashtag를 return함
    hashtags: ({ id }) => client.hashtag.findMany({ where: { photos: { some: { id } } } }),
  },
};
```

따로 hashtags를 위한 computed field를 작성하는 방법이 두번째이다.

얼핏 보기에는 include가 훨씬 쓰기 쉬워 보이는데 computed field를 굳이 작성하는 이유는 뭘까?

내가 생각하는 답은,

1. include를 쓰면 그 값을 불러오든 안오든 항상 데이터를 가져오게 된다. 하지만 computed field를 작성하면 그 값을 호출했을 때만 resolver로 접근해 계산해 내기 때문에 성능적으로 이득이 있다.

2. 단순히 표시가 아니라 추가적인 데이터 정제 과정이 있다면 include로는 표현할 수 없다.

이다.

## 5. graphql에서는 field에도 arg가 전달이 가능하다고!?

# Backend 지식

> ## nodemon 쓰는 이유
>
> => resolver나 schema를 바꾸게 되면 api 호출 값도 달라져야 하는데, 바뀌었는지 테스트하려면 서버를 kill하고 다시 시작해야 된다.
> 근데 resolver나 schema가 바뀔때마다 자동으로 서버를 재시작 해준다면 이런 일은 하지 않아도 될 것이다.
> nodemon은 내 파일이 바뀌는 것을 감시하여 변경점이 보이면 어떤 명령어를 실행하도록 만들 수 있다.
> **따라서 파일에 변경이 생길 때 마다 서버가 재시작되도록 설정 할 수 있다.**

> ## --save VS --save-dev
>
> 둘 다 플러그인을 node_modules에 설치한다.
> --save는 플러그인 정보를 pakage.json의 dependencies 항목에 저정되어 --production 빌드 시에 포함된다.
> --save-dev 는 플로그인 정보를 pakage.json의 devDependencies에 저장되어 --production 빌드 시 포함되지 않는다.
> nodemon은 api 개발 시 서버를 자동으로 재시작해주는 도구이므로 --save-dev로 설치해준다.

> ## Babel(https://babeljs.io/)
>
> JS compiler, node version 상관없이 최신 js 문법을 사용할 수 있음 (물론 node.js 말고도 다양한 환경에서 적용할 수 있음)
> setup에서 node 로 설치해주자.
> preset-env , core, node를 설치해주여 최신 문법으로 쓰고 쉽게 테스트 할 수 있는 개발 환경을 만들어주는 것임
> 실제 배포될 때는 불필요하므로 개발환경에서만 쓰기 때문에 --save-dev로 install한다.

## GraphQL

### subscription(https://www.apollographql.com/docs/react/data/subscriptions/)

**Get real-time updates from your GraphQL server**
**Subscriptions are useful for notifying your client in real time about changes to back-end data, such as the creation of a new object or updates to an important field.**

Subscription을 사용하면 real time으로 어떤 객체가 추가되거나 field가 update되는 것을 listen할 수 있다.

graphql 에서 Query와 Mutation에 추가로 Subscription type을 지원한다.
Subscription을 사용하는 때에 대한 공식문서의 추천은 다음과 같다.

- Small, incremental changes to large objects. Repeatedly polling for a large object is expensive, especially when most of the object's fields rarely change. Instead, you can fetch the object's initial state with a query, and your server can proactively push updates to individual fields as they occur. (커다란 obj에서 무언가 점진적인 change가 있는 경우, 좋아요, 댓글 수 와 같은 것을 실시간으로 업데이트한다.)

- Low-latency, real-time updates. For example, a chat application's client wants to receive new messages as soon as they're available. (저지연, 실시간 업데이트를 관찰할 때, 채팅어플리케이션 같은 실시간 구현에 사용)

#### Defining a subscription

**https://www.apollographql.com/docs/apollo-server/data/subscriptions/#enabling-subscriptions**
(Apollo Server 3.0 부터는 subscription을 자동으로 지원하지 않는다. 필요하다면 공식문서를 참고하여 환경설정을 하자.)

Query, Mutation과 같이 server와 client에 모두 Subscription에 대해 정의해두어야 합니다.

1. ServerSide

```js
type Subscription {
  commentAdded(postID: ID!): Comment
}
```

이렇게 typeDefs를 작성하면 commentAdded는 postID가 ID인 Comment를 listen하는 Subscription이다.

2. Client Side

```js
const COMMENTS_SUBSCRIPTION = gql`
  subscription OnCommentAdded($postID: ID!) {
    commentAdded(postID: $postID) {
      id
      content
    }
  }
`;
```

### graphql apollo express

graphql로 완벽히 개발된 api에서는 apollo 만으로 충분하지만, rest나 soket IO를 실시간으로 사용하는 경우도 생길 것임.
그럴 경우에는 apollo가 모든 것을 자동으로 생성하고 있기 때문에 자유롭게 나머지 기능을 사용할 수 없게 됨.
request log를 찍기 등..

따라서 이런 기능이 필요할 경우에 express server를 만든 뒤에 apollo를 얹어주는 방식으로 사용이 가능하다.

> middle ware와 같은 개념인 듯. 기본적으로 Apollo server를 사용하지만 Apollo server가 사작되기 전에 express server를 끼워넣음으로서
> 여러가지 세세한 서버와의 소통을 할 수 있도록 만든 것 같음

### Graphql upload(https://www.apollographql.com/blog/graphql/file-uploads/with-react-hooks-typescript-amazon-s3-tutorial/)

> 일단은 다운그레이드 버전으로 진행을 한다. (apollo server 2.x)

file upload할 때 Upload형 sclar는 알아서 선언된다.
Upload 를 통해 받아온 file은 Promise 형태로 받아와진다.

예시)

```javascript
Promise{
  {
    filename: 'asdfasdf',
    mimetype: 'image/jpeg',
    encoding: '7bit',
    createReadStream: [Function: createReadStream]
  }
}
```

createReadStream 은 node.js에서 온 함수, 파일을 읽을 수 있도록 해줌
이 중 내가 filename과 createReadStream이 필요하다면 어떻게 해야 할까?

```javascript
const { filename, createReadStream } = await file;
```

와 같이 await를 사용해 Promise가 반환될 때 까지 기다려 주어야 하겠다.

#### stream

많은 데이터를 강에 비유한 것.
위의 예제에서 createReadStream은 업로드한 파일의 정보를 읽는 함수이다.
내가 업로드 한 파일의 정보를 보고싶다면

```javascript
const stream = createReadStream();
```

으로 한 번 호출해주면 된다.

이제 강(stream)을 볼 수 있게 되었으니 흐르는 물(데이터)을 우리가 원하는 위치로 옮겨줄 pipe(파이프)가 필요하다.

`const writeStream = fs.createWriteStream(경로 설정)`

이후에,
`stream.pipe(writeStream)` 해주면 받아온 파일이 writeStream에서 설정한 경로로 저장이 된다.

> Apollo Server 2.0 버전에서는 즉시 파일 업로드가 가능했었다. 그런데 쉬벌 3.0 업데이트 되고부터는 바로 되지 않고 스스로 setup을 해야 한단다.
> 그 이유는,
> **많은 양의 binary data를 처리하게 되어서 성능이 저하되기 때문**이라고 한다.
> 처음 배우는 입장에서는 그냥 성능 저하되고 편한길을 가고 싶지만 이렇게 업데이트 된 데에는 이유가 있겠지, 최신 버전으로 작성하는 법을 공부해보자.
> 는 나중에 해보자 stream , fs 등 다룰게 너무 많다 미루자 ㅠㅠ

#### Graphql File upload 방식 (https://www.apollographql.com/blog/backend/file-uploads/file-upload-best-practices/)

#### 1. Multipart Upload Requests

단일 요청에서 사양을 통해 텍스트, 파일 데이터, JSON 개체 및 기타 원하는 것을 보낼 수 있다.
한 번의 요청으로 모든 것을 할 수 있는 방법!
mutation, query 등을 원하는 형태로 한번에 보낸다는 개념 자체가 graphql의 기본 개념과 아주 비슷함.

쉽지만, 단점은
파일 업로드는 GraphQL 서버에 많은 스트레스를 주므로 무거운 작업을 처리하는 것보다 백엔드 서비스에 대한 프록시로 사용하는 것이 좋습니다.
라고 함

![multipart upload request](https://wp.apollographql.com/wp-content/uploads/2020/03/1_ZzL2m6Zny0d3ysHqLiig-A@2x-2048x1798.png)

#### 2. signed URLs

직접 업로드 할 수 있도록 설계된 것 더 빠르고 확장성 있음

### Altair

playground의 pro버전??.. 같은 느낌이다. (file) upload type을 테스트 해볼 수 있다.
upload type 사용법: https://www.apollographql.com/blog/graphql/file-uploads/with-apollo-server-2-0/

### GraphQL tools

GraphQL tools 가 movies 폴더에서 typeDefs, resolvers를 합쳐주는 역할을 함
`npm i graphql-tools`

> 강의에서 loadFileSync를 사용해서 resolver, typeDef를 추출해냈는데 최신판에서는 이게 없어진 것 같다.
> npm istall graphql-tools@7.0.2 설치해주자
> 없어진 상태에서는 queries와 mutations를 어떻게 나눠줄 수 있을까?

loadFileSync 는 export default 를 불러오기 때문에 반드시 export default로 작성해주자.

### Prisma랑 사용할 때 신경써주어야 할 것

1. GraphQL의 type definitions와 Prisma의 schema가 일치해야 함
2. 이 때 GraphQL은 기본값이 선택이고 필수인 값에 !를 붙여야 함
3. Prisma는 반대로 기본값이 필수이고 선택인 값에 ?를 붙여야 함

## Prisma (https://www.prisma.io/)

ORM(Object Relational Mapper)이다. SQL 코드를 쓸 필요 없이 JS코드를 작성하면 대신 DB랑 소통을 해준다.
JS,) TS 지원하는 중

datasource 는 Prisma에게 데이터베이스의 주소와 종류에 대해 알려줌.
이 프로젝트에서는 provider는 postgresql / database url은 env파일 통해서 읽어오도록 함.(database 생성은 postgres app 사용했음)

client는 어떻게 db랑 상호작용하는가 에 대한 것.

### onDelete CASCADE 적용하기 (https://www.prisma.io/docs/concepts/components/prisma-schema/relations/referential-actions#referential-action-defaults)

**2.26.0** version 부터 사용이 가능하다.

데이터베이스를 지우거나 업데이트 할 때 종속되어 있는 데이터들이 함께 삭제되길 원할 수 있다.
예를 들어 Photo 를 지운다면 그 photo에 종속되어 있는 like들은 함께 지워져야 할 것이다.

그래서 단순히 prisma.photo.delete를 하게 되면 like라는 관계형 데이터 때문에 지울 수 없다고 에러가 난다.
이전에는 prisma가 onDelete를 지원하지 않아 직접 연결된 데이터를 삭제해 주어야 했지만
이젠 preview Feature를 활성화 시켜줌으로 onDelete가 사용이 가능해졌다.

> deletePhoto 만들 때, hashtag들도 photo가 지워지면 지워져야 되지 않나 했는데 생각해보니 photo는 n:n 구조이기 때문에 photo하나 지운다고 hashtag가 없어질 수 는 없었다. ondelete cascade 할 때는 1:n 관계의 database에서 1쪽에 작성해 주어야 하겠다.

### some, OR 차이

### select( find할 때 일부 필드만 가져오기 )

```js
const ok = await client.user.findUnique({ where: { username }, select: { id: true } });
```

이러면 다 안가져오고 id만 가져올 수 있음

### model에 관계 등록하기(https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

관계형 데이터베이스를 구축하는 방법.

#### 1:1 database

> To create a one-to-one self-relation:
> Both sides of the relation must define a @relation attribute that share the same name - in this case, BlogOwnerHistory.
> One relation field must be a fully annotated. In this example, the successor field defines both the field and references arguments.
> One relation field must be backed by a foreign key. The successor field is backed by the successorId foreign key, which references a value in the id field.

fully annotated가 무슨뜻 인지 잘 모르겠다.

```js
model User {
  id          Int     @default(autoincrement()) @id
  name        String?
  successorId Int?
  successor   User?   @relation("BlogOwnerHistory", fields: [successorId], references: [id])
  predecessor User?   @relation("BlogOwnerHistory")
}
```

아무튼 model에서 relation을 정의할 때 1:1 연결될 data를 같은 이름으로 묶어주면 간단하게 데이터베이스가 생성된다.

### Prisma Client

db를 생성하고 연결해줬으면 이제 그 db를 조회하거나 추가하는 CRUD를 할 수 있어야 하잖아?
이 때 db와 소통하는 다리 역할로 Prism a Client를 쓸 수 있음.

```javascript
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export default client;
```

와 너무 쉽다! ㅋㅋㅋ 이렇게 불러와주고 resolvers에서 client를 통해서 db와 소통하면 됨.

> Prisma 를 통해 undefined를 전송하면 어떻게 될까?
> 아무것도 전송하지 않는다. 따라서 업데이트를 해줄 때 undefined를 전송한다고 원래 있던 데이터가 undefined로 바뀌지 않는다.

#### 함수 사용 방법

그냥 client.[추가하려는 모델].[Prisma Client 함수](~~)
같이 쓰면 되는데, 함수 내부 채우는 건 함수 위에 마우스 올려두면 친절하게 설명해주니까 그대로 작성하면 된다.

이때 특정 조건을 만족하는 db를 찾을 때, where을 쓰게 되는데
그 안에 OR: (하나라도 만족하면), NOT: (전부 false라면), AND: (전부 true라면) 등을 추가해서 원하는 필터링을 만들어 줄 수 있다.
자세한 사용 방법은 Prisma client doc에서 확인해보자.

### Prisma Studio

`npx prisma studio`

Prisma schema를 분석해서 작성한 model을 데이터베이스를 자동으로 시각화 해줌
CRUD, filter 등 아무 어플리케이션 없이 구현되어있음

### Prisma Migrate

schema.prisma 파일의 데이터모델을 쓰고 설명할 수 있게 해 줌.
`npx prisma migrate dev --name [마이그레이션 이름]`
사용해서 migrate 해줄 수 있다.

> Added the required column `x` to the `y` table without a default value. There are `z` rows in this table, it is not possible to execute this migration.
>
> 1. Create a migration with a model and some columns.
> 2. Add a NON NULLABLE column to that model.
> 3. Save the changes and run the migration.
> 4. See error.

> 봐도 뭔지 모르겠어서 prisma init을 다시 해주었더니 동일코드에서 정상적으로 돌아간다.. 무엇이 문제였던 걸까?..

### Pagination(https://www.prisma.io/docs/concepts/components/prisma-client/pagination)

Followers 나 Following을 구경하고자 할 때, 엄청 많은 수의 user가 포함되어 있다면 서버에 무리가 갈 것이다.
그래서 보고싶다고 요청하면 다 보여주는게 아니라 일정부분 보여주고 더 필요하면 그 때 더 로딩하는, 다시말해 페이지를 나누어 로딩해 줄 수 있게 된다.

#### offset pagination

```js
const results = await prisma.post.findMany({
  skip: 3,
  take: 4,
});
```

이렇게 skip과 take를 사용하는데,
skip은 생략하는 data의 갯수이고, take는 보여줄 data의 갯수이다.

원래 나와야 할 결과 값이 1~10까지 있다면 위의 예시에서는 1~3이 skip 되고 결과값으로는 4~7이 표시되게 된다.

이걸 활용하면 페이지를 나누어 로딩해줄 수 있는데 코드를 보자.

```js
const results = await prisma.post.findMany({
  skip: 5,
  take: 5,
});
```

```js
const results = await prisma.post.findMany({
  skip: 10,
  take: 5,
});
```

다음과 같은 코드가 있다면
첫 코드는 5개를 skip하고 5개를 표시해주고,
두번째 코드는 10개를 skip하고 5개를 표시해준다.

어라? 뭔가 페이지가 넘어가는 느낌이 든다 ㅋㅋㅋ.
만약 내가 원하는 page를 input으로 받았다면

```js
const results = await prisma.post.findMany({
  skip: (page - 1) * 5,
  take: 5,
});
```

이렇다면 page 1 일때는 skip하지 않고,
2일 때는 5개 skip
3일 때는 10개 skip ... 하면서 목표했던 페이지 분할 로딩 기능이 구현된다.

하지만... offset 방식은 쉬운만큼 치명적인 단점이 있다! ㅋㅋㅋㅋ

> **바로 1,000,000,001번째 부터 5개를 표시하고 싶다면 1,000,000,000개의 데이터를 순환하며 skip해야 한다는 사실이다!ㅋㅋㅋㅋㅋ**
> 초기 구현에 사용하고 나중에 성능 저하가 확인되기 시작하면 Cursor-based pagination 으로 넘어가야 한다.

#### Cursor-based pagination

offset pagination에서는 단순하게 skip, take만 지정해주면 됐었다.
여기서는 cursor라는 변수가 하나 더 추가된다.

설명하자면,
offset pagination은 맨 앞에서부터 몇 개를 skip할 것인가에 대해서만 로직을 작성하여, page를 입력하면 그 page를 표시해주었다.

cursor-based pagination은
전에 봤던 페이지의 마지막 데이터가 무엇이었는지(그 데이터의 unique한 값)를 변수로 넘겨준다.
그렇게 받은 cursor에서 한 개를 skip하고 page를 표시해주는 방식이다.

이러면 원하는 페이지로 바로 넘어가는 것은 구현할 수 없지만,
필요한 부분만 데이터를 탐색하기 때문에 확장성이 매우 좋아진다.

무한 스크롤 구현할 때 유용한 듯 하다.

## Postgresql

Database
나는 MAC 을 사용하기 때문에 postgres app을 다운로드하여 사용함.

> postico 랑 커맨드 사용하는게 설명이 넘 부족하다. 알게 된 사실을 추가로 적도록 하자.
> open postgres -> postgres click -> terminal 열림 -> DROP DATABASE [지울 데이터베이스 이름] or CREATE DATABASE [생성할 데이터베이스 이름] -> 소유자(owner)가 postgres인 [데이터베이스 이름]을 가진 데이터베이스가 생성됨.

> 물론 소유자를 바꾸고 싶다면 postgres가 아닌 유저네임을 클릭해도 되고 자유다.

## env

.env 읽기 위해 dotenv 사용

`require('dotenv').config();`

사용해서 불러오는 동시에 실행시켜 주면 됨.
이러면 `process.env.[env 변수이름]` 형식으로 env값을 불러올 수 있게 됨

## bcrypt

password hasing을 해주는 라이브러리 salt도 쳐준다.
레인보우 테이블 공격을 막아주는 역할을 함

## jwt(json web token)

login 구현할 때 사용.
사용자가 로그인에 성공하면 secret은 아니지만 사용자의 고유한 정보인 정보 + 서버의 secret key를 이용해 토큰을 부여함.

사용자가 서버에 무언가 request를 보낼 때 마다 이 토큰과 함께 요청을 함.

서버에서는 사용자가 보낸 토큰을 보고 서버의 secret key로 sign되고 변경되지 않은 토큰인지 verify함.
사용자의 요청을 받아줌.

**하지만 매번 모든 api에 토큰을 arg로 보내도록 하는 것은 매우 귀찮아 보인다**

그래서 사용할 것은,

### http headers

response, request 등에 자동으로 포함되도록 만들 수 있음!
header에 token 정보를 담고 request 해보면 header에는 잘 나오지만 graphql 내에서 읽을 수 없어 에러가 날 것이다.

이유는 우리가 graphql resolver에서 (root, {arguments})만 사용하고 있었기 때문,
그 다음 요소인 context를 사용해주어야 한다.

> 마지막 요소인 info는 무슨역할인지 모르겠다. 찾아보자.

#### context

context는 graphql resolver의 세번째 arg로 등록해놓으면 어~~~~느 resolver던지 접근해서 사용할 수 있도록 한 arg다.
로그인을 통해 token이 나오면 어~~떤 요청을 할때든지 토큰을 전달해야 되는 상황과 비슷하지 않은가?ㅋㅋ

아무튼 context의 생성은 Apollo server에서 생성이 가능하다.

```javascript
const server = new ApolloServer({
  schema
  context: object or function
});
```

위와 같이 서버에서 context를 등록해두면 각각의 resolver에서 자연스럽게 정보를 빼서 사용하면 된다.
우리 경우에는 http header에 토큰 정보를 저장하니 context는 http header와 연동이 되면 되겠다.

context를 함수로 사용하면 시작 변수로 request와 resolver를 받을 수 있다. request 보면 http header가 있으니까 그걸 사용한 함수를 만들면 된다.

# Instaclone (Todo)

## User

- [x] Create Account
- [x] See Profile
- [x] Login
- [x] Edit Profile
- [x] Follow User
- [x] Unfollow User
- [x] See Followers & Following with Pagination
- [x] Computed Field 작성
- [x] Change Avatar (Image Upload)
- [x] Search User
- [ ] delete User (comment, photo, like 다 지워지게 하기 / onDelete CASCADE)

## Photos

- [x] Upload Photo (Parse #)
- [x] See Photo
- [x] See Hashtags
- [x] Search Photos
- [x] Edit Photo
- [x] Like / Unlike Photo
- [x] See Photo Likes
- [x] See Photo Comments
- [x] See Feed
- [x] See Photo isMine
- [x] Delete Photo / ondelete cascade 사용하기.
- [ ] Delete Photo 해서 hashtag에 photo가 0개가 되는 hashtag 삭제하기

## Comments

- [x] Comments on Photo
- [x] Edit Comment
- [x] Delete Comment
- [x] See Comments isMine

## Extras

- [ ] S3 Image Upload
- [x] use mutationResult
- [x] refactor protectedResolvers in query case

## Direct Message

- [x] Model generate (Room, Message)
- [x] Create Room
- [x] send message
- [x] See Rooms (대화방 목록을 보는 resolver를 만들기)
- [x] See Room (대화방 하나를 클릭한 이후에 resolver)
- [x] Computed Fields (unreadTotal)
- [x] Read Message
- [x] Realtime Messages
