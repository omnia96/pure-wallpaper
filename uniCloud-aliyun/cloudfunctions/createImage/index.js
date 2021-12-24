'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();
	const result = await db.collection('images').add(event);
	//返回数据给客户端
	return result;
};
