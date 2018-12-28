<template>
  <div class="container sub gray-bg ">
    <Header title="订单详情" style="background:#fff"></Header>
    <div class="content">
      <div class="car-info" @click="carDetail">
        <div class="thumb"><img :src="carInfo.thumb"></div>
        <div class="car-desc">
          <p class="title">{{carInfo.name}}</p>
          <p class="mode">{{carInfo.mode}}</p>
        </div>
        <div class="show-more" v-if="!this.type">
          <icon name="arrow-left" class="arrow-right-black" scale="2.5"></icon>
        </div>
      </div>
      <div class="state-info" v-if="stateInfo.icon">
        <p class="state-desc vux-1px-b" :style="{color:stateInfo.color}">
          <icon :name="stateInfo.icon" :scale="2" class="icon"></icon>
          <span>{{stateInfo.msg}}</span>
        </p>
        <p class="popup">{{stateInfo.popup}}</p>
        <div class="customer" v-if="serverInfo">
          <div class="infos">
            <div class="avatar"><img :src="serverInfo.headpro"></div>
            <div class="info">
              <div class="name">{{serverInfo.username}}</div>
              <div class="postion">金牌顾问</div>
            </div>
          </div>
          <div class="phone">{{serverInfo.mobile}}</div>
        </div>
      </div>
      <div class="dept-info">
        <div class="title vux-1px-b">门店信息</div>
        <p class="dept-name">{{deptInfo.name}}</p>
        <p class="dept-address">{{deptInfo.addr}}</p>
        <p class="dept-time"><span>营业时间：</span>{{deptInfo.time}}</p>
        <p class="dept-tel">
          <span>服务热线：</span>
          <span v-if="deptInfo.tel">
            <a :href="'tel:' + deptInfo.tel">{{deptInfo.tel}}</a>
          </span>
          <span v-if="deptInfo.phone">
            <a :href="'tel:' + deptInfo.phone">{{deptInfo.phone}}</a>
          </span>
        </p>
        <!-- <div class="icon"><i></i></div> -->
      </div>
    </div>
  </div>
</template>
<script>
  import {
    orderDetail,
  } from '@/api/mycar/order'
  import {washStateMap, stateMsgMap} from '@/config/index'
  export default {
    name: 'orderDetail',
    data() {
      return {
        stateMsgMap,
        washStateMap,
        id: null,
        type: '',
        carInfo: {},
        stateInfo: {},
        deptInfo: {},
        serverInfo: {},
      }
    },
    created() {
      if (!this.$route.query || !this.$route.query.id) {
        this.$router.push({
          name: 'Orders',
        })
        return
      }
      this.getDetail()
    },
    methods: {
      carDetail() {
        if (this.type !== 'card') {
          window.location.href = 'http://testwx.chetianyi.com/car-detail/' + this.carInfo.carId
        }
      },
      getDetail() {
        this.id = this.$route.query.id
        this.type = this.$route.query.type
        orderDetail(this.id).then(res => {
          console.log(res)
          let data = res.data
          this.carInfo = {
            name: data.title,
            mode: data.subTitle,
            thumb: data.thumb,
            carId: data.productId,
          }
          this.stateInfo = this.stateMsgMap['' + data.status]
          if (this.type === 'card') {
            this.stateInfo = this.washStateMap['' + data.status]
          }
          this.serverInfo = data.server
          if (this.serverInfo) {
            this.serverInfo.headpro = this.serverInfo.headpro ? this.serverInfo.headpro : 'http://thirdwx.qlogo.cn/mmopen/3jiaYjme3ZEjLwZoTq82FKZRkD2XjxEl2hBOPGDsSZt6RHoPic0U0y4DM3iaZmibMlPpMARheIYY9g1qibXkZuibxfjMrzicZ0nOjVn/132'
          }
          this.deptInfo = {
            addr: data.dept.addr,
            time: data.dept.licenseTimes,
            tel: data.dept.tel,
            phone: data.dept.phone,
            name: data.dept.name,
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  @rent_sprit: url('~static/icon/rent-css_sprites.png') no-repeat;
  .content {
    width: 100%;
    height: auto;
    margin-top: 5px;

    .car-info {
      width: 100%;
      width: auto;
      height: 90px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 20px 15px;
      z-index: 3;
      background: #FFF;

      .thumb {
        width: 135px;
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 90px;
        }
      }

      .car-desc {
        flex: 1;
        padding-left: 15px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        position: relative;

        p.title ,p.mode{
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
        p.title{
          margin-bottom: 10px;
        }
      }
    }
    .state-info{
      width: auto;
      height: auto;
      padding: 0 15px 15px;
      margin: 20px 15px;
      border-radius: 3px;
      background: #FFF;
      .state-desc{
        font-size: 15px;
        line-height: 40px;
        .icon{
          vertical-align: middle;
        }
        span{
          vertical-align: middle;
        }
      }
      .popup{
        color: #999;
        font-size: 13px;
        line-height: 1.4em;
        margin: 15px 0 0;
      }
      .customer{
        width: auto;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .infos{
          display: flex;
          justify-content: center;
          align-items: center;
          .avatar{
            width: 40px;
            height: auto;
            margin-right: 5px;
            position: relative;
            img{
              width: 100%;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .info{
              color: #333;
              font-size: 13px;
              line-height: 1.5em;
              .postion{
                color: #666;
              }
            }
        }
        .phone{
          font-size: 13px;
          color: #333;
        }
      }
    }
    .dept-info{
      width: auto;
      height: auto;
      padding: 0 15px 15px;
      margin: 20px 15px;
      border-radius: 3px;
      background: #FFF;
      position: relative;
      .title{
        font-size: 15px;
        font-family: 'PingFang-SC-Bold','SourceHanSansCN-Bold',Arial,Helvetica,sans-serif;
        font-weight: bold;
        color: #333;
        line-height: 50px;
        margin-bottom: 10px;
      }
      .dept-name{
        font-size: 13px;
        color: #333;
        line-height: 30px;
      }
      .dept-address, .dept-time, .dept-tel{
        color: #666;
        font-size: 13px;
        line-height: 23px;
        a{
          color: #0198e7;
          padding-right: rem(10);
        }
      }
      .icon {
        position: absolute;
        right: 15px;
        bottom: 15px;
        width: 30px;
        height: auto;

        i {
          display: block;
          width: 30px;
          height: 30px;
          background: @rent_sprit;
          background-size: 180px 34px;
          background-position: -148px -2px;
        }
      }
    }
  }

</style>
