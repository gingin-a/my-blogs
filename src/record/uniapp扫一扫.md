---
date: 2025-02-25
category:
  - uniapp
---

# uniapp扫一扫

```js
// #ifdef H5
import jweixin from "weixin-js-sdk";
// #endif
import {
	http
}
from "/common/request";
import {
	ref
}
from "vue";

// #ifndef H5
let url = ref()
// #endif
// #ifdef H5
let url = ref(window.location.href)
// #endif

export function getOutSignApi(data) {
	// #ifdef H5
	uni.getSystemInfo({
		success: (res) => {
			// 此处区别是因为ios端H5微信浏览器在验证微信 jssdk 签名时,需要的 URL 还是第一次进入该应用时的 URL, 并不是当前页面的 URL
			if (res.platform === 'ios') {
				url.value = uni.getStorageSync('SDKUrl')
			}
		}
	});
	// #endif
	return http({
		url: `/wechatPay/getOutSign?url=${url.value}`,
		method: 'GET'
	})
}
/* 微信公众号，开启跳转小程序组件 结束 */

export function requestAndroidPermission(permissionID) {
	return new Promise((resolve, reject) => {
		plus.android.requestPermissions(
			["android.permission.CAMERA"], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
			function(resultObj) {
				let result;
				console.log("申请权限结果：", resultObj);
				for (var i = 0; i < resultObj.granted.length; i++) {
					var grantedPermission = resultObj.granted[i];
					result = 1;
					console.log("已获取的权限：" + result);
				}
				for (var i = 0; i < resultObj.deniedPresent.length; i++) {
					var deniedPresentPermission = resultObj.deniedPresent[i];
					console.log("拒绝本次申请的权限：" + result);
					result = 0;
				}
				for (var i = 0; i < resultObj.deniedAlways.length; i++) {
					var deniedAlwaysPermission = resultObj.deniedAlways[i];
					console.log("永久拒绝申请的权限：" + result);
					result = -1;
				}
				resolve(result);
				// 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
			},
			function(error) {
				console.log("申请权限错误：" + error.code + " = " + error.message);
				resolve({
					code: error.code,
					message: error.message,
				});
			}
		);
	});
}

export async function scanCode(permissionID) {
	try {

		//#ifdef APP-PLUS
		const systemInfo = uni.getSystemInfoSync();
		const isIOS = systemInfo.platform === 'ios';
		let checkResult = 1
		if (isIOS) {
			 checkResult = 1
			console.log("当前设备是 iOS 系统");
		} else {
			 checkResult = await requestAndroidPermission(permissionID);
		}
		//#endif
		//#ifndef APP-PLUS
		let checkResult = 1
		//#endif
		if (checkResult && checkResult == 1) {
			let result = checkResult;
			if (result == 1) {
				console.log("授权成功!");
				// #ifndef H5
				uni.scanCode({
					scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
					success: (res) => {
						// TODO 扫码获取信息，返回的数据
						console.log(res);
						goToTarget(res.result)

					},
					fail: (res) => {
						console.log(res);
					},
				});
				//  #endif
				// #ifdef H5
				getOutSignApi().then(res => {
					jweixin.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: res?.data?.appid, // 必填，公众号的唯一标识
						timestamp: res?.data?.timestamp, // 必填，生成签名的时间戳
						nonceStr: res?.data?.noncestr, // 必填，生成签名的随机串
						signature: res?.data?.sign, // 必填，签名
						jsApiList: ['checkJsApi', 'scanQRCode'], // 必填，需要使用的JS接口列表
					});

					jweixin.ready(function() {
						jweixin.scanQRCode({
							needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
							scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
							success: function(res) {
								// TODO 扫码获取信息，返回的数据
								var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
							},
						});
					});
					jweixin.error(function(err) {
						alert("出错了：" + JSON.stringify(err));
					});
				})
				// #endif
			}
			if (result == 0) {
				console.log("授权已拒绝!");
			}
			if (result == -1) {
				console.log("您已永久拒绝定位权限，请在应用设置中手动打开!");
				uni.showModal({
					title: "提示",
					content: "当前页面需要定位权限，用于获取距离您最近的站点信息，以方便为您服务，请前往应用设置，打开定位服务",
					success: ({
						confirm,
						cancel
					}) => {},
				});
			}
		}
	} catch (err) {
		console.log("授权失败：", err);
	}
}
```