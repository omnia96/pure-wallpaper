<template>
  <view class="page">
    <u-gap height="20"></u-gap>
    <u-swiper :list="wallpapers"
              previousMargin="30"
              nextMargin="30"
              circular :autoplay="false"
              :height="swiperHeight"
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
  get swiperHeight() {
    let height = '';
    // #ifndef H5
    height = 'calc(100vh - 100px)';
    // #endif
    // #ifdef H5
    height = 'calc(100vh - 144px)';
    // #endif
    return height;
  }
  onLoad() {
    this.setWallpapers();
    this.createInterstitialAd();
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
  createInterstitialAd() {
    // #ifdef MP-WEIXIN
    let interstitialAd = null;
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-5cb9852387b53129',
      });
      const random = Math.random() > 0.5;
      console.log(random);
      if (interstitialAd && random) {
        interstitialAd.show().catch((err: any) => {
          console.log(err);
        });
      }
    } else {
      console.log('当前微信版本过低，暂不支持插屏广告');
    }
    // #endif
  }
}
</script>

<style lang="scss">
.page {
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
