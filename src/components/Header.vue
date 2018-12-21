<template>
  <div>
    <x-header :left-options="{showBack: showBack,backText:''}" :class="{gray:isgray}" class="header-title">{{title}}
      <div slot="left">
        <slot name="left"></slot>
      </div>
      <div slot="right">
        <slot name="right"></slot>
      </div>
    </x-header>
  </div>
</template>
<script>
import { XHeader } from 'vux'
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isgray: {
      type: Boolean,
      default: false,
    },
    showBack: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    XHeader,
  },
}
</script>
