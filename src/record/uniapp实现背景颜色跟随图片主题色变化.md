---
date: 2025-03-11
category:
  - uniapp
tag:
  - uniapp
---

# uniapp 实现背景颜色跟随图片主题色变化

1.获取图片主题色

2.设置从上到下的主题色 to 白色的渐变：

background: linear-gradient(to bottom, 主题色， 白色)
效果图![效果图](./img/uniapp实现背景颜色跟随图片主题色变化.png)

### 页面结构

```vue
<template>
  <view class="index">
    <!-- 由于获取主题色需要canvas绘制。绝对定位，把canvas移除屏幕外绘制 -->
    <canvas
      canvas-id="canvas"
      style="position: absolute;left: -400px;"
    ></canvas>
    <!-- box：填充主题颜色容器 -->
    <view class="box" :style="[getStyle]">
      <!-- 其他内容 -->
      <view class="tabs"></view>
      <!-- 轮播图 -->
      <swiper
        class="swiper"
        :current="current"
        circular
        autoplay
        indicator-dots
        @change="onChange"
        :interval="3000"
      >
        <swiper-item class="swiper-item" v-for="(url, i) in list" :key="i">
          <image :src="url" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { getImageThemeColor } from "@/utils/getImageThemeColor";
const list = ref([]);
const current = ref(0);
const colors = ref([]);
const count = ref(0);

const getStyle = computed(() => {
  const color = colors.value[current.value];
  return {
    background: color
      ? `linear-gradient(to bottom, rgb(${color}), #fff)`
      : "#fff",
  };
});
const onChange = (e) => {
  current.value = e.detail.current;
};

const getList = () => {
  list.value = [
    "https://img.zcool.cn/community/010ff956cc53d86ac7252ce64c31ff.jpg",
    "https://img.zcool.cn/community/017fc25ee25221a801215aa050fab5.jpg",
    "https://img.zcool.cn/community/0121e65c3d83bda8012090dbb6566c.jpg",
  ];
};

const getThemColor = () => {
  getImageThemeColor(this, list.value[count.value], "canvas", (color) => {
    const colorsArray = [...colors.value];
    colorsArray[count.value] = color;
    colors.value = colorsArray;
    count.value++;
    if (count.value < list.value.length) {
      getThemColor();
    }
  });
};

onMounted(() => {
  getList();
  // banner图片请求完成后，获取主题色
  getThemColor();
});
</script>

<style>
.box {
  display: flex;
  flex-direction: column;
  background-color: deeppink;
  padding: 10px;
}

.tabs {
  height: 100px;
  color: #fff;
}

.swiper {
  width: 95%;
  height: 200px;
  margin: auto;
  border-radius: 10px;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
}
</style>
```

### 封装获取图片主题颜色函数

通过 canvas 绘图，获取图片的主题颜色。
先通过 request 请求图片地址，获取图片的二进制数据，再将图片资源其转换成 base64，调用 drawImage 进行绘图，最后调用 draw 方法绘制到画布上。

通过对图片中所有像素点的颜色进行平均来计算主题色 1.遍历图片的每个像素点，获取其 RGB 颜色值。 2.将所有像素点的 R、G、B 分量分别求和，并除以像素点的总数，得到平均的 R、G、B 值。 3.最终的主题色即为平均的 R、G、B 值。

```js
/**
 * 获取图片主题颜色
 * @param path 图片的路径
 * @param canvasId 画布id
 * @param success 获取图片颜色成功回调，主题色的RGB颜色值
 * @param fail 获取图片颜色失败回调
 */
export const getImageThemeColor = (
  that,
  path,
  canvasId,
  success = () => {},
  fail = () => {}
) => {
  // 获取图片后缀名
  const suffix = path.split(".").slice(-1)[0];
  // uni.getImageInfo({
  //   src: path,
  //   success: (e) => {
  //     console.log(e.path) // 在安卓app端，不管src路径怎样变化，path路径始终为第一次调用的图片路径
  //   }
  // })
  // 由于getImageInfo存在问题，所以改用base64
  uni.request({
    url: path,
    responseType: "arraybuffer",
    success: (res) => {
      let base64 = uni.arrayBufferToBase64(res.data);
      const img = {
        path: `data:image/${suffix};base64,${base64}`,
      };
      // 创建canvas对象
      const ctx = uni.createCanvasContext(canvasId, that);

      // 图片绘制尺寸
      const imgWidth = 300;
      const imgHeight = 150;

      ctx.drawImage(img.path, 0, 0, imgWidth, imgHeight);

      ctx.save();
      ctx.draw(true, () => {
        uni.canvasGetImageData(
          {
            canvasId: canvasId,
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
            fail: fail,
            success(res) {
              let data = res.data;
              let r = 1,
                g = 1,
                b = 1;
              // 获取所有像素的累加值
              for (let row = 0; row < imgHeight; row++) {
                for (let col = 0; col < imgWidth; col++) {
                  if (row == 0) {
                    r += data[imgWidth * row + col];
                    g += data[imgWidth * row + col + 1];
                    b += data[imgWidth * row + col + 2];
                  } else {
                    r += data[(imgWidth * row + col) * 4];
                    g += data[(imgWidth * row + col) * 4 + 1];
                    b += data[(imgWidth * row + col) * 4 + 2];
                  }
                }
              }
              // 求rgb平均值
              r /= imgWidth * imgHeight;
              g /= imgWidth * imgHeight;
              b /= imgWidth * imgHeight;
              // 四舍五入
              r = Math.round(r);
              g = Math.round(g);
              b = Math.round(b);
              success([r, g, b].join(","));
            },
          },
          that
        );
      });
    },
  });
};
```
