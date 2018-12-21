<template>
  <scroll class="listview" :data="data" ref="listview" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType">
    <ul ref="content">
      <li v-for="group in data" :key="group.id" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item vux-1px-b">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" :key="item" class="item" :data-index="index" :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>
<script>
import Scroll from '@/components/scroll'
import {
    getData,
  } from '@/util/dom.js'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 35
export default {
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
    }
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    },
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0 // |0的意思等同于  MATH.floor
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight - 2) {
        index = this.listHeight - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this._calculateHeight()
    }, 200)
  },
  watch: {
    scrollY(newY) {
      const listHeight = this.listHeight
        // 滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
        // 在中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
        // 滚动到底部，且-newY大于最后一个元素的上线
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
    },
  },
  components: {
    Scroll,
  },
}
</script>
<style scoped lang="less">
  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #FFF;

    .list-group {
      // padding-bottom: 30px;
      .list-group-title {
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        font-size: 16px;
        color: #3C4C5C;
        background: #EEE;
        -webkit-margin-before: 0;
        -webkit-margin-after:0;
      }

      .list-group-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        &:last-child::after{
          display: none;
        }
        .name {
          margin-left: 20px;
          color: #000;
          font-size: 16px;
          line-height: 25px;
        }
        .dept{
          font-size: 14px;
          color: #666;
          margin-right: 30px;
        }
      }
    }

    .list-shortcut {
      position: absolute;
      z-index: 2;
      right: 0;
      top: 53%;
      transform: translateY(-50%);
      width: 30px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
     // background: #3C4C5C;
      font-family: Helvetica;

      .item {
        padding: 4px;
        line-height: 1;
        color: #000;
        font-size: 14px;
        list-style-type: none;
        &.current {
          color: #fbc700;
        }
      }
    }

    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .fixed-title {
        height: 35px;
        line-height: 35px;
        padding-left: 20px;
        font-size: 16px;
        color: #3C4C5C;
        background: #EEE;
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

</style>
