<template>
  <view class="page">
    <privacy-policy name="Pure简壁纸"></privacy-policy>
  </view>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import PrivacyPolicy from '@city-hunter/pure-ui/components/privacy-policy.vue';
@Component({
  components: {PrivacyPolicy},
})
export default class PrivacyPolicyPage extends Vue {
}
</script>
<style lang="scss"></style>
