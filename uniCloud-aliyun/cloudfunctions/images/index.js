'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
	const db = uniCloud.database();
  // 返回数据给客户端
	return db.collection("images").orderBy("_id", "desc").get();
};
