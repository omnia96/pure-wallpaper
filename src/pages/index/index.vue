<template>
  <view class="page">
    <search-bar @to-account="settingSheetState = true"></search-bar>
    <waterfall class="w-100" margin="0" :value="list">
      <template  v-slot:default="{ value }">
        <view class="image-card">
          <u-image  :src="value" width="50vw" mode="widthFix"></u-image>
        </view>
      </template>
    </waterfall>
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
    <tabbar></tabbar>
  </view>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import SearchBar from 'pure-ui/components/search-bar.vue';
import CellGroup from 'pure-ui/components/cell-group.vue';
import Cell from 'pure-ui/components/cell.vue';
import Tabbar from 'pure-ui/components/tabbar.vue';
import Waterfall from 'pure-ui/components/waterfall.vue';
import BottomSheet from 'pure-ui/components/bottom-sheet.vue';
@Component({
  components: {Cell, SearchBar, CellGroup, Tabbar, Waterfall, BottomSheet},
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
  list = [];
  created() {
    uniCloud.callFunction({
      name: 'images',
      data: {name: 1},
      success: (result) => {
        console.log(result);
        this.list = result.result;
      },
    });
  }
  toPrivacyPolicy() {
    console.log(1111);
    uni.navigateTo({
      url: '/pages/privacy-policy/privacy-policy',
      fail: (result) => console.log(result),
    });
  }
  toLogs() {
    uni.navigateTo({
      url: '/pages/about/log/log',
    });
  }
  openSetting() {
    uni.openSetting({});
  }
  onShareAppMessage() {}
}
</script>

<style lang="scss">
.image-card {
  width: 100%;
}
</style>
