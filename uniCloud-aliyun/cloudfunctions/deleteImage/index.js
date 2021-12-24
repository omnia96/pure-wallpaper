'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database()
	const record = await db.collection('images').doc(event.id).get()
	const deleteFileList = record.data.map((item) => item.url )
	await uniCloud.deleteFile({
		fileList: deleteFileList
	})
	const result = await db.collection('images').doc(event.id).remove();
	//返回数据给客户端
	return result;
};
