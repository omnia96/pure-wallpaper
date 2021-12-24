<template>
  <view class="page">
    <u-navbar :fixed="true" bgColor="transparent">
      <view class="u-nav-slot" slot="left">
        <u-icon name="arrow-left" size="19" @click="back"></u-icon>
      </view>
    </u-navbar>
    <view class="detail flex-c">
      <u-image :src="src" width="100vw" height="100vh" mode="aspectFill"></u-image>
      <view class="detail-mask"></view>
      <view class="detail-actions w-100">
        <actions-bar :actions="[{text: '下载', icon: 'download'}]" @action="action"></actions-bar>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import ActionsBar from 'pure-ui/components/actions-bar.vue';

@Component({
  components: {ActionsBar},
})
export default class Detail extends Vue {
  src = '';
  onLoad(event: any) {
    console.log(event);
    this.src = event.url;
  }
  back() {
    uni.navigateBack({delta: 1});
  }
  action(event: any) {
    console.log(event);
    uni.showLoading({
      title: '下载中...',
    });
    uni.downloadFile({
      url: this.src,
      success: (result) => {
        console.log(result);
        // uni.saveFile();
        uni.saveImageToPhotosAlbum({
          filePath: result.tempFilePath,
          success: (res) => {
            console.log(res);
            uni.showToast({icon: 'none', title: '已保存到相册'});
          },
          fail: (res) => uni.showToast({icon: 'none', title: res, duration: 1000}),
        });
      },
      fail: (result) => {
        uni.showToast({icon: 'none', title: result.errMsg, duration: 1000});
      },
      complete: () => {
        uni.hideLoading();
      },
    });
  }
}
</script>
<style lang="scss">
.detail {
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  position: relative;
  &-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  &-actions {
    position: fixed;
    bottom: 0;
  }
}
.u-nav-slot {
  display: flex;
  align-items: center;
  border: 1+rpx solid #cccccc;
  border-radius: 50+rpx;
  padding: 10+rpx;
}
</style>
