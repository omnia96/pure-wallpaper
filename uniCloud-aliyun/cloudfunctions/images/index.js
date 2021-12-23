'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
  console.log('event : ', event);
  const images = [
    'https://www.xxoozm.com/wp-content/uploads/2021/12/1639913470-202112191131109.jpg',
    'https://www.xxoozm.com/wp-content/uploads/2021/12/1639816932-2021121808421240.jpg',
    'https://www.xxoozm.com/wp-content/uploads/2021/12/1639225803-2021121112300387.jpg',
    'https://www.xxoozm.com/wp-content/uploads/2021/12/1639816934-2021121808421478.jpg',
    'https://www.xxoozm.com/wp-content/uploads/2021/12/1638710031-2021120513135152.jpg',
    'https://www.xxoozm.com/wp-content/uploads/2021/12/1639816939-202112180842193.jpg',
    'https://www.xxoozm.com/wp-content/uploads/2021/12/1639816943-2021121808422359.jpg',
    'https://www.xxoozm.com/wp-content/uploads/2021/12/1639816945-2021121808422557.jpg',
  ];
  // 返回数据给客户端
  return images;
};
