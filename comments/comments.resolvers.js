export default {
  Comment:{
    //Comment의 userId와 loggedInUser의 id가 일치하면 true 아니면 false
    isMine: ({ userId } ,_ ,{ loggedInUser }) => userId === loggedInUser?.id
  }
}