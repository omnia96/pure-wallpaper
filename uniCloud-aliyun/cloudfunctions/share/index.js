'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
  const {version, id} = event;
  const response = {data: {}};
  const db = uniCloud.database();
  const collection = db.collection('images');
  switch (version) {
    default:
      const record = await collection.doc(id).get();
      const wallpaper = record.data[0];
      if (wallpaper.hasOwnProperty('shareCount')) {
        wallpaper.shareCount += 1;
      } else {
        wallpaper.shareCount = 1;
      }
      await collection.doc(id).update({
        shareCount: wallpaper.shareCount,
      });
      const updated = await collection.doc(id).get();
      response.data = updated.data[0];
      break;
  }
  // 返回数据给客户端
  return response;
};
