<template>
  <div class="container">
    <Header title="我的会员卡">
      <span slot="left">
        <router-link to="/"></router-link>
      </span>
    </Header>
    <div class="content">
      <div class="vips">
        <div class="vip" :class="{active: vip.no === activeNo}" v-for="vip in vipCard" :key="vip.no" @click="detail(vip.no)">
          <div class="detail">
            <p class="title">{{vip.cardName}}</p>
            <div class="item" v-for="(d, index) in vip.details" :key="index">
              <span class="item-p">{{d.title}}</span>
              <p><span>总次数：{{d.qty}}次</span><span>已用：{{d.use}}次</span></p>
            </div>
          </div>
          <!-- 加入会员卡编号 -->
          <div class="thumb">
            <p class="no"><span>No:{{vip.no}}</span><span>有效期至：{{vip.endTime}}</span></p>
            <img :src="vip.picSrc">
            <p class="validity" v-if="vip.over">已失效</p>
          </div>
        </div>
      </div>
      <div class="no-result" v-if="!vipCard.length">
        <img src="~static/images/vip/no-result.png">
        <p>您还未开通任何VIP</p>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    getVip,
  } from '@/api/usercenter'
  import { formatTime } from '@/util/dom'

  export default {
    name: 'Vip',
    data() {
      return {
        activeNo: '',
        vipCard: [],
        vipCardMap: {
          '测试会员卡19.9': '/usercenter/static/images/vip/vip0.png?v=1',
          '19.9体验会员卡': '/usercenter/static/images/vip/vip0.png?v=1',
          'VIP会员卡': '/usercenter/static/images/vip/vip1.png?v=1',
          '金卡会员卡': '/usercenter/static/images/vip/vip2.png?v=1',
          '钻石会员卡': '/usercenter/static/images/vip/vip3.png?v=1',
          '至尊会员卡': '/usercenter/static/images/vip/vip4.png?v=1',
        },
      }
    },
    created() {
      this.myVip()
    },
    methods: {
      detail(no) {
        if (no === this.activeNo) {
          this.activeNo = ''
        } else {
          this.activeNo = no
        }
      },
      myVip() {
        getVip().then(res => {
          console.log(res)
          let vipArr = []
          res.data.rows.forEach(v => {
            v.picSrc = this.vipCardMap[v.cardName]
            v.endTime = formatTime(v.expireTime)
            v.over = v.expireTime < Date.now()
            vipArr.push(v)
          })
          this.vipCard = vipArr
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .content {
    width: 100%;
    height: auto;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .vips {
    width: 100%;
    height: auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .vip {
      margin: 20px auto;
      width: 100%;
      height: auto;
      position: relative;
      transform: perspective(500px);
      transition: all 0.5s;
      overflow: hidden;
      .thumb {
        transition: all 0.5s;
        backface-visibility:hidden;
        overflow: hidden;
        img {
          width: 100%;
          height: auto;
          border-radius: 5px;
        }

        p.validity {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 24px;
          line-height: 28px;
          height: 28px;
          display: inline-block;
          padding: 5px 15px;
          color: #333;
          border: 2px solid currentColor;
          border-radius: 5px;
          opacity: 0.6;
        }
        p.no{
          position: absolute;
          bottom: 15px;
          left: 0;
          font-size: 14px;
          color: #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0 15px;
          box-sizing: border-box;
        }
      }
      .detail{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: auto;
        height: auto;
        transform: rotateY(180deg);
        transition: all 0.5s;
        backface-visibility:hidden;
        background: #0198E7;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 15px;
        .title{
          font-size: 18px;
          color: #FFF;
          text-align: center;
          margin-bottom: 10px;
        }
        .item{
          color: #fff;
          margin-bottom: 15px;
          .item-p{
            font-size: 16px;
          }
          p{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span{
              display: inline-block;
              margin-right: 15px;
            }
          }
        }
      }
      &.active{
        z-index: 3;
        .detail{
          transform: rotateY(0deg);
          overflow: auto;
        }
        .thumb{
          transform: rotateY(180deg);
        }
      }
    }
  }

  .no-result {
    margin: 0 auto;
    text-align: center;
    color: #999;
    font-size: 15px;

    img {
      max-width: 60%;
    }
  }

</style>
