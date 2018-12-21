<template>
<transition name="slide">
<div class="sub container gray-bg">
  <Header :title="plateNumber"></Header>
  <div class="no-break" v-if="!breakRuleList.length">
    <img src="static/icon/assist.png">
    <p>暂无违章记录</p>
  </div>
  <div class="break-rule-list" v-else>
    <div class="item" v-for="item in breakRuleList" :key="item.id">
      <p>
        <span class="label">ID：</span>
        <span class="value">{{item.id}}</span>
      </p>
      <p>
        <span class="label">违章时间：</span>
        <span class="value">{{item.time}}</span>
      </p>
      <p>
        <span class="label">违章地点：</span>
        <span class="value">{{item.address}}</span>
      </p>
      <p>
        <span class="label">扣分：</span>
        <span class="value">{{item.point}}分</span>
      </p>
      <p>
        <span class="label">罚金：</span>
        <span class="value">{{item.rmb}}元</span>
      </p>
      <p class="reason">
        <span class="label">违章原因：</span>
        <span class="value"><em>{{item.reason}}</em></span>
      </p>
    </div>
  </div>
</div>
</transition>
</template>
<script>
export default {
  name: 'ruleInfo',
  data() {
    return {
      plateNumber: '浙G888888',
      breakRuleList: [{
        id: '3522314',
        time: '2018-06-29',
        address: '新松江路近人民北路东侧路段',
        point: 3,
        rmb: 100,
        reason: '违反规定停放、临时停车且驾驶人不在现场或驾驶人虽然在现场拒绝立即驶离，妨碍其他车辆、行人通行',
      },
      {
        id: '3522314',
        time: '2018-06-29',
        address: '新松江路近人民北路东侧路段',
        point: 3,
        rmb: 100,
        reason: '违反规定停放、临时停车且驾驶人不在现场或驾驶人虽然在现场拒绝立即驶离，妨碍其他车辆、行人通行',
      }],
    }
  },
}
</script>
<style lang="less" scoped>
  .no-break{
    margin: 15px 20px;
    border-radius: 5px;
    text-align: center;
    background: #FFF;
    padding: 15px 0;
    img{
      width: 32px;
      height: auto;
    }
    p{
      color: #666;
    }
  }
  .break-rule-list{
    position: absolute;
    top: 44px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    padding: 10px 15px;
    -webkit-overflow-scrolling: touch;
    .item{
      background: #FFF;
      border-radius: 5px;
      padding: 0 10px 5px;
      margin-bottom: 5px;
      p{
        line-height: 40px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        &:last-child::after{
          display: none;
        }
        &::after{
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 1px;
          background: #c5c5c5;
          width: 100%;
          // border-bottom: 1px solid #c5c5c5;
          transform: translateY(.5);
        }
        span.label{
          flex: 1;
          max-width: 6em;
          min-width: 6em;
          color: #111;
        }
        span.value{
          flex: 6;
          text-align: right;
          font-size: 12px;
          color: #666;
        }
        &.reason{
          margin-top: 5px;
          span.label{
            line-height: 18px;
          }
          span.value{
            line-height: 18px;
            text-align: right;
            em{
              display: inline-block;
              font-style: normal;
              text-align: left;
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
    }
  }
</style>