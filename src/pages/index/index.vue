<template>
  <view class="page">
    <!-- #ifdef MP-WEIXIN|MP-QQ -->
<!--    <u-navbar ></u-navbar>-->
<!--    <search-bar @to-account="settingSheetState = true"></search-bar>-->
    <view class="header">
      <view class="headline-6">
        Today
      </view>
      <u-avatar bgColor="#eeeeee"
                icon="account"
                font-size="60rpx" @click="settingSheetState = true"
      ></u-avatar>
    </view>
    <waterfall class="w-100" :margin="0" :value="list">
      <template v-slot:default="{ value }">
        <view class="image-card" @click="toDetail(value)">
          <u-image :src="value.url" width="50vw" mode="widthFix"></u-image>
        </view>
      </template>
    </waterfall>
    <u-loadmore :status="loadMoreStatus"></u-loadmore>
    <bottom-sheet title="设置" :show="settingSheetState" @close="settingSheetState = false">
      <cell-group>
        <cell title="授权管理" @click="openSetting"></cell>
        <cell title="更新日志" @click="toLogs"></cell>
        <!-- #ifdef MP-WEIXIN -->
        <u-button :plain="false" open-type="contact" :customStyle="buttonNormalStyle">
          <cell title="在线联系"></cell>
        </u-button>
        <!-- #endif -->
        <cell title="隐私权政策" :is-last="true" @click="toPrivacyPolicy"></cell>
      </cell-group>
    </bottom-sheet>
    <update-manager></update-manager>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <wallpapers></wallpapers>
    <!-- #endif -->
<!--    <tabbar></tabbar>-->
  </view>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import SearchBar from 'pure-ui/components/search-bar.vue';
import CellGroup from 'pure-ui/components/cell-group.vue';
import Cell from 'pure-ui/components/cell.vue';
import Tabbar from 'pure-ui/components/tabbar.vue';
import Waterfall from '@city-hunter/pure-ui/components/waterfall.vue';
import BottomSheet from 'pure-ui/components/bottom-sheet.vue';
import UpdateManager from 'pure-ui/components/update-manager.vue';
import Wallpapers from '@/views/wallpapers.vue';
import RxUniCloud from '@/core/unit/rx-uni-cloud';
import {map} from 'rxjs';
@Component({
  components: {
    Wallpapers, Cell, SearchBar, CellGroup, Tabbar, Waterfall, BottomSheet, UpdateManager,
  },
})
export default class Index extends Vue {
  settingSheetState = false;
  buttonNormalStyle = {
    padding: 0,
    borderRadius: 0,
    border: 'none',
    display: 'block',
    height: 'auto',
    backgroundColor: '#ffffff',
    fontSize: '100%',
    color: 'inherit',
  };
  list: any[] = [];
  pageHelper = {pageNum: 1, pages: 1};
  loadMoreStatus: 'loading'|'nomore' = 'loading';
  created() {
    uni.getUpdateManager();
    this.concatList();
  }
  toPrivacyPolicy() {
    uni.navigateTo({
      url: '/pages/privacy-policy/privacy-policy',
      fail: (result) => console.log(result),
    });
  }
  toLogs() {
    uni.navigateTo({
      url: '/pages/log/log',
    });
  }
  openSetting() {
    uni.openSetting({});
  }
  onShareAppMessage() {}
  onPullDownRefresh() {
    this.pageHelper.pageNum = 1;
    this.list = [];
    this.concatList();
  }
  toDetail(item: {name: string, url: string, _id: string}) {
    uni.navigateTo({url: `/pages/detail/detail?id=${item._id}`});
  }
  onReachBottom() {
    if (this.pageHelper.pageNum < this.pageHelper.pages) {
      this.pageHelper.pageNum++;
      this.concatList();
    }
  }
  concatList() {
    uni.showLoading({title: '加载中'});
    RxUniCloud.callFunction('images', {version: '1.0.0', ...this.pageHelper})
        .pipe(
            map((result) => {
              this.list = this.list.concat(result.result.data);
              this.pageHelper.pages = result.result.pages;
              uni.hideLoading();
              uni.stopPullDownRefresh();
            }),
        ).subscribe();
  }
}
</script>

<style lang="scss">
.image-card {
  width: 100%;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20+rpx;
}
</style>
