<template>
  <div class="container gray-bg">
    <Header title="我的爱车"></Header>
    <div class="plr15">
      <router-link to="/add-car" class="add-car">
        <span><em class="add-btn-default"></em><strong>添加爱车</strong></span>
        <icon name="arrow-left" scale="3" class="arrow-right gray"></icon>
      </router-link>
      <div class="car-info" v-for="car in carList" :key="car.plateNo" v-if="carListShow">
        <div class="car-intro">
            <img v-lazy="logo"><!-- car.carLogo -->
          <div>
            <strong>{{car.plateNo}}</strong>
            <p>{{car.modeName}}</p>
          </div>
        </div>
        <!-- <group class="car-detail">
          <cell title="购买时间">{{car.buyTime}}</cell>
          <cell title="车辆归属地">{{car.affiliation}}</cell>
          <cell title="车辆归属地">{{car.affiliation}}</cell>
          <cell title="车辆归属地">{{car.affiliation}}</cell>
          <cell title="车辆归属地">{{car.affiliation}}</cell>
          <cell title="车辆归属地">{{car.affiliation}}</cell>
          <cell title="车辆归属地">{{car.affiliation}}</cell>
          <cell is-link title="车辆详细配置"></cell>
          <cell is-link title="车辆维修记录"></cell>
        </group> -->
      </div>
      <div v-else>
        <div class="blank">
          <img src="static/icon/no-car.png" class="no-car-img">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header'
  import {fetchCar} from '@/api/mycar/mycar'
  export default {
    name: 'myCarList',
    data () {
      return {
        logo: 'static/icon/logo.png', // 没有品牌对应的logo，暂时用这个
        carList: [
          {
            carLogo: 'static/car-logo.png',
            plateNumber: '浙BAO1P6',
            spec: '大众凌度 2017款 280TSI 手动舒适版',
            buyTime: '1995-6',
            affiliation: '浙江-金华',
          },
        ],
      }
    },
    created() {
      this.getCarList()
    },
    methods: {
      getCarList() {
        fetchCar().then(res => {
          console.log(res)
          this.carList = res.data.rows
          this.carList.forEach(car => {
            let a = car.plateNo.substr(0, 2)
            let b = car.plateNo.substr(2)
            car.plateNo = a + '·' + b
          })
        })
      },
    },
    computed: {
      carListShow () {
        return this.carList.length > 0
      },
    },
    components: {
      Header,
    },
  }
</script>
<style lang="less" scoped>
  .add-car {
    display: flex;
    margin: 25px auto;
    background: #FFF;
    height: 40px;
    line-height: 40px;
    border-radius: 7px;
    padding: 0 15px;
    color: #111;
    font-size: 14px;
    justify-content: space-between;
    align-items: center;
    span em{
      margin-right: 10px;
      vertical-align: middle;
    }
    span strong {
      font-weight: normal;
      vertical-align: middle;
    }
    .gray{
      color: #999;
    }
  }
  .car-info{
    border-radius: 7px 7px 0 0;
    background: #FFF;
    .car-intro{
      box-sizing: border-box;
      padding-left: 15px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 60px;
      border-bottom: 2px solid #F2F2F2;
      img,div{
        flex:1;
      }
      img{
        max-width: 40px;
        max-height: 40px;
        vertical-align: middle;
        margin-right: 15px;
      }
      div{
        padding-left: 15px;
        position: relative;
        &::after{
          content: '';
          display: block;
          width: 1px;
          height:85%;
          background: linear-gradient(bottom,#F2F2F2 85%,#FFF 85%) repeat-y;
          background-size: 1px 7px;
          left: 0;
          top: 50%;
          position: absolute;
          transform:translateY(-50%);
        }
        strong{
          font-size: 1.1rem;
          font-weight: normal;
          line-height: 20px;
        }
        p{
          font-size: .8rem;
          line-height: 1;
        }
      }
    }
  }
  .blank{
    text-align: center;
    position: fixed;
    top: 50%;
    left: 0;
    transform: translate3d(0, -50%, 0);
    img.no-car-img{
      width: 90%;
    }
  }
</style>
