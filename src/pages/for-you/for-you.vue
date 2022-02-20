<template>
  <view class="page">
    <u-gap height="20"></u-gap>
    <u-swiper :list="wallpapers"
              previousMargin="30"
              nextMargin="30"
              circular :autoplay="false"
              height="calc(100vh - 144px)"
              bgColor="#ffffff"
              radius="10"
              @click="toDetail"
    >
    </u-swiper>
    <tabbar :list="tabBarList" :value="0"></tabbar>
  </view>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import Tabbar from '@city-hunter/pure-ui/components/tabbar.vue';
import AppConfig from '@/core/config/app.config';
import ZebraSwiper from '@zebra-ui/swiper/components/z-swiper/z-swiper.vue';
import ZebraSwiperItem from '@zebra-ui/swiper/components/z-swiper-item/z-swiper-item.vue';
import RxUniCloud from '@/core/unit/rx-uni-cloud';
import {finalize, map} from 'rxjs';
import SnSwiper from '../../components/sn-swiper/esc-swiper/index.vue';
import SnSwiperItem from '../../components/sn-swiper/esc-swiper-item/index.vue';

@Component({
  components: {Tabbar, ZebraSwiper, ZebraSwiperItem, SnSwiper, SnSwiperItem},
})
export default class ForYou extends Vue {
  tabBarList = AppConfig.TAB_BAR;
  wallpapers = [];
  current = 0;
  onLoad() {
    this.setWallpapers();
  }
  public onPullDownRefresh() {
    this.setWallpapers();
  }
  toDetail(index: number) {
    uni.navigateTo({url: `/pages/detail/detail?id=${this.wallpapers[index]['_id']}`});
  }

  private setWallpapers() {
    RxUniCloud.callFunction('for-you', {version: AppConfig.VERSION}).pipe(
        map((result) => {
          this.wallpapers = [];
          this.wallpapers = this.wallpapers.concat(result.result.data);
        }),
        finalize(() => uni.stopPullDownRefresh()),
    ).subscribe();
  }
}
</script>

<style lang="scss">
.page {
  touch-action: none;
}
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 60px);
}
.item {
  border-radius: 10px;
  overflow: hidden;
  height: 960 + rpx;
  position: relative;
}
</style>
