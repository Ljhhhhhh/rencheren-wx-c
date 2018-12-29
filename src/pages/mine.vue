<template>
  <div class="container">
    <!-- <Header :title="title" :showBack="false"></Header> -->
    <div class="userinfo">
      <div class="info-content">
        <img :src="userinfo.headpho || '/usercenter/static/icon/avatar-default.png'" class="avatar-default">
        <div class="username">
          <p>{{userinfo.name || '暂未获取用户名'}}</p>
          <!-- <img src="static/icon/ordinary-member.png" class="member-level"> -->
          <p class="phone" v-if="userinfo.phone">{{showPhone}}</p>
        </div>
      </div>
      <div @click="goUserInfo" class="info-more-btn">
        <icon name="arrow-left" scale="3" class="arrow-right"></icon>
      </div>
    </div>
    <div class="car-menu">
      <router-link to="/find-car">
        <img src="@/svg/car-evaluate.svg">
        <span>爱车估值</span>
      </router-link>
      <!-- <router-link to="/rule-search" class="second" @click.stop="designing">
        <img src="static/icon/rules-query.png">
        <span>违章查询</span>
      </router-link> -->
      <router-link class="second" to="/rule-search">
        <img src="@/svg/rules-query.svg">
        <span>违章处理</span>
      </router-link>
      <router-link to="/wash-car">
        <img src="@/svg/car-wash.svg">
        <span>免费洗车</span>
      </router-link>
    </div>
    <div class="menu-bar">
      <!-- <cell is-link title="我的VIP卡"></cell> -->
      <r-cell title="我的订单" link="/orders"></r-cell>
      <r-cell title="我的爱车" link="/my-car-list"></r-cell>
      <r-cell title="我的关注" link="/follow"></r-cell>
      <r-cell title="我的会员卡" link="/vip"></r-cell>
      <r-cell @click.native="showCostomer" title="我的客服" link="/"></r-cell>
      <!-- <r-cell @click.native="toggleShow" title="我的足迹" link="/"></r-cell> -->
      <!-- <r-cell @click.native="toggleShow" title="投诉与建议" link="/"></r-cell> -->
    </div>
    <r-toast :text="toastShow.text" :showDialog="toastShow.flag" @changeShow="toastShow.flag=false"></r-toast>
    <div v-transfer-dom>
      <x-dialog v-model="customerShow" hide-on-blur class="customer" :dialog-style="dialogStyle">
        <p class="customer-title">联系客服</p>
        <p class="customer-phone"><a href="tel:057989932632">0579-89932632</a></p>
      </x-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import RCell from '@/components/RCell'
  import {
    getCode,
    getOpenid,
    getUserinfo,
  } from '@/api/usercenter/index'
  import cookie from 'js-cookie'
  import {
    mapMutations,
    mapGetters,
  } from 'vuex'
  import { TransferDomDirective as TransferDom, XDialog } from 'vux'

  export default {
    directives: {
      TransferDom,
    },
    data() {
      return {
        title: '个人中心',
        callbackUrl: null,
        wxCode: '',
        // toggleShowFlag: true,
        toastShow: {
          flag: false,
          text: '',
        },
        customerShow: false,
        dialogStyle: {
          padding: '15px 0',
        },
      }
    },
    created() {
      if (this.$route.name === 'mine') {
        // const openid = cookie.get('openid')
        const openid = null
        if (!openid && !this.$route.query.code) {
          this.getCode(window.location.href)
        } else if (this.$route.query.code && !cookie.get('openid')) {
          this.wxLogin()
        } else {
          this.getUserinfo()
        }
      }
    },
    computed: {
      ...mapGetters([
        'userinfo',
      ]),
      showPhone() {
        return this.userinfo.phone.substr(0, 3) + '****' + this.userinfo.phone.substr(7)
      },
    },
    methods: {
      toggleShow() {
        this.toastShow.flag = true
        this.toastShow.text = '功能开发中……'
        // setTimeout(() => {
        //   this.toastShow.flag = false
        // }, 1000)
      },
      goUserInfo() {
        this.$router.push({
          path: '/user-info',
        })
      },
      getCode() {
        getCode(window.location.href).then(res => {
          console.log('step1:', res)
          this.callbackUrl = res.data.resultUrl
        }).then(() => {
          window.location.href = this.callbackUrl
        })
      },
      wxLogin() {
        const query = this.$route.query
        const code = query.code
        getOpenid(code).then(d => {
          const validity = d.data.expire / 60 / 60 / 24
          cookie.set('openid', d.data.openid)
          cookie.set('token', d.data.token, {
            expires: validity,
          })
        }).then(() => {
          this.getUserinfo()
        }).catch((err) => {
          console.error(err)
        })
      },
      getUserinfo() {
        getUserinfo(cookie.get('token')).then(res => {
          console.log('getuserinfo:', res)
          // this.userinfo = res.data
          this.setUserinfo(res.data)
          // if (res.errno === 1) {
          //   this.getCode()
          // }
        })
      },
      showCostomer() {
        console.log(123)
        this.customerShow = true
      },
      ...mapMutations({
        setUserinfo: 'SET_USERINFO',
      }),
    },
    components: {
      RCell,
      XDialog,
    },
  }
</script>
<style lang="less" scoped>
  .userinfo {
    margin-top: -1px;
    box-sizing: border-box;
    background: #FFCC66;
    height: 165px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 45px 15px 45px 40px;
    overflow: hidden;

    .info-content {
      flex: 6;

      .avatar-default {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 15px;
      }

      .username {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        vertical-align: middle;

        p,
        img {
          flex: 1;
        }

        p {
          font-size: 18px;
          color: #FFF;
          font-family: "PingFang-SC-Bold", Arial, Helvetica, sans-serif;
          line-height: 15px;
          margin-bottom: 10px;
        }
        p.phone{
          font-size: 14px;
          margin-top: 10px;
          color: #ffffff;
        }

        img {
          width: 75px;
          height: auto;
        }
      }
    }

    .info-more-btn {
      flex: 1;
      text-align: right;
      padding: 15px;

      img {
        width: 15px;
        height: auto;
      }
    }
  }

  .car-menu {
    border: 5px solid #F2F2F2;
    padding: 15px 10px;
    border-right: none;
    border-left: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    line-height: 0;

    a {
      flex: 1;
      color: #111;

      &:active,
      &:hover {
        color: #111;
      }

      &+a {
        position: relative;

        &::after {
          content: '';
          display: block;
          width: 1px;
          height: 50px;
          background: linear-gradient(bottom, #f2f2f2 75%, #FFF 75%) repeat-y;
          background-size: 1px 10px;
          left: 0;
          top: 50%;
          position: absolute;
          transform: translateY(-50%);
        }
      }

      &:first-child img {
        transform: translateY(4px);
      }

      &.second img {
        position: relative;
      }

      &.second span {
        position: relative;
        // top: 3px;
        // right: 2px;
      }

      &:last-child img {
        position: relative;
        top: 3px;
      }

      img {
        display: block;
        width: 45px;
        height: auto;
        margin: 0 auto;
      }

      span {
        text-align: center;
        line-height: 30px;
        font-size: 12px;
      }
    }
  }

  .menu-bar {
    padding: 0 15px;
  }
  .customer{
    p.customer-title{
      font-size: 18px;
    }
    p.customer-phone{
      a{
        font-size: 16px;
        color: #0198E7;
      }
    }
  }

</style>
