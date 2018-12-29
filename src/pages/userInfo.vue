<template>
  <transition name="silde">
    <div class="sub container">
      <Header title="个人资料">
        <span slot="left">
          <router-link to="/"></router-link>
        </span>
      </Header>
      <div class="info-detail">
        <r-cell title="用户" link="/user-info">
          <span slot="value" class="value">{{userinfo.name}}</span>
        </r-cell>
        <r-cell title="头像" link="/user-info">
          <img :src="userinfo.headpho || '/usercenter/static/icon/avatar-default.png'" slot="image" class="avatar">
        </r-cell>
        <r-cell title="手机号码" link="/user-info" @click.native="setPhone">
          <span slot="value" class="value">{{userinfo.phone}}</span>
        </r-cell>
        <r-cell title="车辆信息" link="/my-car-list"></r-cell>
      </div>
      <!-- <mobile-confirm :mobileShow="mobileShow" @closeMobile="cancelMobile" @setedPhone="setPhone"></mobile-confirm> -->
    </div>
  </transition>
</template>
<script>
  import RCell from '@/components/RCell'
  // import {getUserinfo} from '@/api/usercenter/index'
  // import mobileConfirm from '@/components/mobileConfirm'
  // import cookie from 'js-cookie'
  import {mapGetters} from 'vuex'
  import cookie from 'js-cookie'

export default {
    name: 'userInfo',
    data() {
      return {
        userPhone: '',
        mobileShow: false,
      }
    },
    created() {
      // this.getUserinfo()
    },
    mounted () {
      this.$nextTick(() => {
        if (!cookie.get('token') || !cookie.get('openid')) {
          this.$router.push({
            path: '/',
          })
        }
        // if (!this.userinfo.id) {
        //   this.$router.push({
        //     path: '/',
        //   })
        // }
      })
    },
    computed: {
      ...mapGetters([
        'userinfo',
      ]),
    },
    methods: {
      cancelMobile() {
        this.mobileShow = false
      },
      // getUserinfo() {
      //   getUserinfo().then(res => {
      //     console.log('userinfo:', res)
      //     this.userInfo = res.data
      //     this.userPhone = cookie.get('user-phone')
      //   })
      // },
      setPhone() {
        this.$router.push({
          path: '/bindphone',
        })
        // let phone = this.userinfo.phone
        // if (!phone) {
        //   // this.mobileShow = true
        //   this.$router.push({
        //     path: '/bindphone',
        //   })
        // }
      },
    },
    components: {
      RCell,
      // mobileConfirm,
    },
  }
</script>
<style lang="less" scoped>
  .info-detail {
    margin-top: 30px;
    padding: 0 15px;
  }
  .value{
    display: inline-block;
    margin-right: 30px;
    color: #666;
  }
  .avatar{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 30px;
    margin: auto;
    height: 30px;
    width: auto;
    border: 1px solid #CCC;
    border-radius: 50%;
    vertical-align: middle;
  }
</style>
