'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
  console.log(event);
  const db = uniCloud.database();
  const collection = db.collection('images');
  const response = {data: []};
  const {version} = event;
  console.log(version);
  if (version) {
    const pageNum = event.pageNum||1;
    const pageSize = event.pageSize||10;
    const recordCount = await collection.count();
    const startRow = (pageNum-1)*pageSize;
    let record;
    switch (version) {
      case '0.0.5':
      case '0.0.6':
      case '0.0.7':
      case '1.0.0':
        record = await collection.orderBy('_id', 'desc').skip(startRow).limit(pageSize).get();
        console.log('pageNum', pageNum);
        console.log('pageSize', pageSize);
        console.log('startRow', startRow);
        console.log(recordCount);
        console.log(record);
        response.pages = (recordCount.total / pageSize).toFixed();
        response.data.push(...record.data);
        break;
      case '0.0.8':
        record = await collection.orderBy('_id', 'desc').skip(startRow).limit(pageSize).get();
        response.pages = 2;
        response.data.push(...record.data);
        break;
    }
  } else {
    const record = await collection.orderBy('_id', 'desc').get();
    response.data.push(...record.data);
  }
  // 返回数据给客户端
  return response;
};
