'use strict';
exports.main = async (event, context) => {
  const {type = 'get', record} = event;
  const db = uniCloud.database();
  const collection = db.collection('app-config');
  switch (type) {
    case 'get':
      return (await collection.get()).data;
    case 'put':
      await collection.update(record);
      return (await collection.get()).data;
    default:
      return '请输入真确的类型';
  }
};
