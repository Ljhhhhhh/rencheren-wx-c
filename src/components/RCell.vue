<template>
  <router-link :to="link" class="r-cell vux-1px-b">
    <span class="title">{{title}}</span>
    <slot name="value"></slot>
    <slot name="image"></slot>
    <icon name="arrow-left" class="arrow-right-gray" scale="2.5"></icon>
  </router-link>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
    },
    link: {
      type: String,
    },
  },
}
</script>
<style lang="less" scoped>
  .r-cell{
    display: flex;
    justify-content: space-between;
    height: 40px;
    box-sizing: border-box;
    line-height: 40px;
    color: #111;
    font-size: 1rem;
    font-family: 'PingFangSC-Regular', 'SourceHanSansCN-Regular', Arial, Helvetica, sans-serif;
    font-weight: 200;
    position: relative;
    .arrow-right-gray{
      position: absolute;
      right: 0;
      top: 50%;
      transform: rotate(180deg) translateY(50%);
      color: #999;
    }
  }
</style>
