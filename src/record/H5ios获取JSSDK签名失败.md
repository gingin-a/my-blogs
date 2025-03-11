---
date: 2025-01-01
category:
  - vue
  - uniapp
tag:
  - vue
  - 微信
  - uniapp
---

# vue history 路由模式下 ios 微信调用微信 JSSDK 相关 API 报签名错误，二次刷新后成功

因为 ios 在微信中浏览器机制和 android 不同，有 ios 缓存问题，和 ios 对单页面的优化。
Android 在页面进行跳转时会刷新当前的 URL，而 ios 不会刷新当前的 URL，ios 是通过历史记录进来的不会刷新 URL.
例如从 A 页面(http://xxx.com/A) 跳转到 B 页面(http://xxx.com/B)后，由于ios都是操作的浏览器历史记录，所以ios端微信浏览器锁定的URL的还是A页面的URL。
所以 ios 微信浏览器在验证微信 jssdk 签名时,需要的 URL 还是第一次进入该应用时的 URL, 并不是当前页面的 URL
解决方法：在 App.vue 中存下 ios 端第一次进入该应用的 URL，使用时候判断是不是 ios，

```js
	onLaunch: async function (option) {
	// #ifdef H5
	uni.getSystemInfo({
		success: (res) => {
			if (res.platform === 'ios') {
				uni.setStorageSync('SDKUrl', window.location.href);
			}
		}
	});
	// #endif
	}
```

```js
// #ifndef H5
let url = ref();
// #endif
// #ifdef H5
let url = ref(window.location.href);
// #endif

export function getOutSignApi() {
  // #ifdef H5
  uni.getSystemInfo({
    success: (res) => {
      if (res.platform === "ios") {
        url.value = uni.getStorageSync("SDKUrl");
      }
    },
  });
  // #endif
  return http({
    url: `/wechatPay/getOutSign?url=${url.value}`,
    method: "GET",
  });
}
```
