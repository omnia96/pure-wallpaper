'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
  console.log('event : ', event);
  const db = uniCloud.database();
  const auditModeState = (
    await db.collection('app-config').where({name: 'audit-mode-state'}).get()
  ).data[0].value;
  const collection = db.collection(auditModeState === 'true' ? 'images-audit' : 'images');
  const result = await collection.add(event);
  // 返回数据给客户端
  return result;
};
