echo '拉取小程序 ci 构建镜像到本地'
docker pull qqminiapp/build:latest
CONTAINER_ID=`docker ps -a -q -f name=pure-wallpaper-qqminiapp`
if [ -n "$CONTAINER_ID" ]
then
  docker stop $CONTAINER_ID
  echo "删除 pure-wallpaper-qqminiapp 容器"
  docker rm $CONTAINER_ID
fi

# 运行 docker 镜像，其中：
# -e 用来向 docker 镜像中传递参数
# -v "E:/miniapptest":"/tmp" 表示将本地的小程序目录 E:/miniapptest，映射到 docker 中的 /tmp 目录
# -w 表示 docker 镜像里执行脚本时所在目录是 /tmp
echo '运行 docker 镜像'
docker run \
    --name pure-wallpaper-qqminiapp \
    -e PLUGIN_VERSION=1.0.0 \
    -e PLUGIN_DESC=版本描述 \
    -e PLUGIN_APPTOKEN=6c1aa05373f21497032bd91878f9a1db \
    -e PLUGIN_EXPERIENCE=true \
    -e PLUGIN_PREVIEW=false \
    -e PLUGIN_BUILDUSER=user \
    -e PLUGIN_FIRSTPAGE=pages/index/index \
    -e PLUGIN_USEPACKAGEJSON=false \
    -e PLUGIN_NPMBUILD=false \
    -e PLUGIN_SOURCECODEPATH=./ \
    -v "/Users/cityhunter/Documents/WorkSpace/pure-wallpaper/dist/build/mp-qq":"/tmp" \
    -w /tmp "qqminiapp/build:latest"

echo '上传成功！'
