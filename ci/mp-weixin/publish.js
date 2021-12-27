const manifest = require('../../src/manifest.json');
const ci = require('miniprogram-ci');
const project = new ci.Project({
  appid: manifest['mp-weixin'].appid,
  type: 'miniProgram',
  projectPath: 'dist/build/mp-weixin',
  privateKeyPath: 'ci/mp-weixin/private.wxf905eda6ac324939.key',
  ignores: ['node_modules/**/*'],
});
ci.upload({
  project,
  version: process.env.npm_package_version,
  setting: {
    minify: true,
    es6: true,
    es7: true,
    minifyJS: true,
    minifyWXML: true,
    minifyWXSS: true,
    autoPrefixWXSS: true,
  },
  robot: 1,
}).then((res) => {
  console.log(res);
  console.log('上传成功');
  console.log('小程序发版成功，请前往微信公众平台查看');
}).catch((error) => {
  if (error.errCode === -1) {
    console.log('上传成功');
    console.log('小程序发版成功，请前往微信公众平台查看');
  }
  console.log(error);
  console.log('上传失败');
  process.exit(-1);
});
