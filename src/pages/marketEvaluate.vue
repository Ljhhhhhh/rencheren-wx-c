<template>
  <transition name="slide">
    <div class="sub container">
      <Header title="市场估值"></Header>
      <short-info
        :emission="emission"
        :mileage="mileage"
        :license="license"
        :city="city"
        :carTitle="carTitle">
      </short-info>
      <div class="market-info">
        <p class="title">
          <img src="/static/icon/number-data.png" class="icon">
          <span>市场价格数据</span>
        </p>
        <p class="price">
          <span>新车指导价：{{marketPrice}}万</span>
          <!-- <span>该车系已经停售</span> -->
        </p>
        <p class="condition">
          <span @click="setCondition('normal')" :class="{active:condition === 'normal'}"><em>车况一般</em></span>
          <span @click="setCondition('good')" :class="{active:condition === 'good'}"><em>车况良好</em></span>
          <span @click="setCondition('excellent')" :class="{active:condition === 'excellent'}"><em>车况优秀</em></span>
        </p>
        <div class="price-detail">
          <p class="refresh-price-btn" @click="setCondition(default_car_condition)">
            <icon name="refresh" scale="2" class="refresh-icon"></icon>
            <span>重置</span>
          </p>
          <div class="top">
            <p>卖车价(万)：</p>
          </div>
          <div class="number">{{price}}</div>
          <p class="price-type"><span :class="{active:!priceSection}">车商收购价</span><span :class="{active:priceSection}">个人交易价</span></p>
          <div class="slide">
            <vue-slider v-if="slideShow" v-model="price" v-bind="slide" class="slider-comp"></vue-slider>
            <p class="value-point">
              <span v-for="(v, i) in vaulePointArr" :key="i">
                {{v}}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="promise">
        <div class="box">
          <img src="/static/icon/promise.png">
          <div>
            <p>我们评估的价格 承诺保卖</p>
            <p>给您信任的价格 安心卖高价</p>
          </div>
          <span @click="goRcr">人车人估值</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Header from '@/components/Header'
  import ShortInfo from '@/components/ShortInfo'
  import vueSlider from 'vue-slider-component'
  import {evaluateFromMarket} from '@/api/evaluate/vin'
  export default {
    name: 'marketEvaluate',
    data() {
      return {
        numberIconSrc: '',
        promiseIconSrc: '',
        slideShow: false,
        carTitle: '-',
        city: '-',
        license: '-',
        mileage: '-',
        emission: '-',
        price: 6.45, // 用户设置的价格
        priceDiv: 0, // 中间价，根据这个价格区分车商收购价、个人交易价
        marketPrice: 15, // 新车零售价
        condition: 'normal',
        conditionList: {},
        default_car_condition: '', // 请求到的数据的初始化的车况状态
        slide: {
          width: '275px',
          dotSize: 20,
          min: 0,
          max: 0,
          interval: 0.01,
          tooltip: false,
          show: true,
          eventType: 'auto',
          class: 'star-slider',
          processStyle: {
            'background': 'transparent',
          },
          bgStyle: {
            'background': '#DDD',
          },
        },
      }
    },
    mounted() {
      this.getEvaluate()
      setTimeout(() => {
        this.slideShow = true
      }, 400)
    },
    methods: {
      rest() {
        this.setCondition(this.default_car_condition)
      },
      setCondition(condition) {
        this.slideShow = false
        this.condition = condition
        this.conditionList.forEach(item => {
          if (item.condition === this.condition) {
            this.slide.min = item.dealer_low_buy_price // 当前车况的最低价
            this.slide.max = item.dealer_high_sold_price // 当前车况的最高价
            this.priceDiv = item.dealer_price // 当前车况的价格分水岭
            this.price = item.dealer_price // 价格
          }
        })
        setTimeout(() => {
          this.slideShow = true
        }, 400)
      },
      getEvaluate() {
        const carInfo = this.$route.params.carInfo
        this.carInfo = carInfo
        const params = this.$route.params
        if (!this.$route.params || !params.otherInfo || !params.carInfo) {
          this.$router.push({
            name: 'findCar',
          })
          return
        }
        this.carTitle = params.otherInfo.carTitle
        this.city = params.otherInfo.cityName
        this.mileage = parseFloat(carInfo.mile).toFixed(1)
        this.license = carInfo.regDate
        evaluateFromMarket(carInfo).then(res => {
          console.log(res)
          const data = res.data
          this.default_car_condition = data.default_car_condition
          this.emission = data.discharge_standard
          this.conditionList = data.eval_prices
          this.marketPrice = data.model_price
          this.setCondition(data.default_car_condition)
        })
      },
      goRcr() {
        this.$router.push({
          name: 'rcrEvaluate', // 'marketEvaluate',
          params: {
            carInfo: this.carInfo,
            otherInfo: {
              carTitle: this.carTitle,
              cityName: this.city,
              model_emission: this.emission,
            },
          },
        })
        // this.$router.push({
        //   path: '/car-info/rcr-evaluate',
        // })
      },
    },
    computed: {
      vaulePointArr() {
        let arr = []
        arr[0] = this.slide.min
        arr[4] = this.slide.max
        arr[2] = ((this.slide.min + this.slide.max) / 2).toFixed(2)
        arr[1] = ((+arr[0] + +arr[2]) / 2).toFixed(2)
        arr[3] = ((+arr[2] + +arr[4]) / 2).toFixed(2)
        return arr
      },
      priceSection() {
        let middle = this.priceDiv
        return this.price >= middle
      },
    },
    components: {
      Header,
      vueSlider,
      ShortInfo,
    },
  }
</script>
<style lang="less" scoped>
  .title,
  .title span {
    font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
    font-size: 15px;
    line-height: 40px;
  }

  .market-info {
    padding: 5px 15px;

    .title {
      font-size: 0;

      img {
        width: 18px;
        height: auto;
        margin-right: 10px;
      }

      span,
      img {
        vertical-align: middle;
        color: #111;
      }
    }

    .price {
      color: #111;

      span {
        display: inline-block;
        margin-right: 30px;
      }
    }
  }

  .condition {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;

    span {
      flex: 1;
      text-align: center;

      &:first-child {
        text-align: left;
      }

      &:last-child {
        text-align: right;
      }

      &.active em {
        color: #FFF;
        background-color: #18A7F9
      }

      em {
        width: 68px;
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        font-style: normal;
        background: #F2F2F2;
        color: #999;
        display: inline-block;
        border-radius: 10px;
        height: 20px;
        line-height: 20px;
        padding: 0 .2rem;

      }
    }
  }

  .price-detail {
    margin-top: 20px;
    padding: 25px 15px;
    background: #F2FAFF;
    border-radius: 7px;
    position: relative;

    .refresh-price-btn {
      position: absolute;
      top: 25px;
      right: 10px;
      width: 58px;
      height: 27px;
      border-radius: 7px;
      line-height: 27px;
      text-align: center;
      background-color: #FFCC66;
      color: #FFF;

      .refresh-icon,
      span {
        vertical-align: middle;
      }
    }

    .top {
      padding-left: 25px;
      p {
        color: #111;
        font-size: 16px;
      }
    }

    .number {
      text-align: center;
      font-size: 36px;
      color: #FA601C;
      font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Regular', Arial, Helvetica, sans-serif;
      margin: -20px 0 15px;
    }

    .price-type {
      text-align: center;
      margin-bottom: 25px;

      span {
        display: inline-block;
        width: 71px;
        height: 20px;
        color: #999;
        background-color: #DDD;
        font-size: 12px;
        position: relative;

        &.active {
          background: #FA601C;
          color: #FFF;

          &::before {
            position: absolute;
            content: '';
            width: 0;
            height: 0;
            bottom: 0;
            border: 7px solid #FA601C;
            border-top-color: transparent;
            border-left-color: transparent;
            left: 50%;
            transform: rotate(45deg) translate3d(0, 50%, 0);
          }
        }

        &:first-child {
          border-radius: 10px 0 0 10px;
        }

        &:last-child {
          border-radius: 0 10px 10px 0;
        }
      }
    }

    

    div.slide{
      display: flex;
      align-items: center;
      span.min,span.max{
        flex: 1;
        text-align: center;
        vertical-align: middle;
      }
      span.main{
        flex: 9
      }
      .slider-comp {
        width: 100%;
        margin: 0 auto;
      .custom-tooltip {
        width: 11px;
        height: auto;
        transform: translate3d(0, 100%, 0);

        img {
          width: 100%;
          height: auto;
        }
      }
    }
    }
    p.value-point{
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      width: 310px;
      span{
        text-align: center;
        flex: 1;
        color: #999;
      }
    }
  }

  .promise {
    border-top: 5px solid #F2F2F2;
    margin-top: 20px;
    padding: 10px 15px;
    .box{
      border-radius: 5px;
      border: 1px solid #18A7F9;
      padding: 22px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img{
        flex: 1;
        max-width: 35px;
        max-height: 37px;
      }
      div{
        flex: 5;
        padding-left: 15px;
        p{
          &:first-child{
            color: #111;
            font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Regular', Arial, Helvetica, sans-serif;
          }
          &:last-child{
            color: #999;
          }
        }
      }
      span{
        flex: 2;
        background: #FFCC66;
        color: #FFF;
        border-radius: 5px;
        text-align: center;
        line-height: 30px;
        padding: 0 5px;
      }
    }
  }

</style>
