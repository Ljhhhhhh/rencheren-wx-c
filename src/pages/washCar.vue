<template>
  <div class="container gray-bg">
    <Header title="免费洗车"></Header>
    <div class="banner">
      <img src="static/icon/banner-car-wash.png">
    </div>
    <div class="select-container" v-if="!orderSuccess">
      <div class="select-box">
        <p @click="showCarList('short')" class="select-controll" v-if="!selectedCar.plateNo">
          <span>选择车辆</span>
          <em class="triangle" ref="carTriangle"></em>
        </p>
        <div class="selected-car" @click="showCarList('short')" v-else>
          <img :src="logo">
          <!--暂时没有品牌对应的logo-->
          <div>
            <strong>{{selectedCar.plateNo}}</strong>
            <p>{{selectedCar.modeName}}</p>
          </div>
        </div>
        <div class="car-list-box" v-if="showCarListFlag">
          <ul class="car-list" ref="carList">
            <li class="vux-1px" v-for="car in carList" :key="car.key" @click="selectCar(car)">
              <img v-lazy="logo">
              <!--暂时没有品牌对应的logo-->
              <div>
                <strong>{{car.plateNo}}</strong>
                <p>{{car.modeName}}</p>
              </div>
            </li>
          </ul>
          <div class="more" @click="showCarList" ref="more-car-btn">
            <img src="static/icon/arrow-double.png">
          </div>
        </div>
      </div>
      <div class="select-box">
        <p @click="showNetList('short')" class="select-controll" v-if="!selectedNet.name">
          <span>选择网点</span>
          <em class="triangle" ref="netTriangle"></em>
        </p>
        <div class="selected-car" @click="showNetList('short')" v-else>
          <img :src="selectedNet.ico">
          <div>
            <strong>{{selectedNet.name}}</strong>
            <p>{{selectedNet.addr}}</p>
          </div>
        </div>
        <div class="car-list-box" v-if="showNetListFlag">
          <ul class="car-list" ref="netList">
            <li class="vux-1px" v-for="net in netList" :key="net.name" @click="selectNet(net)">
              <img v-lazy="net.ico">
              <div>
                <strong>{{net.name}}</strong>
                <p>{{net.addr}}</p>
              </div>
            </li>
          </ul>
          <div class="more" @click="showNetList" ref="more-net-btn">
            <img src="static/icon/arrow-double.png">
          </div>
        </div>
      </div>
      <div :class="['submit', submitDisabled?'active':'']" @click="showMobielConfirm" v-if="submitShow">
        立即预约
      </div>
    </div>
    <div class="order-success" v-else>
      <div class="div">
        <div class="title">洗车服务预约成功</div>
        <p>服务车辆：<span>{{selectedCar.plateNo}}</span></p>
        <p>服务网点：<span>{{selectedNet.name}}</span></p>
      </div>
    </div>
    <r-toast :text="toastShow.text" :showDialog="toastShow.flag"  @changeShow="toastShow.flag=false"></r-toast>
    <mobile-confirm :mobileShow="mobileShow" @closeMobile="cancelMobile" @setedPhone="submit"></mobile-confirm>
  </div>
</template>
<script>
  import {
    fetchCar,
  } from '@/api/mycar/mycar'
  import {
    orderAdd,
    fetchNet,
  } from '@/api/service/index'
  import mobileConfirm from '@/components/mobileConfirm'
  import cookie from 'js-cookie'
  export default {
    name: 'washCar',
    data() {
      return {
        logo: 'static/icon/logo.png', // 没有品牌对应的logo，暂时用这个
        orderSuccess: false, // 是否已经预约成功以切换组件
        showCarListFlag: false, // 是否展示前两辆车
        showNetListFlag: false, // 是否展示前两辆车
        carList: [],
        netList: [],
        selectedCar: {},
        selectedNet: {},
        toastShow: {
          flag: false,
          text: '',
        },
        mobileShow: false,
      }
    },
    created() {
      this.getCarList()
      this.getNetList()
    },
    computed: {
      submitDisabled() {
        if (this.selectedCar.plateNo && this.selectedNet.name) {
          return true
        }
        return false
      },
      submitShow() {
        if (this.showCarListFlag || this.showNetListFlag) {
          return false
        } else {
          return true
        }
      },
    },
    methods: {
      cancelMobile() {
        this.mobileShow = false
      },
      showMobielConfirm() {
        if (cookie.get('phoneNumber')) {
          this.submit()
        } else {
          this.mobileShow = true
        }
      },
      getCarList() {
        fetchCar().then(res => {
          this.carList = res.data.rows
        })
      },
      getNetList() {
        fetchNet().then(res => {
          console.log(res)
          this.netList = res.data.rows
        })
      },
      submit() {
        if (this.submitDisabled) {
          const data = {
            car_id: this.selectedCar.id,
            money: 0,
            remark: '',
            type: 'A',
            deptId: this.selectedNet.id,
            productId: 82,
          }
          orderAdd(data).then(res => {
            if (res.errno === 0) {
              this.orderSuccess = true
            } else {
              this.toastShow.text = res.errmsg || '预约失败，请重新'
              this.toastShow.flag = !this.toastShow.flag
            }
            console.log(res)
          })
        } else {
          this.toastShow.text = '请先选择车辆和网点'
          this.toastShow.flag = !this.toastShow.flag
        }
      },
      selectCar(car) {
        this.selectedCar = car
        console.log(this.selectedCar, '2222')
        this.showCarList('short')
      },
      showCarList(type) {
        this.showNetListFlag = false
        if (type === 'short' && !this.showCarListFlag) {
          this.showCarListFlag = true
          this.$nextTick(() => {
            this.setCarBox(type)
            if (this.carList.length >= 3) {
              this.$refs['more-car-btn'].style.display = 'block'
            } else {
              this.$refs['more-car-btn'].style.display = 'none'
            }
            if (this.$refs['carTriangle']) {
              this.$refs['carTriangle'].style.transform = 'rotate(180deg)'
            }
          })
        } else if (type === 'short') {
          this.showCarListFlag = false
          if (this.$refs['carTriangle']) {
            this.$refs['carTriangle'].style.transform = 'rotate(0deg)'
          }
        } else {
          this.setCarBox('all')
          this.$refs['more-car-btn'].style.display = 'none'
        }
      },
      setCarBox(type) {
        const carList = this.$refs.carList
        if (type === 'short') {
          carList.style['max-height'] = '115px'
          carList.style['overflow-y'] = 'hidden'
        } else {
          let top = carList.offsetTop
          let screenHeight = document.documentElement.clientHeight
          carList.style['max-height'] = screenHeight - top - 75 + 'px'
          carList.style['overflow-y'] = 'auto'
        }
      },
      showNetList(type) {
        this.showCarListFlag = false
        if (type === 'short' && !this.showNetListFlag) {
          this.showNetListFlag = true
          this.$nextTick(() => {
            this.setNetBox(type)
            if (this.netList.length >= 3) {
              this.$refs['more-net-btn'].style.display = 'block'
            } else {
              this.$refs['more-net-btn'].style.display = 'none'
            }
            if (this.$refs['netTriangle']) {
              this.$refs['netTriangle'].style.transform = 'rotate(180deg)'
            }
          })
        } else if (type === 'short') {
          this.showNetListFlag = false
          if (this.$refs['netTriangle']) {
            this.$refs['netTriangle'].style.transform = 'rotate(0deg)'
          }
        } else {
          this.setNetBox('all')
          this.$refs['more-net-btn'].style.display = 'none'
        }
      },
      selectNet(net) {
        this.selectedNet = net
        this.showNetList('short')
      },
      setNetBox(type) {
        const netList = this.$refs.netList
        if (type === 'short') {
          netList.style['max-height'] = '115px'
          netList.style['overflow-y'] = 'hidden'
        } else {
          let top = netList.offsetTop
          let screenHeight = document.documentElement.clientHeight
          netList.style['max-height'] = screenHeight - top - 20 + 'px'
          netList.style['overflow-y'] = 'auto'
        }
      },
    },
    components: {
      mobileConfirm,
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

  .select-container {
    margin-top: 25px;

    .select-box {
      background: #FFF;
      border-radius: 5px;
      width: auto;
      height: auto;
      margin: 25px 15px 0;

      .select-controll {
        height: 40px;
        line-height: 40px;
        color: #111;
        padding: 0 15px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 10px;

        span {
          flex: 9;
        }

        em {
          display: inline-block;
          flex: 1;
          max-width: 0;
          max-height: 0;
          border: 4px solid transparent;
          border-bottom: 0px solid transparent;
          border-top: 7px solid #666;
          transition: all 0.3s;
        }
      }

      .selected-car,
      .car-list li {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: auto;
        height: 50px;
        font-size: 0;
        margin-bottom: 10px;
        margin: 0 15px 10px;

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

      .selected-car img {
        margin-left: 0;
      }

      .car-list-box {

        ul,
        li {
          width: auto;
          list-style-type: none;
        }
      }
    }

    .more {
      text-align: center;
      height: 40px;
      line-height: 40px;

      img {
        display: inline-block;
        width: 14px;
        height: 12px;
      }
    }
  }

  .submit {
    position: absolute;
    bottom: 80px;
    left: 0;
    right: 0;
    height: 40px;
    background: #DDD;
    margin: 0 15px;
    border-radius: 5px;
    line-height: 40px;
    text-align: center;
    color: #999;
    font-size: 17px;
    font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;

    &.active {
      background: #FFCC66;
      color: #FFF;
    }
  }

  .order-success {
    margin: 25px 15px 0;
    width: auto;
    height: 120px;
    background: #FFF;
    border-radius: 5px;
    padding: 25px 0 0;
    text-align: center;

    .div {
      display: inline-block;
      width: 240px;
      height: 80%;
      vertical-align: middle;

      .title {
        font-size: 18px;
        color: #FA601c;
        margin-bottom: 15px;
      }

      p {
        text-align: left;
        color: #111;
      }
    }
  }

</style>
