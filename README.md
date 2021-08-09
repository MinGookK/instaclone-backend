# 설명

Nomard coder Insta 클론코딩 클래스 따라해보기임.
무지성으로 따라하지 말고 궁금한 것, 기억할 것이 생기면 README에 추가하고 결론을 적어도보도록 하자.

# 알게된 잡지식들

## 1. Promise & await

이거 진짜 너무 쉬운건데 자꾸 실수해서 적는다.
내가 어떤 라이브러리를 사용해서 어떤 함수를 사용한다고 하자.

이때 그냥 무지성으로 함수 찍고 넘어가는 경우가 많은데, 그러지 말고 사용하기 전에 사용하려는 함수에 마우스 커서를 살포시 올려놓아 보자.
그럼 친절하게 무슨 형태로 리턴되는지 알려준다. Promise로 반환된다면 비동기 처리를 고려해야된다. 씨바!! 제발 좀.
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

# Instaclone (Todo)

Instaclone Backend

## User

- [x] Create Account
- [x] See Profile
- [x] Login
- [ ] Edit Profile
- [ ] Follow User
- [ ] Unfollow User
- [ ] Change Avatar (Image Upload)

> ### nodemon 쓰는 이유
>
> => resolver나 schema를 바꾸게 되면 api 호출 값도 달라져야 하는데, 바뀌었는지 테스트하려면 서버를 kill하고 다시 시작해야 된다.
> 근데 resolver나 schema가 바뀔때마다 자동으로 서버를 재시작 해준다면 이런 일은 하지 않아도 될 것이다.
> nodemon은 내 파일이 바뀌는 것을 감시하여 변경점이 보이면 어떤 명령어를 실행하도록 만들 수 있다.
> **따라서 파일에 변경이 생길 때 마다 서버가 재시작되도록 설정 할 수 있다.**

> ### --save VS --save-dev
>
> 둘 다 플러그인을 node_modules에 설치한다.
> --save는 플러그인 정보를 pakage.json의 dependencies 항목에 저정되어 --production 빌드 시에 포함된다.
> --save-dev 는 플로그인 정보를 pakage.json의 devDependencies에 저장되어 --production 빌드 시 포함되지 않는다.
> nodemon은 api 개발 시 서버를 자동으로 재시작해주는 도구이므로 --save-dev로 설치해준다.

> ### Babel(https://babeljs.io/)
>
> JS compiler, node version 상관없이 최신 js 문법을 사용할 수 있음 (물론 node.js 말고도 다양한 환경에서 적용할 수 있음)
> setup에서 node 로 설치해주자.
> preset-env , core, node를 설치해주여 최신 문법으로 쓰고 쉽게 테스트 할 수 있는 개발 환경을 만들어주는 것임
> 실제 배포될 때는 불필요하므로 개발환경에서만 쓰기 때문에 --save-dev로 install한다.

## GraphQL

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
