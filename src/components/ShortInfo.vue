<template>
  <div class="configuration-info">
    <p class="title">{{carTitle}}</p>
    <div class="short">
      <p><span>{{city}}</span><em>所在城市</em></p>
      <p><span>{{license}}</span><em>上牌日期</em></p>
      <p><span>{{mileage}}</span><em>行驶里程</em></p>
      <p><span>{{emission}}</span><em>排放标准</em></p>
    </div>
    <p class="more"><span>查看车辆全部配置</span>
      <icon name="arrow-left" class="arrow-right-gray" scale="2"></icon>
    </p>
  </div>
</template>
<script>
  export default {
    props: {
      carTitle: {
        type: String,
      },
      city: {
        type: String,
      },
      license: {
        type: String,
      },
      mileage: {
        type: Number,
      },
      emission: {
        type: String,
      },
    },
  }
</script>
<style lang="less" scoped>
  .configuration-info {
    padding: 10px 0 0;
    border-bottom: 5px solid #F2F2F2;

    .title {
      padding: 0 15px;
      font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Medium', Arial, Helvetica, sans-serif;
      font-size: 15px;
      line-height: 40px;
    }
    
    .short {
      padding: 8px 0;
      background: linear-gradient(left, transparent 5%, #F2F2F2 5%, #F2F2F2 95%, transparent 95%) no-repeat center bottom, linear-gradient(left, transparent 5%, #F2F2F2 5%, #F2F2F2 95%, transparent 95%) no-repeat center top;
      background-size: 100% 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        flex: 1;
        text-align: center;

        &+p {
          background: linear-gradient(bottom, #FFF 10%, #F2F2F2 10%, #F2F2F2 90%, #FFF 90%) no-repeat;
          background-size: 1px 100%;
        }

        span {
          display: block;
          font-family: 'PingFang-SC-Medium', 'SourceHanSansCN-Regular', Arial, Helvetica, sans-serif;
        }

        em {
          font-style: normal;
          color: #999;
        }
      }
    }

    p.more {
      text-align: center;
      color: #999;
      line-height: 40px;
      font-size: 0;

      span {
        vertical-align: middle;
        display: inline-block;
        margin-right: 2px;
      }

      .arrow-right-gray {
        vertical-align: middle;
        color: #999;
      }
    }
  }

</style>
