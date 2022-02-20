<template>
  <view class="wallpapers">
    <view class="app-header flex align-center">
      <search-bar></search-bar>
      <view class="actions">
        <u-button icon="plus" text="上传" @click="upload"></u-button>
      </view>
      <view class="actions">
        <u-button icon="setting" @click="settingSheetState = true"></u-button>
      </view>
    </view>
    <waterfall class="w-100" margin="0" :column="column" :value="list">
      <template v-slot:default="{ value }">
        <view class="wallpaper">
          <u-image :src="value.url" width="100%" mode="widthFix"></u-image>
          <view class="wallpaper-actions">
            <actions-bar :actions="[{text: '', icon: 'trash'}]"
                         @action="deleteImage(value)"
            ></actions-bar>
          </view>
        </view>
      </template>
    </waterfall>
    <bottom-sheet :show="settingSheetState" title="设置" @close="settingSheetState = false">
      <cell-group :is-last="true">
        <cell title="审核模式" :is-last="true">
          <u-switch v-model="auditModeState"></u-switch>
        </cell>
      </cell-group>
    </bottom-sheet>
  </view>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import Waterfall from '@city-hunter/pure-ui/components/waterfall.vue';
import SearchBar from '@city-hunter/pure-ui/components/search-bar.vue';
import ActionsBar from '@city-hunter/pure-ui/components/actions-bar.vue';
import RxUniCloud from '@/core/unit/rx-uni-cloud';
import {finalize, forkJoin, map, switchMap} from 'rxjs';
import RxUni from 'pure-ui/unit/rx-uni';
import BottomSheet from '@city-hunter/pure-ui/components/bottom-sheet.vue';
import CellGroup from '@city-hunter/pure-ui/components/cell-group.vue';
import Cell from '@city-hunter/pure-ui/components/cell.vue';

@Component({
  components: {
    Waterfall,
    SearchBar,
    ActionsBar,
    BottomSheet,
    CellGroup,
    Cell,
  },
})
export default class extends Vue {
  list: any[] = [];
  settingSheetState = false;
  auditModeState = false;
  get column() {
    let column = 8;
    uni.getSystemInfo({
      success: (result) => {
        console.log(result);
        column = Number((result.windowWidth / 125).toFixed(0));
        console.log(column);
      },
    });
    return column;
  }
  created() {
    uniCloud.callFunction({
      name: 'images',
      success: (result) => {
        console.log(result.result);
        this.list = result.result.data;
      },
    });
  }
  upload() {
    uni.chooseImage({
      count: 20,
      success: (result) => {
        if (result.tempFilePaths.length > 20) {
          uni.showToast({title: '一次最多上传20张图片', icon: 'none'});
        } else {
          uni.showLoading({title: '上传中'});
          const uploadFiles$ = (result.tempFilePaths as string[])
              .map((item) => RxUniCloud.uploadFile('images/a.jpg', item.toString()));
          forkJoin(uploadFiles$).pipe(
              switchMap((result) => {
                const createImages$ = result.map((item) => RxUniCloud.callFunction(
                    'createImage',
                    {name: '', url: item.fileID, downloadCount: 0}),
                );
                return forkJoin(createImages$);
              }),
              finalize(() => uni.hideLoading()),
              switchMap(() => RxUniCloud.callFunction('images')),
              map((result) => this.list = result.result.data),
              switchMap(() => RxUni.showToast('上传成功')),
          ).subscribe();
        }
      },
    });
  }
  deleteImage(image: any) {
    uni.showModal({
      content: '确定要删除这张图片嘛？',
      success: (result) => {
        if (result.confirm) {
          uni.showLoading({title: '删除中'});
          RxUniCloud.callFunction('deleteImage', {id: image._id}).pipe(
              switchMap(() => RxUniCloud.callFunction('images')),
              map((result) => this.list = result.result.data),
              finalize(() => uni.hideLoading()),
              switchMap(() => RxUni.showToast('删除成功')),
          ).subscribe();
        }
      },
    });
  }
}
</script>
<style lang="scss">
.app-header {
  height: 144+rpx;
  border-bottom: 1px solid #e8e8e8;
  padding-right: 10px;
  .actions {
    margin: 0 10px;
  }
}
.wallpaper {
  position: relative;
  &-actions {
    width: 100%;
    position: absolute;
    bottom: 0;
    background: linear-gradient(to top, #00000090, #00000010);
  }
}
</style>
