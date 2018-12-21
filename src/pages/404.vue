<template>
<div class="container gray-bg">
  <p>你进入了一个未知领域<router-link to="/">点此返回主页</router-link></p>
  <img src="static/icon/404.jpg">
</div>
</template>
<script>
export default {
  name: 'noPage',
}
</script>
<style lang="less" scoped>
p{
  font-size: 18px;
  text-align: center;
  margin: 30px 0 15px;
  a{
    font-size: 18px;
    color: #FFCC66;
  }
}
img{
  display: block;
  margin: 0 auto;
  max-width: 85%;
  height: auto;
}
</style>