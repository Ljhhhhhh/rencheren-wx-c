<template>
  <!-- <div v-transfer-dom>
    <x-dialog v-model="showDialogStyle" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
      <p style="color:#fff;text-align:center;" @click="toggleShow">
        <span style="font-size:24px;">{{text}}</span>
        <br>
        <br>
        <x-icon type="ios-close-outline" style="fill:#fff;" @click.stop="toggleShow"></x-icon>
      </p>
    </x-dialog>
  </div> -->
  <div class="opac">
    <popup v-model="flag" position="top" :show-mask="false">
      <div :class="['position', typeClass]">
        {{text}}
      </div>
    </popup>
  </div>
</template>
<script>
  import {
    Popup,
  } from 'vux'

  export default {
    // props: ['text', 'showDialog'],
    props: {
      text: {
        type: String,
        default: '功能开发中……',
      },
      showDialog: {
        type: Boolean,
        default: false,
      },
      typeClass: {
        type: String,
        default: 'warn',
      },
    },
    data() {
      return {
        flag: false,
      }
    },
    // methods: {
    //   toggleShow() {
    //     this.$emit('toggleShow')
    //   },
    // },
    watch: {
      showDialog(val) {
        if (val) {
          this.flag = true
          setTimeout(() => {
            this.flag = false
            this.$emit('changeShow')
          }, 1000)
        }
      },
    },
    components: {
      Popup,
    },
  }
</script>
<style lang="less" scoped>
  .opac {
    // opacity: 0.4;
  }

  .position {
    color: #fff;
    text-align: center;
    padding: 15px;

    &.warn {
      background: #000;
    }

    &.success {
      background: #006105;
    }
    &.text{
      background: #CCC;
    }
  }

</style>
