<template>
  <view class="page">
    <page-meta>
      <navigation-bar title="更新日志"></navigation-bar>
    </page-meta>
    <update-log :logs="logs"></update-log>
  </view>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import UpdateLog from '@city-hunter/pure-ui/components/update-log.vue';

@Component({
  components: {
    UpdateLog,
  },
})
export default class Log extends Vue {
  logs = [
    {
      version: '0.0.7',
      date: '2022-01-30',
      content: ['- 新增为你推荐模块'],
    },
    {
      version: '0.0.6',
      date: '2022-01-13',
      content: [
        '- 新增分享功能',
        '- 新增壁纸信息',
        '- 修复ios系统下下载按钮错位的bug',
      ],
    },
    {
      version: '0.0.5',
      date: '2021-12-28',
      content: [
        '- 新增更新日志',
        '- 新增加载中显示',
        '- 新增分页加载',
        '- 修复图片详情页面无法返回首页bug',
      ],
    },
    {
      version: '0.0.4',
      date: '2021-12-22',
      content: [
        '- 小程序发布',
      ],
    },
  ];
}
</script>
<style lang="scss"></style>
