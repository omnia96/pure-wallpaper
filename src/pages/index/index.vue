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
          <view class="image-mask"></view>
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
      <cell-group :is-last="true">
        <cell icon="/static/pure-weather.png"
              title="Pure简天气" :is-last="true"
              @click="toPureWeather"
        ></cell>
      </cell-group>
    </bottom-sheet>
    <update-manager></update-manager>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <wallpapers></wallpapers>
    <!-- #endif -->
    <tabbar :list="tabBarList" :value="1"></tabbar>
  </view>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import SearchBar from '@city-hunter/pure-ui/components/search-bar.vue';
import CellGroup from '@city-hunter/pure-ui/components/cell-group.vue';
import Cell from '@city-hunter/pure-ui/components/cell.vue';
import Tabbar from '@city-hunter/pure-ui/components/tabbar.vue';
import Waterfall from '@city-hunter/pure-ui/components/waterfall.vue';
import BottomSheet from '@city-hunter/pure-ui/components/bottom-sheet.vue';
import UpdateManager from '@city-hunter/pure-ui/components/update-manager.vue';
import Wallpapers from '@/views/wallpapers.vue';
import RxUniCloud from '@/core/unit/rx-uni-cloud';
import NavigationDrawer from '@city-hunter/pure-ui/components/navigation-drawer.vue';

import {map} from 'rxjs';
import AppConfig from '@/core/config/app.config';
@Component({
  components: {
    Wallpapers,
    Cell, SearchBar, CellGroup, Tabbar, Waterfall, BottomSheet, UpdateManager, NavigationDrawer,
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
  tabBarList = AppConfig.TAB_BAR;
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
    RxUniCloud.callFunction('images', {version: AppConfig.VERSION, ...this.pageHelper})
        .pipe(
            map((result) => {
              this.list = this.list.concat(result.result.data);
              this.pageHelper.pages = result.result.pages;
              uni.hideLoading();
              uni.stopPullDownRefresh();
            }),
        ).subscribe();
  }
  toPureWeather() {
    uni.navigateToMiniProgram({
      appId: 'wx1348aa04528e9e17',
    });
  }
}
</script>

<style lang="scss">
.image-card {
  width: 100%;
  position: relative;
}
.image-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20+rpx;
}
</style>
