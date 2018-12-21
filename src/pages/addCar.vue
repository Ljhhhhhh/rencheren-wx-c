<template>
  <div class="sub container gray-bg">
    <Header title="添加爱车"></Header>
    <!-- <InputCarInfo @checkinfo="checkinfo"></InputCarInfo> -->
    <div class="fill-in-info plr15">
      <group class="info-input">
        <x-input @on-change="toUpperCase(plateNo, 'plateNo')" class="input" placeholder-align="right" text-align="right"
          placeholder="请输入车牌号" v-model="plateNo">
          <p slot="label"><em class="sprite_icon plateno"></em><span>车牌号码</span></p>
        </x-input>
        <x-input @on-change="toUpperCase(vin, 'vin')" class="input" placeholder-align="right" v-model="vin" text-align="right"
          placeholder="请输入17位车架号">
          <p slot="label"><em class="sprite_icon vin"></em><span>车架号</span></p>
        </x-input>
        <x-input @on-change="toUpperCase(engineNo, 'engineNo')" class="input" placeholder-align="right" v-model="engineNo"
          text-align="right" placeholder="请输入发动机号">
          <p slot="label"><em class="sprite_icon enginno"></em><span>发动机号</span></p>
        </x-input>
        <x-input class="input" placeholder-align="right" text-align="right" placeholder="" v-model="carInfo.mileage">
          <p slot="label"><em class="sprite_icon mile"></em><span>当前里程</span></p>
          <span slot="right" class="unit">万公里</span>
        </x-input>
        <datetime class="datetime" placeholder="请选择购买时间" format="YYYY-MM" :max-year="new Date().getFullYear()" v-model="carInfo.buytime">
          <p slot="title"><em class="sprite_icon buytime"></em><span>购买时间</span></p>
        </datetime>
        <div class="check-btn" @click="checkinfo">确定</div>
        <!-- <x-button class="check-btn" type="primary" :mini="true" @click.native="checkinfo">确定</x-button> -->
      </group>
    </div>
    <div class="get-info" v-if="checkoutInfoFlag">
      <group class="car-detail">
        <selector title="品牌" v-model="carInfo.brandName" :options="brandList" direction="rtl"></selector>
        <selector title="车系" v-model="carInfo.seriesName" :options="seriesList" direction="rtl"></selector>
        <selector title="车型年款" v-model="carInfo.year" :options="yearList" direction="rtl"></selector>
        <selector title="车型" v-model="carInfo.modelName" :options="modelList" direction="rtl"></selector>
        <cell>
          <p class="remark" slot="title">注：若显示内容有疑义请手动选择车型</p>
          <x-button class="manual-btn" :mini="true" type="primary" @click.native="manualInput">选择车型</x-button>
        </cell>
      </group>
      <div class="submit">
        <div class="submit-btn" @click="submit">提交</div>
        <!-- <x-button type="primary" size="large" class="submit-btn" @click.native="submit">提交</x-button> -->
      </div>
    </div>
    <r-toast :text="toastShow.text" :showDialog="toastShow.flag" :typeClass="toastShow.typeClass"  @changeShow="toastShow.flag=false"></r-toast>
    <router-view></router-view>
  </div>
</template>
<script>
  import Header from '@/components/Header'
  import isVehicleNumber from '@/util/verifyPlate'
  import {
    addCar,
  } from '@/api/mycar/mycar'

  import {
    XInput,
    Datetime,
    XButton,
    Selector,
  } from 'vux'
  import {
    findCarByVin,
  } from '@/api/evaluate/vin'
  export default {
    data() {
      return {
        plateNo: '', // 车牌号码
        vin: '', // LSVFA49J232037048
        engineNo: '', // 发动机号
        carInfo: {
          plateNo: '',
        },
        checkoutInfoFlag: false, // 是否进入确认信息表
        resultCarList: [],
        brandList: [], // 品牌列表
        seriesList: [], // 车系列表
        yearList: [],
        modelList: [],
        toastShow: {
          flag: false,
          text: '',
          typeClass: 'text',
        },
      }
    },
    watch: {
      $route: function (to, from) {
        if (from.name === 'allCar') {
          const mode = this.$route.params
          console.log(mode)
          if (!mode.id) {
            return
          }
          this.brandList.length = 0
          this.brandList.push(mode.brand.name)
          this.carInfo.brandName = mode.brand.name
          this.carInfo.brand_id = mode.brand.id
          this.seriesList.length = 0
          this.seriesList.push(mode.series.name)
          this.carInfo.seriesName = mode.series.name
          this.modelList.length = 0
          this.modelList.push(mode.name)
          this.carInfo.modelName = mode.name
          this.carInfo.modeId = mode.id
          this.yearList.length = 0
          this.yearList.push(mode.year)
          this.carInfo.year = mode.year
        }
      },
    },
    methods: {
      submit() {
        console.log(this.carInfo.modelName)
        if (!this.carInfo.brand_id || !this.carInfo.modeId) {
          this.resultCarList.forEach(car => {
            if (car.brand_name === this.carInfo.brandName) {
              this.carInfo.brand_id = car.brand_id
            }
            if (car.model_name === this.carInfo.modelName) {
              this.carInfo.modeId = car.model_id
            }
          })
        }
        this.carInfo.engineNo = this.engineNo
        this.carInfo.plateNo = this.plateNo
        this.carInfo.frameNo = this.vin
        delete this.carInfo.brandName
        console.log(this.carInfo)
        addCar(this.carInfo).then(res => {
          if (res.errno === 0) {
            this.toastShow.text = '添加成功，即将返回车辆列表……'
            this.toastShow.flag = !this.toastShow.flag
            this.toastShow.typeClass = 'success'
            setTimeout(() => {
              this.$router.push({
                path: '/my-car-list',
              })
            }, 1500)
          } else {
            this.toastShow.text = '添加失败，请检查信息后重新提交'
            this.toastShow.flag = !this.toastShow.flag
            this.toastShow.typeClass = 'text'
          }
          console.log('添加爱车：', res)
        })
      },
      manualInput() {
        this.$router.push({
          path: '/add-car/all-car',
        })
      },
      toUpperCase(val, key) {
        this[key] = val.toLocaleUpperCase()
      },
      checkinfo() {
        if (this.vin.length !== 17) {
          this.toastShow.text = '请输入正确的vin码'
          this.toastShow.flag = !this.toastShow.flag
          return
        }
        if (!isVehicleNumber) {
          this.toastShow.text = '请填写正确的车牌号码'
          this.toastShow.flag = !this.toastShow.flag
          return
        }
        if (!this.engineNo) {
          this.toastShow.text = '请填写发动机号'
          this.toastShow.flag = !this.toastShow.flag
          return
        }
        findCarByVin(this.vin).then(res => {
          console.log('查询结果：', res)
          if (res.errno === 0) {
            this.resultCarList = res.data.modelInfo
            this.resultCarList.forEach(car => {
              this.brandList.push(car.brand_name)
              this.seriesList.push(car.series_name)
              this.yearList.push(car.model_year)
              this.modelList.push(car.model_name)
            })
            this.brandList = Array.from(new Set(this.brandList))
            this.seriesList = Array.from(new Set(this.seriesList))
            this.yearList = Array.from(new Set(this.yearList))
            this.modelList = Array.from(new Set(this.modelList))
            this.checkoutInfoFlag = true
            this.carInfo.brandName = this.brandList[0]
            this.carInfo.seriesName = this.seriesList[0]
            this.carInfo.year = this.yearList[0]
            this.carInfo.modelName = this.modelList[0]
          } else {
            this.toastShow.text = res.errmsg
            this.toastShow.flag = !this.toastShow.flag
          }
        })
      },
    },
    components: {
      Header,
      XInput,
      Datetime,
      XButton,
      Selector,
    },
  }
</script>
<style lang="less" scoped>
  .fill-in-info {
    .sprite_icon {
      width: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: middle;
      background-color: red;
      background: url('~static/icon/css_sprites.png') no-repeat;
      background-size: 150px 24px;

      &.plateno {
        background-position: -27px 0;
      }

      &.vin {
        background-position: -2px 0;
      }

      &.enginno {
        background-position: -115px 0;
      }

      &.mile {
        background-position: -52px 0;
      }

      &.buytime {
        background-position: -79px 0;
      }
    }

    .input,
    .datetime {
      span {
        display: inline-block;
        margin-left: .5rem;
        vertical-align: middle;
      }
    }

    .check-btn {
      background: #FFCC66;
      color: #FFF;
      position: relative;
      right: -4px;
      display: block;
      width: 80%;
      height: 40px;
      margin: 10px auto 0;
      outline: none;
      border: none;
      padding: 0 1rem;
      box-sizing: border-box;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
    }
  }

  .get-info {
    margin-top: 25px;
    padding: 0 15px;
    border-radius: 7px;

    .remark {
      color: #999;
      font-size: 12px;
    }

    .manual-btn {
      width: 65px;
      height: 25px;
      line-height: 25px;
      padding: 0;
    }
  }

  .submit {
    margin: 25px auto 10px;

    .submit-btn {
      font-size: 17px;
      font-family: 'PingFangSC-Medium', Arial, Helvetica, sans-serif;
      width: 80%;
      line-height: 40px;
      height: 40px;
      background: #FFCC66;
      color: #FFF;
      text-align: center;
      border-radius: 5px;
      padding: 0 1em;
      box-sizing: border-box;
      margin:  0 auto;
    }
  }

</style>
