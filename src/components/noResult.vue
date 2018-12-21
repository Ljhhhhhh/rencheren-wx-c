<template>
  <div class="null-msg">
    <img class="msgpic" :src="imgSrc">
    <p class="msg">{{msg}}</p>
    <p class="default-btn" @click="btn">现在去逛逛</p>
  </div>
</template>
<script>
  export default {
    props: {
      msg: {
        type: String,
      },
      imgSrc: {
        type: String,
      },
    },
    methods: {
      btn() {
        this.$emit('goShop')
      },
    },
  }
</script>
<style lang="less" scoped>
  .null-msg{
    text-align: center;
    .msgpic{
      width: 100%;
      height: auto;
      margin: 0 auto;
    }
    .msg{
      font-size: 14px;
      color: #666;
      text-align: center;
      margin-top: 25px;
    }
    .default-btn{
      width: 150px;
      height: 40px;
      margin: 25px auto;
      line-height: 40px;
      border-radius: 3px;
      color: #FFF;
      background-color: #0198E7;
      text-align: center;
    }
  }
</style>
