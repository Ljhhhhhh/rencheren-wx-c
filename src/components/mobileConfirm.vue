<template>
  <div class="mobile-confirm" @click.stop>
    <confirm v-model="show" title="请绑定手机号" @on-confirm="onConfirm" @on-hide="onHide" @click.stop>
      <div class="box">
        <p>
          <x-input title="手机号" v-model="phone" placeholder="请输入手机号"></x-input>
        </p>
        <p class="vux-1px-t">
          <x-input title="验证码" v-model="mycode" class="weui-vcode" placeholder="请输入验证码">
            <x-button
              slot="right"
              type="primary"
              mini
              @click.native="verifyCode"
              :disabled="codeDisabled"
              >{{btnText}}
            </x-button>
          </x-input>
        </p>
      </div>
    </confirm>
  </div>
</template>
<script>
  import {
    Confirm,
    XInput,
    XButton,
    // TransferDomDirective as TransferDom,
  } from 'vux'
  import {getVerifyCode, bindMobile} from '@/api/usercenter/phone'
  import {mapMutations, mapGetters} from 'vuex'
  import cookie from 'js-cookie'
  export default {
    // directives: {
    //   TransferDom,
    // },
    props: {
      mobileShow: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        show: false,
        phone: '',
        btnText: '获取验证码',
        code: '',
        mycode: '',
      }
    },
    watch: {
      mobileShow: function (val) {
        this.show = val
      },
    },
    computed: {
      codeDisabled() {
        let reg = (!!this.phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) && (this.btnText === '获取验证码' || this.btnText === '请重试')
        return !reg
      },
      ...mapGetters([
        'userinfo',
      ]),
    },
    methods: {
      verifyCode() {
        getVerifyCode(this.phone).then(res => {
          console.log(res)
          if (res.errno === 0) {
            this.code = res.data.code // 获取到的验证码
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
        if (this.mycode !== this.code) {
          alert('验证码错误，请重试')
          return
        }
        bindMobile(this.phone, this.mycode).then(res => {
          console.log(res)
          if (res.errno === 0 || res.errmsg === '变更手机号与原手机不能相同') {
            cookie.set('phoneNumber', this.phone)
            let data = Object.assign(this.userinfo, {
              phone: this.phone,
            })
            this.setUserinfo(data)
            this.$emit('setedPhone')
          } else {
            alert(res.errmsg)
            console.warn('绑定手机号失败，请检查')
          }
        })
      },
      onHide() {
        this.$emit('closeMobile')
      },
      ...mapMutations({
        setUserinfo: 'SET_USERINFO',
      }),
    },
    components: {
      Confirm,
      XInput,
      XButton,
    },
  }
</script>
<style lang="less" scoped>
  .box {
    width: 100%;
    height: auto;
    margin-top: 10px;
    p {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

</style>
