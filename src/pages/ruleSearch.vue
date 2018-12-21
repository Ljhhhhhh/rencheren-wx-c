<template>
  <div class="container gray-bg">
    <Header title="违章查询"></Header>
    <div class="banner">
      <img src="static/icon/banner-car-rule.png">
    </div>
    <div class="content plr15">
      <div class="car-list">
        <div class="title">选择车辆：</div>
        <div class="car" @click="toggleShow" v-for="car in carList" :key="car.key"> 
          <!-- selectCar(car) -->
          <img :src="logo">
          <div>
            <strong>{{car.plateNo}}</strong>
            <p>{{car.modeName}}</p>
          </div>
        </div>
      </div>
      <router-link to="/add-car" class="add-car">
        <span><em class="add-btn-default"></em>添加新车</span>
        <icon name="arrow-left" scale="3" class="arrow-right gray"></icon>
      </router-link>
      <div class="promise">
        <div class="item">
          <img src="static/icon/promise-safe.png">
          <span>安全</span>
          <em>云加密保护隐私</em>
        </div>
        <div class="item">
          <img src="static/icon/promise-fast.png">
          <span>快捷</span>
          <em>快速查询</em>
        </div>
        <div class="item">
          <img src="static/icon/promise-accurate.png">
          <span>精准</span>
          <em>官方数据直连</em>
        </div>
      </div>
    </div>
    <r-toast :text="toastShow.text" :showDialog="toastShow.flag" @changeShow="toastShow.flag=false"></r-toast>
    <router-view></router-view>
  </div>
</template>
<script>
  import {fetchCar} from '@/api/mycar/mycar'
  import RToast from '@/components/RToast'
export default {
    name: 'ruleSearch',
    created() {
      this.getCarList()
    },
    data() {
      return {
        carList: [],
        logo: 'static/icon/logo.png', // 没有品牌对应的logo，暂时用这个
        toastShow: {
          flag: false,
          text: '',
        },
      }
    },
    methods: {
      toggleShow() {
        this.toastShow.text = '功能开发中……'
        this.toastShow.flag = true
      },
      getCarList() {
        fetchCar().then(res => {
          this.carList = res.data.rows
        })
      },
      selectCar(car) {
        console.log(car)
        this.$router.push({
          path: '/rule-search/rule-info',
          params: car.value,
        })
      },
    },
    components: {
      RToast,
    },
  }
</script>
<style lang="less" scoped>
  .banner {
    width: 100%;
    height: auto;
    font-size: 0;

    img {
      width: 100%;
    }
  }

  .add-car {
    display: flex;
    margin: 15px auto;
    background: #FFF;
    height: 40px;
    line-height: 40px;
    border-radius: 7px;
    padding: 0 15px;
    color: #111;
    font-size: 14px;
    justify-content: space-between;
    align-items: center;

    span em {
      margin-right: 10px;
    }

    .gray {
      color: #999;
    }
  }
  .car-list{
    background: #FFF;
    border-radius: 5px;
    max-height: 170px;
    overflow-y: auto;
    padding: 10px 0;
    margin: 15px auto 0;
    -webkit-overflow-scrolling: touch;
    .title {
      font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
      padding-left: 15px;
      margin-bottom: 10px;
    }
  }
  .car {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    height: 50px;
    font-size: 0;
    margin-bottom: 10px;
    margin: 0 15px 10px;
    border: 1px solid #CCC;

    img {
      flex: 1;
      max-width: 35px;
      max-height: 35;
      margin: 0 15px;
    }

    &>div {
      flex: 5;
      padding-left: 15px;
      border-left: 1px dashed #CCC;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;

      strong {
        flex: 1;
        font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
        color: #111;
        line-height: 24px;
        display: inline-block;
      }

      p {
        flex: 1;
        color: #111;
        font-size: 12px;
        line-height: 16px;
      }
    }
  }
  .promise{
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .item{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      * {
        flex: 1
      }
      img{
        width: 30px;
        height: auto;
        margin-bottom: 5px;
      }
      span{
        color: #111;
        line-height: 1.5;
      }
      em{
        font-size: 12px;
        color: #999;
        line-height: 12px;
        font-style: normal;
      }
    }
  }

</style>
