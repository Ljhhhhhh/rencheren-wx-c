<template>
  <div class="fill-in-info plr15">
    <group class="info-input">
      <x-input @on-change="toUpperCase(plateNumber, 'plateNumber')" class="input" placeholder-align="right" text-align="right"
        placeholder="请输入车牌号" v-model="plateNumber">
        <p slot="label"><em class="add-btn-default"></em><span>车牌号码</span></p>
      </x-input>
      <x-input @on-change="toUpperCase(plateNumber, 'plateNumber')" class="input" placeholder-align="right" text-align="right"
        placeholder="请输入17位车架号">
        <p slot="label"><em class="add-btn-default"></em><span>车架号</span></p>
      </x-input>
      <x-input @on-change="toUpperCase(plateNumber, 'plateNumber')" class="input" placeholder-align="right" text-align="right"
        placeholder="AEE002">
        <p slot="label"><em class="add-btn-default"></em><span>发动机号</span></p>
      </x-input>
      <x-input class="input" placeholder-align="right" text-align="right" placeholder="1.5">
        <p slot="label"><em class="add-btn-default"></em><span>当前里程</span></p>
        <span slot="right" class="unit">万公里</span>
      </x-input>
      <datetime class="datetime" placeholder="请输入购买时间" format="YYYY-MM" :max-year="new Date().getFullYear()">
        <p slot="title"><em class="add-btn-default"></em><span>购买时间</span></p>
      </datetime>
      <x-button class="check-btn" type="primary" :mini="true" @click.native="checkinfo">确定</x-button>
    </group>
  </div>
</template>
<script>
  import {XInput, Datetime, XButton} from 'vux'
  export default {
    data() {
      return {
        plateNumber: '',
      }
    },
    methods: {
      toUpperCase(val, key) {
        this[key] = val.toLocaleUpperCase()
      },
      checkinfo() {
        this.$emit('checkinfo', this.plateNumber)
      },
    },
    components: {
      XInput,
      Datetime,
      XButton,
    },
  }
</script>
<style lang="less" scoped>
  .fill-in-info {

    .input,
    .datetime {
      span {
        display: inline-block;
        margin-left: .5rem;
        vertical-align: middle;
      }
    }

  .check-btn {
    display: block;
    width: 60px;
    height: 25px;
    margin: 10px auto 0;
    outline: none;
    border: none;
    padding: 0 .3rem;
    line-height: 25px;
    font-size: 14px;
  }
  }

</style>
