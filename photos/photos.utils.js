export const hashtagConnectOrCreate = (caption) => {
  const hashtags = caption.match(/#[\d|A-Z|a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g) || [];
  const hashtagObj = hashtags.map(hashtag => ({
    where: {hashtag},
    create: {hashtag}
  }));
  return hashtagObj;
}