# 설명

Nomard coder Insta 클론코딩 클래스 따라해보기임.
무지성으로 따라하지 말고 궁금한 것, 기억할 것이 생기면 README에 추가하고 결론을 적어도보도록 하자.

# Instaclone (Todo)

Instaclone Backend

## User

- [ ] Create Account
- [ ] See Profile
- [ ] Login
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

### Prisma Studio

`npx prisma studio`

Prisma schema를 분석해서 작성한 model을 데이터베이스를 자동으로 시각화 해줌
CRUD, filter 등 아무 어플리케이션 없이 구현되어있음

### Prisma Migrate

schema.prisma 파일의 데이터모델을 쓰고 설명할 수 있게 해 줌.
`npx prisma migrate dev --name [마이그레이션 이름]`
사용해서 migrate 해줄 수 있다.

## Postgresql

Database
나는 MAC 을 사용하기 때문에 postgres app을 다운로드하여 사용함.

> postico 랑 커맨드 사용하는게 설명이 넘 부족하다. 알게 된 사실을 추가로 적도록 하자.

## env

.env 읽기 위해 dotenv 사용

`require('dotenv').config();`

사용해서 불러오는 동시에 실행시켜 주면 됨.
이러면 `process.env.[env 변수이름]` 형식으로 env값을 불러올 수 있게 됨
