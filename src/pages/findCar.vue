<template>
  <div class="container gray-bg">
    <Header title="爱车估值"></Header>
    <div class="content">
      <!-- <img src="static/icon/logo.png" class="logo"> -->
      <img v-lazy="banner" class="banner">
      <div class="vin">
        <input type="text" placeholder="请输入17位车架号" @blur="listShow(false)" @focus="listShow(true)" v-model="vin" @input="toUpperCase(vin, 'vin')">
        <div class="car-list">
          <div class="car-info vux-1px" v-for="car in carList" :key="car.plateNo" v-show="carListShowFlag">
            <div class="car-intro" @click="myCarVinSearch(car)">
              <img v-lazy="logo"><!-- car.carLogo -->
              <div>
                <strong>{{car.plateNo}}</strong>
                <p>{{car.modeName}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <p class="verify">
        <input type="text" placeholder="请输入验证码">
        <img src="static/icon/verify.png" class="verify-img">
        <icon class="refresh-btn" name="refresh" scale="3"></icon>
      </p> -->
      <p class="search-btn" v-show="!carListShowFlag">
        <x-button type="primary" :disabled="!disabledBtn" @click.native="verifyCar">查询</x-button>
      </p>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header'
  import {
    findCarByVin,
  } from '@/api/evaluate/vin'
  import cookie from 'js-cookie'
  import {
    fetchCar,
  } from '@/api/mycar/mycar'
  import {
    XButton,
  } from 'vux'
  export default {
    name: 'findCar',
    data() {
      return {
        logo: 'static/icon/logo.png', // 没有品牌对应的logo，暂时用这个
        banner: 'static/icon/banner-car-evaluate.png',
        vin: '', // LSVFA49J232037048
        carList: [],
        carListShowFlag: false,
      }
    },
    mounted() {
      this.getVin()
      this.getCarList()
    },
    computed: {
      disabledBtn() {
        return this.vin.length === 17
      },
    },
    methods: {
      listShow(flag) {
        this.carListShowFlag = flag
      },
      getCarList() {
        console.log('getCarList')
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
      getVin() {
        this.vin = cookie.get('vin') || ''
      },
      verifyCar() {
        cookie.set('vin', this.vin)
        findCarByVin(this.vin).then(res => {
          this.$router.push({
            name: 'carInfo',
            params: res.data,
          })
          console.log(res)
        })
      },
      myCarVinSearch(car) {
        findCarByVin(car.frameNo).then(res => {
          this.$router.push({
            name: 'carInfo',
            params: res.data,
          })
          console.log(res)
        })
      },
      toUpperCase(val, key) {
        this[key] = val.toLocaleUpperCase()
      },
    },
    components: {
      Header,
      XButton,
    },
  }
</script>
<style lang="less" scoped>
  .content {
    text-align: center;

    .logo {
      width: 127px;
      height: auto;
      text-align: center;
      margin: 50px 0;
    }

    .verify-img {
      max-width: 100px;
      height: auto;
      line-height: 40px;
      vertical-align: middle;
    }

    .search-btn {
      padding: 0 15px;
      margin-top: 20px;
    }

    .vin {
      line-height: 40px;
      padding: 0 15px;
      text-align: left;
      font-size: 0;

      &+p {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        * {
          flex: 1;
        }
      }

      input {
        height: 40px;
        border-radius: 7px 7px 0 0;
        outline: none;
        border: 1px solid #FFCC66;
        box-sizing: border-box;
        text-indent: 1rem;
      }

      &.vin input {
        width: 100%;
      }

      &.verify {
        input {
          max-width: 155px;
        }

        .refresh-btn {
          max-width: 25px;
          max-height: 25px;
          color: #558A16;
        }
      }
    }
  }

  .vin {
    margin-top: 40px;
    position: relative;
    .car-list{
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      position: absolute;
      top: 40px;
      left: 0;
      max-height: 265px;
      z-index: 2;
      overflow-y: auto;
    }
  }

  .car-info {
    // border-radius: 7px 7px 0 0;
    border-color: #FFCC66;
    border-top: none;
    background: #FFF;

    .car-intro {
      box-sizing: border-box;
      padding-left: 15px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 60px;
      border-bottom: 2px solid #F2F2F2;

      img,
      div {
        flex: 1;
      }

      img {
        max-width: 40px;
        max-height: 40px;
        vertical-align: middle;
        margin-right: 15px;
      }

      div {
        padding-left: 15px;
        position: relative;

        &::after {
          content: '';
          display: block;
          width: 1px;
          height: 85%;
          background: linear-gradient(bottom, #F2F2F2 85%, #FFF 85%) repeat-y;
          background-size: 1px 7px;
          left: 0;
          top: 50%;
          position: absolute;
          transform: translateY(-50%);
        }

        strong {
          font-size: 1.1rem;
          font-weight: normal;
          line-height: 20px;
        }

        p {
          font-size: .8rem;
          line-height: 1;
        }
      }
    }
  }

</style>
