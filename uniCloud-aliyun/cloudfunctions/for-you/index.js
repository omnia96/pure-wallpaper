'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
  console.log('event : ', event);
  const db = uniCloud.database();
  const collection = db.collection('images');
  const response = {data: []};
  const {version} = event;
  switch (version) {
    default:
      const record = await collection.orderBy('downloadCount', 'asc').limit(400).get();
      // const record = await collection.limit(50).get();
      response.data.push(...record.data.sort(() => Math.random() - 0.5).slice(0, 20));
      break;
  }
  // 返回数据给客户端
  return response;
};
