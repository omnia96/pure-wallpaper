'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
  const db = uniCloud.database();
  const auditModeState = (
    await db.collection('app-config').where({name: 'audit-mode-state'}).get()
  ).data[0].value;
  const collection = db.collection(auditModeState === 'true' ? 'images-audit' : 'images');
  const record = await collection.doc(event.id).get();
  const deleteFileList = record.data.map((item) => item.url );
  await uniCloud.deleteFile({
    fileList: deleteFileList,
  });
  const result = await collection.doc(event.id).remove();
  // 返回数据给客户端
  return result;
};
