<template>
  <transition name="slide">
    <div class="sub container">
      <Header title="人车人估值"></Header>
      <short-info :emission="emission" :mileage="carInfo.mile" :license="carInfo.regDate" :city="city" :carTitle="carTitle">
      </short-info>
      <div class="info-check" v-if="checkStep">
        <group>
          <!-- <datetime title="车辆出厂日期" v-model="carInfo.makeDate" format="YYYY-MM" :min-year="2000" :max-year="+carInfo.regDate.substr(0,4)" placeholder="请填写车辆出厂日期"></datetime> -->
          <x-input title="车辆出厂日期" v-model="carInfo.makeDate" text-align="right" placeholder="请填写车辆出厂日期">
          </x-input>
          <selector title="车辆颜色" v-model="carInfo.color" :options="carConfig.colorList" direction="rtl"></selector>
          <selector title="内饰状况" v-model="carInfo.interior" :options="carConfig.interiorList" direction="rtl"></selector>
          <selector title="漆面状况" v-model="carInfo.surface" :options="carConfig.surfaceList" direction="rtl"></selector>
          <selector title="工况情况" v-model="carInfo.work_state" :options="carConfig.workStateList" direction="rtl"></selector>
          <x-input title="过户次数" v-model="carInfo.transfer_times" text-align="right">
            <span slot="right" class="unit">次</span>
          </x-input>
          <!-- <x-input class="number" title="手机号码" type="number" v-model="carInfo.mobile" text-align="right"></x-input> -->
        </group>
        <x-button type="primary" class="submit-btn" @click.native="submitCarInfo">提交</x-button>
      </div>
      <div class="purchasing-price" v-else>
        <div class="title">人车人收购价</div>
        <div class="purchasing-info">
          <div class="content-box">
            <div class="content">
              <strong>{{rcrPurchase}}</strong>
              <span>万</span>
            </div>
            <p>具体收购价格以实际车辆情况为主</p>
          </div>

          <div class="hint" v-if="hintShow">
            <span>提示</span>
            <div><p>您的卖车需求已经收到，客服小张将于24小时内与您联系！详情咨询 <a href="tel:400-8000">400-8000</a></p></div>
            <em @click.stop="hideHint">确定</em>
          </div>
        </div>
        <div class="sale-car-btn">
          <x-button @click.native="goBuy" type="primary">我要卖车</x-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import ShortInfo from '@/components/ShortInfo'
  import {evaluateFromRcr} from '@/api/evaluate/vin'
  // import {orderAdd} from '@/api/service/index'
  import carConfig from '@/config.js'
  import {
    Selector,
    Datetime,
    XInput,
    XButton,
  } from 'vux'
export default {
    data() {
      return {
        rcrPurchase: 0,
        checkStep: true,
        carTitle: '-',
        city: '-',
        license: '-',
        emission: '-',
        carInfo: {
          regDate: '',
          makeDate: '',
          transfer_times: 0,
          city: '',
          licneseTime: '',
          mile: '',
        },
        banner: '/static/icon/banner-car-evaluate.png',
        carConfig: carConfig,
        hintShow: false,
      }
    },
    created() {
      this.initCarInfo()
    },
    methods: {
      hideHint() {
        this.hintShow = false
      },
      initCarInfo() {
        const carInfo = this.$route.params.carInfo
        this.carInfo.modelId = carInfo.modelId
        this.carInfo.zone = carInfo.zone
        this.carInfo.regDate = carInfo.regDate
        this.carInfo.mile = parseFloat(carInfo.mile).toFixed(1)
        this.carTitle = this.$route.params.otherInfo.carTitle
        this.city = this.$route.params.otherInfo.cityName
        this.emission = this.$route.params.otherInfo.model_emission
      },
      goBuy() {
        // orderAdd().then(res => {

        // })
        alert('功能开发中……')
        this.hintShow = true
      },
      submitCarInfo() {
        console.log(this.carInfo)
        evaluateFromRcr(this.carInfo).then(res => {
          console.log('result:', res)
          if (res.errno === 0) {
            this.rcrPurchase = res.data.eval_prices.c2b_price
            this.checkStep = false
          } else {
            this.$vux.show({
              test: res.errmsg,
            })
          }
        })
      },
    },
    components: {
      ShortInfo,
      Selector,
      Datetime,
      XInput,
      XButton,
    },
  }
</script>
<style lang="less" scoped>
  .info-check {
    padding: 0 15px;
    .number{
      padding-right: 15px;
    }
  }

  .submit-btn {
    margin-top: 20px;
    font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
    font-size: 17px;
  }

  .purchasing-price {
    padding: 40px 15px 15px;

    .title {
      font-size: 20px;
      color: #FA601C;
      font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
      text-align: center;
    }

    .purchasing-info {
      position: relative;
      padding: 20px 0 0;
      margin-top: 15px;

      .content-box {
        p {
          text-align: center;
          color: #111;
        }
      }

      .content {
        margin: 0 auto;
        width: 220px;
        height: 157px;
        background: url('~/static/icon/purchasing-bg.png') no-repeat;
        background-size: 100% auto;
        position: relative;
        color: #FA601C;

        strong {
          position: absolute;
          display: block;
          font-size: 30px;
          line-height: 30px;
          left: 50%;
          top: 30%;
          transform: translate3d(-50%, 0, 0);
          font-style: normal;
        }

        span {
          position: absolute;
          font-size: 15px;
          line-height: 15px;
          font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
          right: 54px;
          top: 78px;
        }
      }

      .hint {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.75);
        color: #FFF;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 40px 40px 25px;
        div{
          flex: 3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          p{
            flex: 1;
            font-size: 12px;
            a{
              color: #FECB69;
              font-size: 12px;
            }
          }
        }
        span{
          font-size: 15px;
          flex: 1;
        }
        em{
          display: block;
          font-size: 14px;
          font-style: normal;
          line-height: 26px;
          height: 25px;
          box-sizing: border-box;
          flex: 1;
          padding: 0 15px;
          border-radius: 5px;
          position: relative;
          &::after{
            display: block;
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            border-radius: 5px;
            border: 1px solid #FFF;
            transform-origin: top left;
            transform: scale(0.5);
          }
        }
      }
    }



    .sale-car-btn {
      position: fixed;
      bottom: 20px;
      width: 100%;
      height: auto;
      padding: 0 15px;
      box-sizing: border-box;
      left: 50%;
      transform: translate3d(-50%, 0, 0);

      .weui-btn {
        font-size: 17px;
        font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
      }
    }
  }

</style>
