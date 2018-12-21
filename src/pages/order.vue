<template>
  <div class="container gray-bg">
    <Header title="订单管理" style="background:#fff" :showBack="!edit.flag">
      <!-- <div slot="left" class="edit_cancel" v-show="edit.flag" @click="followEdit('all')">全选</div> -->
      <div slot="right" v-show="carList.length" class="edit_btn" @click="followEdit('edit')">{{edit.msg}}</div>
    </Header>
    <div class="content">
      <!-- <tab v-model="typeActive">
        <tab-item v-for="type in types" :key="type.type" @on-item-click="typeChange(type)">
          {{type.name}}
        </tab-item>
      </tab> -->
      <scroll class="scroll-box" :style="{bottom: scrollBottom}" :listenScroll="true" @scroll="loadMore" :pullup="true" @scrollToEnd="scrollToEnd" ref="scrollCar">
        <div class="car-list_box">
          <template v-for="(car, index) in carList">
          <div class="car-list_item van-hairline--bottom" :key="index" @click="carDetail(car.id)" v-if="car.type !== 'A'">
            <div class="dept-info"><span>{{car.deptName}}</span><span class="no">订单编号：{{car.no}}</span></div>
            <div class="car-info_box">
            <div class="state" v-show="edit.flag" @click.stop="selectCar(car.id)">
              <icon name="circle" scale='2.5' class="state_icon" v-if="edit.editList !== car.id"></icon>
              <icon name="selected" scale='2.5' v-else class="state_icon"></icon>
            </div>
            <div class="car-thumb">
              <p>{{car.acts}}</p>
              <img v-lazy="car.thumb">
            </div>
            <div class="car-info">
              <p class="title">{{car.title}}<span>{{car.tags}}</span></p>
              <p v-if="car.price" class="price">厂商指导价：{{car.price | formatPrice}}元</p>
              <p v-if="car.payment" class="highlight">首付<span>{{car.payment | formatPrice}}</span>元开回家</p>
            </div>
            </div>
            <div class="order-state" :style="{color: stateMsgMap[car.status].color}">
              <icon class="icon" :name="stateMsgMap[car.status].icon" :scale="2"></icon>
              <span>{{stateMsgMap[car.status].msg}}</span>
            </div>
          </div>
          <div class="car-list_item van-hairline--bottom" :key="index" v-else>
            <div class="dept-info"><span>{{car.deptName}}</span><span class="no">订单编号：{{car.no}}</span></div>
            <div class="car-info_box">
            <div class="state" v-show="edit.flag" @click.stop="selectCar(car.id)">
              <icon name="circle" scale='2.5' class="state_icon" v-if="edit.editList !== car.id"></icon>
              <icon name="selected" scale='2.5' v-else class="state_icon"></icon>
            </div>
            <div class="car-thumb">
              <p>{{car.acts}}</p>
              <img v-lazy="car.thumb">
            </div>
            <div class="car-info">
              <p class="title">{{car.title}}<span>{{car.tags}}</span></p>
              <p v-if="car.price" class="price">原价：{{car.price | formatPrice}}元</p>
            </div>
            </div>
            <div class="order-state" :style="{color: washStateMap[car.status].color}">
              <icon class="icon" :name="washStateMap[car.status].icon" :scale="2"></icon>
              <span>{{washStateMap[car.status].msg}}</span>
            </div>
          </div>
          </template>
        </div>
        <!-- <div class="load-state_msg" v-show="loadMoreHeight.loading === 2">
          <span>{{loadMoreHeight.msg}}</span>
          <icon name="loading" scale="1.5" class="load-state_icon" v-if="!loadMoreHeight.loadComplete"></icon>
          <icon name="stop" scale="1.5" class="load-complete_icon" v-else></icon>
        </div> -->
        <no-result
        class="no-result_box"
        v-show="!carList.length"
        msg="暂无订单，快去选车吧～"
        :imgSrc="noResultImgSrc"
        @goShop="goShop"
        ></no-result>
      </scroll>
      <div class="delete-follow_btn vux-1px-t" v-show="edit.flag" @click="delFollow">
        <span>删除</span>
      </div>
    </div>
    <div class="load-state_msg" v-show="loadMoreHeight.loading === 2">
      <span>{{loadMoreHeight.msg}}</span>
      <icon name="loading" scale="1.5" class="load-state_icon" v-if="!loadMoreHeight.loadComplete"></icon>
      <icon name="stop" scale="1.5" class="load-complete_icon" v-else></icon>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import {
    Tab,
    TabItem,
  } from 'vux'
  import scroll from '@/components/scroll'
  import {
    fetchOrder,
    delOrder,
  } from '@/api/mycar/order'
  import noResult from '@/components/noResult'
  import {washStateMap, stateMsgMap} from '@/config/index'
  export default {
    name: 'Order',
    data() {
      return {
        stateMsgMap,
        washStateMap,
        noResultImgSrc: '/usercenter/static/icon/no-result_order.png',
        edit: {
          flag: false,
          msg: '编辑',
          editList: '',
        },
        typeActive: 0,
        carListMap: {
          news: [],
          rentings: [],
          olds: [],
        },
        types: [{
          name: '新车',
          type: 'news',
          page: 1,
          carTotal: 0,
        },
        {
          name: '租车',
          type: 'rentings',
          page: 1,
          carTotal: 0,
        },
        {
          name: '二手车',
          type: 'olds',
          page: 1,
          carTotal: 0,
        },
        ],
        loadMoreHeight: {
          scrollBoxHeight: null,
          carListBoxHeight: null,
          loading: -1,
          loadComplete: false,
          // carTotal: 0,
          msg: '加载中',
        },
        defaultResponseData: {
          // lx: 'news',
          size: 5,
          page: 1,
        },
      }
    },
    created() {
      this.getCarList()
    },
    computed: {
      carList: {
        get() {
          let type = this.types[this.typeActive].type
          let list = this.carListMap[type]
          return list
        },
        set() {
          let type = this.types[this.typeActive].type
          let list = this.carListMap[type]
          return list
        },
      },
      scrollBottom() {
        let bottom
        if (this.edit.flag) {
          bottom = '60px'
        } else {
          bottom = 0
        }
        return bottom
      },
      stateMsg() {
        let type = this.types[this.typeActive].type
        if (type === 'rentings') {
          return '已租'
        } else {
          return '已售'
        }
      },
    },
    methods: {
      goShop() {
        let type = this.types[this.typeActive].type
        let url
        switch (type) {
          case 'news':
            url = 'car'
            break
          case 'rentings':
            url = 'rent'
            break
          case 'olds':
            url = 'second'
            break
          default:
            break
        }
        window.location.href = `http://testwx.chetianyi.com/${url}`
      },
      delFollow() {
        let me = this
        delOrder(this.edit.editList).then(res => {
          if (res.errno === 0) {
            let type = me.types[me.typeActive].type
            me.carListMap[type] = me.carListMap[type].filter(car => {
              return me.edit.editList !== car.id
            })
            me.followEdit('cancel')
          }
        })
      },
      selectCar(id) {
        this.edit.editList = id
      },
      followEdit(type) {
        this.edit.editList = []
        if (type === 'all') {
          this.carList.forEach(car => {
            this.edit.editList.push(car.id)
          })
        } else if (this.edit.flag) {
          this.edit.flag = false
          this.edit.msg = '编辑'
        } else {
          this.edit.flag = true
          this.edit.msg = '取消'
        }
      },
      typeChange(type) {
        this.edit.editList = []
        this.edit.flag = false
        this.edit.msg = '编辑'
        this.defaultResponseData.lx = type.type
        if (!this.carList.length) {
          this.getCarList()
        }
      },
      loadMore(pos) {
        if (!this.loadMoreHeight.scrollBoxHeight) {
          this.loadMoreHeight.scrollBoxHeight = document.querySelector('.scroll-box').offsetHeight
        }
        if (!this.loadMoreHeight.carListBoxHeight) {
          this.loadMoreHeight.carListBoxHeight = document.querySelector('.car-list_box').offsetHeight
        }
        let currentType = this.types[this.typeActive]
        let scrollBoxHeight = this.loadMoreHeight.scrollBoxHeight
        let carListBoxHeight = this.loadMoreHeight.carListBoxHeight
        if (pos.y < scrollBoxHeight - carListBoxHeight - 60 && this.loadMoreHeight.loading < 0) {
          this.loadMoreHeight.loading = 2
          if (this.defaultResponseData.size * currentType.page >= currentType.carTotal) {
            this.loadMoreHeight.loadComplete = true
            this.loadMoreHeight.msg = '已加载全部'
            return false
          }
          currentType.page += 1
          this.getCarList(true)
        }
      },
      scrollToEnd() {
        this.loadMoreHeight.loading = -1
        this.$refs.scrollCar.refresh()
      },
      async getCarList(loadMore = false) {
        let type = this.types[this.typeActive].type
        this.defaultResponseData.page = this.types[this.typeActive].page
        let carList = await fetchOrder(this.defaultResponseData)
        if (!loadMore) {
          this.carListMap[type] = carList.data.rows
          this.types[this.typeActive].carTotal = carList.data.total
        } else {
          this.loadMoreHeight.loading = 1
          this.carListMap[type] = this.carListMap[type].concat(carList.data.rows)
        }
      },
      carDetail(id) {
        if (this.edit.flag) {
          this.selectCar(id)
        } else {
          this.$router.push({
            name: 'orderDetail',
            query: {
              id,
            },
          })
        }
        // window.location.href = 'http://testwx.chetianyi.com/car-detail/' + id
      },
    },
    components: {
      Tab,
      TabItem,
      scroll,
      noResult,
    },
  }
</script>
<style lang="less" scoped>
  .header {
    background: #FFF;
    .edit_cancel{
      margin-left: 15px;
    }
  }
  .edit_btn {
    color: #FFF;
    font-size: 15px;
    position: relative;
    top: -3px;
  }

  .content {
    margin-top: 5px;
    width: auto;
    height: auto;
    background: #FFF;
  .scroll-box {
    width: 100%;
    height: auto;
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 0;
    z-index: 2;
  }
  .delete-follow_btn{
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    height: 60px;
    padding: 10px 15px;
    box-sizing: border-box;
    background: #FFF;
    span{
      width: auto;
      height: 40px;
      line-height: 40px;
      display: block;
      background-clip: content-box;
      background: #0198E7;
      text-align: center;
      color: #FFF;
      border-radius: 3px;
      font-size: 15px;
    }
  }
  .no-result_box{
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  }
  .car-list_box {
    width: 100%;
    height: auto;
    z-index: 2;
    background: #FFF;
    .car-list_item{
      border-bottom: 5px solid #E8E8E8;
      &:last-child{
        border-bottom: none;
      }
    }
    .dept-info{
      font-size: 14px;
      color: #333;
      line-height: 40px;
      padding-left: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span.no{
        color: #999;
      }
    }
    .car-info_box {
      width: auto;
      height: 90px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 20px 15px;
      z-index: 3;
      background: #F9F9F9;
      .state{
        margin-right: 5px;
      }

      .car-thumb {
        width: 135px;
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 90px;
        }

        p {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          text-align: center;
          background: #666;
          color: #FFF;
          font-size: 12px;
          line-height: 20px;
        }
      }

      .car-info {
        flex: 1;
        padding-left: 15px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;

        p.title {
          color: #2E2E2E;
          font-family: 'PingFang-SC-Bold','SourceHanSansCN-Bold',Arial,Helvetica,sans-serif;
          font-weight: bold;
          font-size: 14px;
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span{
            position: absolute;
            display: inline-flex;
            align-items: center;
            right: 15px;
            font-size: 10px;
            line-height: 18px;
            color: #FFF;
            font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
            font-weight: normal;
            background: #999;
            padding: 0 5px;
          }
        }

        p.price {
          color: #999;
          font-size: 13px;
        }

        p.highlight {
          color: #888;

          span {
            font-size: 18px;
            display: inline-block;
            padding: 0 3px;
          }
        }
      }
    }
    .order-state{
      line-height: 40px;
      padding-left: 15px;
      color: #0198E7;
      .icon{
        vertical-align: middle;
      }
      span{
        vertical-align: -2px;
      }
    }
  }

</style>
