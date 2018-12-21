<template>
  <div class="container">
    <Header title="车辆信息"></Header>
    <img v-lazy="banner" class="banner">
    <div class="info-check">
      <group>
        <selector title="车辆型号" @on-change="carChange" v-model="carInfo.modelId" :options="carModelList" direction="rtl"></selector>
        <popup-picker v-model="address" @on-shadow-change="provChange" title="所在城市" :data.sync="addressList"></popup-picker>
        <datetime title="首次上牌" v-model="carInfo.regDate" format="YYYY-MM" :min-year="regYearList.min" :max-year="regYearList.max"></datetime>
        <x-input v-model="carInfo.mile" title="行驶里程" text-align="right" placeholder="请填写行驶里程">
          <span slot="right" class="unit">万公里</span>
        </x-input>
      </group>
      <x-button class="moreMode" :plain="true" @click.native="showMoreMode">点击查看更多车型</x-button>
      <!-- <p class="moreMode" @click="showMoreMode">没有找到正确车型？点击查看所有车型</p> -->
    </div>
    <p class="btns">
      <x-button class="market-evaluate-btn" type="primary" @click.native="goEvaluate('marketEvaluate')">市场估值</x-button>
      <x-button class="rcr-evaluate-btn" @click.native="goEvaluate('rcrEvaluate')">人车人估值</x-button>
    </p>
    <r-toast :text="toastShow.text" :showDialog="toastShow.flag"  @changeShow="toastShow.flag=false"></r-toast>
    <router-view></router-view>
  </div>
</template>
<script>
  import Header from '@/components/Header'
  import {
    XButton,
    Selector,
    PopupPicker,
    XInput,
    Datetime,
  } from 'vux'
  import {
    fetchProv,
    fetchCity,
  } from '@/api/address/index'
  export default {
    name: 'carInfo',
    data() {
      return {
        model_emission: '', // 排放标准
        carTitle: '',
        addressList: [
          ['请选择省'],
          ['请选择市'],
        ],
        netProvList: [],
        netCityList: [],
        carModelList: [],
        regYearList: {},
        banner: 'static/icon/banner-car-evaluate.png',
        carInfo: {
          regDate: '',
        },
        oldProv: -1,
        address: [],
        toastShow: {
          flag: false,
          text: '',
        },
      }
    },
    watch: {
      $route: function (to, from) {
        if (from.name === 'allCar') {
          const mode = this.$route.params
          if (!mode.id) {
            return
          }
          this.carModelList.length = 0
          this.carModelList.push({
            key: mode.id,
            value: mode.name,
          })
          this.carInfo.modelId = mode.id
          this.carInfo.regDate = mode.minRegYear + '-1'
          this.carTitle = mode.name
          this.model_emission = mode.dischargeStandard
          this.regYearList = {
            min: +mode.minRegYear,
            max: +mode.maxRegYear,
          }
        }
      },
    },
    created() {
      this.getCarInfo()
      this.getProvList()
    },
    methods: {
      toggleShow() {
        this.toastShow.text = '功能开发中……'
        this.toastShow.flag = !this.toastShow.flag
      },
      showMoreMode() {
        this.$router.push({
          path: '/car-info/all-car',
        })
      },
      getCarInfo() {
        const carList = this.$route.params.modelInfo
        const carInfo = this.$route.params.carInfo
        if (!carList && !carInfo) {
          this.$router.push({
            path: '/find-car',
          })
        } else {
          this.carList = carList
          this.carList.forEach(car => {
            const key = car.model_id
            this.carModelList.push({
              key,
              value: car.model_name,
            })
          })
          const firstCar = this.carList[0]
          this.regYearList = {
            min: +firstCar.min_reg_year,
            max: +firstCar.max_reg_year,
          }
          this.carInfo = {
            modelId: firstCar.model_id,
            regDate: firstCar.min_reg_year + '-1',
          }
          this.carTitle = firstCar.model_name
          this.model_emission = firstCar.model_emission_standard
        }
      },
      carChange() {
        const modelId = this.carInfo.modelId
        /**
         * 根据当前车型更改当前车型的上牌年份区间
         */
        for (let i = 0; i < this.carList.length; i++) {
          let car = this.carList[i]
          if (car.model_id === modelId) {
            this.regYearList = {
              min: +car.min_reg_year,
              max: +car.max_reg_year,
            }
            this.carTitle = car.model_name
            this.carInfo.regDate = this.regYearList.min + '-1'
            this.model_emission = car.model_emission_standard
          }
        }
      },
      verifyInfo() {
        if (!this.netCityList.length) {
          this.toastShow.text = '请先选择城市'
          this.toastShow.flag = !this.toastShow.flag
  
          return false
        }
        if (!this.carInfo.mile) {
          this.toastShow.text = '请先填写行驶里程'
          this.toastShow.flag = !this.toastShow.flag
  
          return false
        }
        if (!this.carInfo.zone) {
          this.toastShow.text = '请先选择城市'
          this.toastShow.flag = !this.toastShow.flag
  
          return false
        }
        if (!this.carInfo.regDate) {
          this.toastShow.text = '请先选择上牌时间'
          this.toastShow.flag = !this.toastShow.flag
  
          return false
        }
        if (!this.carInfo.modelId) {
          this.toastShow.text = '请先选择所属车型'
          this.toastShow.flag = !this.toastShow.flag
  
          return false
        }
        return true
      },
      getCityId() {
        let citys = this.netCityList.filter(item => {
          return item.cityName === this.address[1]
        })
        if (citys.length) {
          this.carInfo.zone = citys[0].id
          return true
        } else {
          this.toastShow.text = '请选择城市'
          this.toastShow.flag = !this.toastShow.flag
  
          return false
        }
      },
      provChange(id, name) {
        this.address = id
        this.addressLabel = this.addressList[0]
        const provName = id[0]
        let provIds = this.netProvList.filter(item => {
          if (item.provName === provName) {
            return item
          }
        })
        let provId = -1
        if (provIds.length) {
          provId = provIds[0].provId
        }
        // return
        if (+provId === +this.oldProv) {
          return false
        } else {
          this.oldProv = provId
        }
        fetchCity(provId).then(res => {
          this.addressList[1].length = 0
          this.netCityList = res.data
          res.data.forEach(item => {
            this.addressList[1].push(item.cityName)
          })
        })
      },
      getProvList() {
        fetchProv().then(res => {
          this.netProvList = res.data
          this.addressList[0].length = 1
          res.data.forEach(item => {
            this.addressList[0].push(item.provName)
          })
        })
      },
      goEvaluate(type) {
        this.getCityId() && this.verifyInfo() && this.$router.push({
          name: type, // 'marketEvaluate',
          params: {
            carInfo: this.carInfo,
            otherInfo: {
              carTitle: this.carTitle,
              cityName: this.address[1],
              model_emission: this.model_emission,
            },
          },
        })
      },
    },
    components: {
      Header,
      Selector,
      XButton,
      PopupPicker,
      XInput,
      Datetime,
    },
  }
</script>
<style lang="less" scoped>
  .info-check {
    padding: 0 15px;
  }

  p.btns {
    padding: 0 15px;
    display: flex;
    font-size: 0;
    margin-top: 40px;

    .market-evaluate-btn,
    .rcr-evaluate-btn {
      flex: 1;
      font-size: 17px;
      color: #FFF;
      margin-top: 0;
      font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Regular', Arial, Helvetica, sans-serif;
    }

    .rcr-evaluate-btn {
      background: #FC984E;
      margin-left: 5px;
    }
  }

  p.moreMode {
    text-align: center;
    line-height: 30px;
    color: #111;
    font-size: 14px;

    span {
      color: #FC984E;
      cursor: pointer;
    }
  }

</style>
