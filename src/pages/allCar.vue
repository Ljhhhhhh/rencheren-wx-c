<template>
  <transition name="slide">
    <div class="sub container" ref="container">
      <Header :title="title" ref="header"></Header>
      <div class="brand-content" ref="brandContent">
        <list-view :data="brandList" ref="list" @select="selectBrand"></list-view>
      </div>
      <transition name="slide">
        <div class="series-content" v-if="showStep>1" @click="changeStep(2)">
          <ul class="series-list">
            <li class="vux-1px-b" v-for="(item, index) in seriesList" :key="index" @click.stop="selectSeries(item)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </transition>
      <transition name="slide">
        <div class="mode-content" v-if="showStep>2">
          <ul class="mode-list">
            <li class="vux-1px-b" v-for="(item, index) in modeList" :key="index" @click.stop="selectMode(item)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
  import ListView from '@/components/listview'
  import {
    fetchCarBrand,
    fetchCarSeries,
    fetchCarMode,
  } from '@/api/evaluate/vin.js'
  import {
    calHei,
  } from '@/util/dom.js'
  import BScroll from 'better-scroll'
  export default {
    name: 'allCar',
    data() {
      return {
        showStep: 1,
        netBrandList: [],
        brandList: [],
        seriesList: [],
        modeList: [],
        title: '车辆选择',
        brand: {},
        series: {},
      }
    },
    created() {
      this.getCarSeries()
      console.log('route:', this.$route)
    },
    methods: {
      changeStep() {
        this.showStep = 2
      },
      selectMode(mode) {
        mode.brand = this.brand
        mode.series = this.series
        let name = ''
        if (this.$route.fullPath === '/car-info/all-car') {
          name = 'carInfo'
        }
        if (this.$route.fullPath === '/add-car/all-car') {
          name = 'addCar'
        }
        this.$router.push({
          name,
          params: mode,
        })
      },
      selectSeries(series) {
        this.showStep = this.showStep > 2 ? 2 : 3
        fetchCarMode(series.id).then(res => {
          console.log(series)
          this.series = {
            id: series.id,
            name: series.name,
          }
          this.modeList = res.data
          let scroll = new BScroll('.mode-content', {
            probeType: 1,
            click: true,
          })
          console.log(scroll)
        })
      },
      selectBrand(brand) {
        console.log(brand)
        this.showStep = this.showStep > 1 ? 1 : 2
        fetchCarSeries(brand.id).then(res => {
          this.brand = {
            id: brand.id,
            name: brand.name,
          }
          this.seriesList = res.data
          let scroll = new BScroll('.series-content', {
            probeType: 1,
            click: true,
          })
          console.log(scroll)
        })
      },
      getCarSeries() {
        fetchCarBrand().then(res => {
          this.netBrandList = res.data
          calHei(this.$refs.container, this.$refs.brandContent, this.$refs.header)
          this._normalizeList(this.netBrandList)
        })
      },
      _normalizeList(list) {
        let map = {}
        list.forEach((item, index) => {
          const key = item.initial
          if (!map[key]) {
            map[key] = {
              title: key,
              items: [],
            }
          }
          map[key].items.push(item)
        })
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        this.brandList = ret
      },
    },
    components: {
      ListView,
    },
  }
</script>
<style lang="less" scoped>
  .brand-content {
    overflow: hidden;
    position: relative;
  }

  .series-content,
  .mode-content {
    position: absolute;
    top: 44px;
    right: 0;
    bottom: 0;
    overflow: hidden;
    box-shadow: -3px 0px 4px #ccc;

    ul {
      li {
        line-height: 40px;
        padding: 0 15px;
        color: #111;
        font-size: 14px;
        height: 40px;
        span{
          display: inline-block;
          width: 100%;
          line-height: 20px;
        }
      }
    }
  }

  .series-content {
    background: #Fff;
    width: 80%;
    z-index: 3;
  }

  .mode-content {
    background: #FFF;
    width: 60%;
    z-index: 4;
  }

</style>
