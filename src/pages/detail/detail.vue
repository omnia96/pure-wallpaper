<template>
  <view class="page">
    <u-navbar :fixed="true" bgColor="transparent">
      <view class="u-nav-slot" slot="left" @click="back">
        <u-icon :name="isBack ? 'arrow-left' : 'home'"
                size="40rpx" color="black" :bold="true"
        ></u-icon>
      </view>
    </u-navbar>
    <view class="detail flex-c">
      <u-image :src="wallpaper.url" width="100vw" height="100vh" mode="aspectFill"></u-image>
      <view class="detail-mask"></view>
      <view class="detail-actions w-100">
        <actions-bar :actions="actions" @action="action"></actions-bar>
      </view>
    </view>
    <bottom-sheet :show="infoBottomSheetState"
                  title="壁纸信息"
                  @close="infoBottomSheetState = false">
      <u-grid :border="true">
        <template v-for="(item, index) in infos">
          <u-grid-item :key="index">
            <u-icon size="30" :name="item.icon"></u-icon>
            <text>{{item.label}}</text>
          </u-grid-item>
        </template>
      </u-grid>
    </bottom-sheet>
  </view>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import ActionsBar from '@city-hunter/pure-ui/components/actions-bar.vue';
import RxUni from '@city-hunter/pure-ui/unit/rx-uni';
import {finalize, switchMap} from 'rxjs';
import BottomSheet from '@city-hunter/pure-ui/components/bottom-sheet.vue';
import RxUniCloud from '@/core/unit/rx-uni-cloud';
import CellGroup from '@city-hunter/pure-ui/components/cell-group.vue';
import Cell from '@city-hunter/pure-ui/components/cell.vue';
import AppConfig from '@/core/config/app.config';

@Component({
  components: {ActionsBar, BottomSheet, CellGroup, Cell}},
)
export default class Detail extends Vue {
  src = '';
  actions = [
    {text: '分享', icon: 'share', openType: 'share'},
    {text: '下载', icon: 'download'},
    {text: '信息', icon: 'info-circle'},
  ];
  infoBottomSheetState = false;
  wallpaper: any = {};
  get infos() {
    return [
      {icon: 'share', label: `分享 ${this.wallpaper.shareCount||0} 次`},
      {icon: 'download', label: `下载 ${this.wallpaper.downloadCount||0} 次`},
      {icon: 'heart', label: '点赞 0 次'},
    ];
  }
  get isBack() {
    return getCurrentPages().length > 1;
  }
  onLoad(event: any) {
    this.wallpaper = {_id: event.id};
    RxUniCloud.callFunction('wallpaper', {version: AppConfig.VERSION, id: this.wallpaper._id}).subscribe({
      next: (response) => {
        console.log(response);
        this.wallpaper = response.result.data;
      },
    });
  }
  back() {
    if (this.isBack) {
      uni.navigateBack({delta: 1});
    } else {
      uni.reLaunch({url: '/pages/index/index'});
    }
  }
  action(index: number) {
    switch (index) {
      case 0:
        RxUniCloud.callFunction('share', {id: this.wallpaper._id}).subscribe({
          next: (response) => {
            this.wallpaper = response.result.data;
          },
        });
        break;
      case 1:
        uni.showLoading({
          title: '下载中...',
        });
        RxUni.downloadFile({url: this.wallpaper.url}).pipe(
            switchMap((result) => RxUni.saveImageToPhotosAlbum({filePath: result.tempFilePath})),
            switchMap(() => RxUniCloud.callFunction('download', {id: this.wallpaper._id})),
            finalize(() => uni.hideLoading()),
        ).subscribe({
          next: (response) => {
            uni.showToast({icon: 'none', title: '已保存到相册'});
            this.wallpaper = response.result.data;
          },
          error: (result) => uni.showToast({icon: 'none', title: result.errMsg, duration: 1000}),
        });
        break;
      case 2:
        this.infoBottomSheetState = true;
        break;
    }
  }
}
</script>
<style lang="scss">
.page {
  touch-action: none;
}
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
  justify-content: center;
  border: 1+rpx solid #cccccc;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50+rpx;
  padding: 10+rpx;
}
</style>
