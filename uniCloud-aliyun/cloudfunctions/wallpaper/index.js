'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
  console.log('event : ', event);
  const {version, id} = event;
  const response = {data: {}};
  const db = uniCloud.database();
  const auditModeState = (
    await db.collection('app-config').where({name: 'audit-mode-state'}).get()
  ).data[0].value;
  const collection = db.collection(auditModeState === 'true' ? 'images-audit' : 'images');
  switch (version) {
    default:
      const record = await collection.doc(id).get();
      console.log(record);
      response.data = record.data[0];
      break;
  }
  // 返回数据给客户端
  return response;
};
