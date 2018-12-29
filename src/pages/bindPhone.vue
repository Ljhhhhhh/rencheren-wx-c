<template>
  <div class="container">
    <Header title="绑定手机"></Header>
    <group class="info-input">
      <x-input title="手机号" v-model="phone" placeholder="请输入手机号" keyboard="number" is-type="china-mobile"></x-input>
      <x-input title="验证码" v-model="code" class="weui-vcode" placeholder="请输入验证码">
        <span slot="right" class="verify-btn" :class="{disabled:codeDisabled}" @click="verifyCode">{{btnText}}
        </span>
      </x-input>
      <x-input v-if="!userinfo.phone" title="推荐人号码" v-model="referee" placeholder="推荐人号码"></x-input>
    </group>
    <div class="submit" @click="onConfirm">提交</div>
    <r-toast :text="toastShow.text" :showDialog="toastShow.flag" :typeClass="toastShow.typeClass"  @changeShow="toastShow.flag=false"></r-toast>
  </div>
</template>
<script>
  import Header from '@/components/Header'
  import {getVerifyCode, bindMobile} from '@/api/usercenter/phone'
  import {mapMutations, mapGetters} from 'vuex'
  import cookie from 'js-cookie'
  import {
    XInput,
  } from 'vux'

  export default {
    name: 'bindPhone',
    data() {
      return {
        phone: '',
        code: '',
        resCode: '',
        referee: '', // 推荐人
        btnText: '获取验证码',
        toastShow: {
          flag: false,
          text: '',
          typeClass: 'text',
        },
      }
    },
    computed: {
      codeDisabled() {
        let reg = (!!this.phone.match(/^1[3456789]\d{9}$/)) && (this.btnText === '获取验证码' || this.btnText === '请重试')
        return !reg
      },
      ...mapGetters([
        'userinfo',
      ]),
    },
    methods: {
      verifyCode() {
        if (this.codeDisabled) {
          return
        }
        getVerifyCode(this.phone).then(res => {
          console.log(res)
          if (res.errno === 0) {
            this.resCode = res.data.code // 获取到的验证码
            let sec = 60 // 等待时长后可以再次请求
            this.btnText = `${sec}S`
            let timer = setInterval(() => {
              sec = sec - 1
              if (sec <= 0) {
                this.btnText = '获取验证码'
                clearInterval(timer)
              } else {
                this.btnText = `${sec}S`
              }
            }, 1000)
          } else {
            this.btnText = '请重试'
          }
        })
      },
      onConfirm() {
        if (!this.code || this.resCode !== this.code) {
          this.toastShow.text = '验证码错误'
          this.toastShow.flag = !this.toastShow.flag
          return
        }
        bindMobile(this.phone, this.code, this.referee).then(res => {
          console.log(res)
          if (res.errno === 0) {
            cookie.set('phoneNumber', this.phone)
            let data = Object.assign(this.userinfo, {
              phone: this.phone,
            })
            this.setUserinfo(data)
            this.$router.back()
          } else {
            this.toastShow.text = res.errmsg
            this.toastShow.flag = !this.toastShow.flag
            console.warn('绑定手机号失败，请检查')
          }
        })
      },
      ...mapMutations({
        setUserinfo: 'SET_USERINFO',
      }),
    },
    components: {
      Header,
      XInput,
    },
  }
</script>
<style lang="less" scoped>
  .verify-btn{
    display: inline-block;
    width: auto;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    background: #FFCC66;
    color: #FFF;
    border-radius: 3px;
    &.disabled{
      background: #CCC;
    }
  }
  .info-input{
    border: 1px solid #f2f2f2;
  }
  .submit {
      background: #FFCC66;
      color: #FFF;
      display: block;
      width: 80%;
      height: 40px;
      margin: 20px auto 0;
      outline: none;
      border: none;
      padding: 0 1rem;
      box-sizing: border-box;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
    }
</style>
