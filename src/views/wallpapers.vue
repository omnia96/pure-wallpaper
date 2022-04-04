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
          <u-switch v-model="auditModeState" @change="setAuditModeState"></u-switch>
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
    const success = (result: any) => {
      const auditModeState = result.result.find(
          (item: any) => item.name === 'audit-mode-state',
      ).value;
      switch (auditModeState) {
        case 'true':
          this.auditModeState = true;
          break;
        case 'false':
          this.auditModeState = false;
          break;
      }
    };
    uniCloud.callFunction({name: 'app-configs', success});
    this.setList();
  }
  setList() {
    uniCloud.callFunction({
      name: 'images',
      success: (result) => {
        // console.log(result.result);
        this.list = result.result.data;
      },
    });
  }
  // upload() {
  //   uni.chooseImage({
  //     count: 20,
  //     success: (result) => {
  //       if (result.tempFilePaths.length > 20) {
  //         uni.showToast({title: '一次最多上传20张图片', icon: 'none'});
  //       } else {
  //         console.log(result.tempFilePaths);
  //         const blobToDataURI = (blob: any, callback: any) => {
  //           const reader = new FileReader();
  //           reader.onload = (e: any) => {
  //             callback(e.target.result);
  //           };
  //           reader.readAsDataURL(blob);
  //         };
  //         console.log(blobToDataURI())
  //         // uni.showLoading({title: '上传中'});
  //         // const uploadFiles$ = (result.tempFilePaths as string[])
  //         //     .map((item) => RxUniCloud.uploadFile('images/a.jpg', item.toString()));
  //         // forkJoin(uploadFiles$).pipe(
  //         //     switchMap((result) => {
  //         //       const createImages$ = result.map((item) => RxUniCloud.callFunction(
  //         //           'createImage',
  //         //           {name: '', url: item.fileID, downloadCount: 0}),
  //         //       );
  //         //       return forkJoin(createImages$);
  //         //     }),
  //         //     finalize(() => uni.hideLoading()),
  //         //     switchMap(() => RxUniCloud.callFunction('images')),
  //         //     map((result) => this.list = result.result.data),
  //         //     switchMap(() => RxUni.showToast('上传成功')),
  //         // ).subscribe();
  //       }
  //     },
  //   });
  // }
  async upload() {
    const [, {tempFiles}]: any = (await uni.chooseImage({count: 1}));
    const toBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
          resolve(this.result);
        };
      });
    };
    const base64Image: any = await toBase64(tempFiles[0]);
    const [imageHead, imageValue] = base64Image.split(',');
    uni.showLoading({title: '增强图片画质中'});
    const accessToken = '24.f056c750175a68e1f5a6cea4d547f61b.2592000.1651079012.282335-25862152';
    const host = 'https://aip.baidubce.com';
    const api = '/rest/2.0/image-process/v1/image_definition_enhance';
    const param = `?access_token=${accessToken}`;
    const [, {data: {image}}]: any = await uni.request({
      url: host + api + param,
      method: 'POST',
      data: {rectangle: [], image: imageValue},
      header: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
    uni.hideLoading();
    uni.showLoading({title: '上传中'});
    const dataURItoBlob = (dataURI: any) => {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {type: mimeString});
    };
    const blob = dataURItoBlob(`${imageHead},${image}`);
    const blobUrl = window.URL.createObjectURL(blob);
    RxUniCloud.uploadFile('images/a.jpg', blobUrl).pipe(
        switchMap(({fileID}) => RxUniCloud.callFunction(
            'createImage',
            {name: '', url: fileID, downloadCount: 0},
        )),
        finalize(() => uni.hideLoading()),
        switchMap(() => RxUniCloud.callFunction('images')),
        map((result) => this.list = result.result.data),
        switchMap(() => RxUni.showToast('上传成功')),
    ).subscribe();
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
  setAuditModeState() {
    RxUniCloud.callFunction(
        'app-configs',
        {type: 'put', record: {name: 'audit-mode-state', value: String(this.auditModeState)}},
    ).pipe(
        finalize(() => this.setList()),
    ).subscribe();
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
