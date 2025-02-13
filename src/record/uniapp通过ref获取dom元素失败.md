---
icon: book
date: 2025-01-25
category:
  - uniapp
  - vue
tag:
  - vue
  - 微信小程序
---

# uniapp 使用 vue3 的 ref 获取 dom 元素出现 undefined

在小程序端通过`ref`获取不到 dom 元素，查阅资料发现小程序中，uniapp 的`ref`要绑定在子组件中才能被获取，如果绑定在`view`，是获取不了的，需要把业务写在一个组件来引用才行。h5 则没有这种情况。
可以通过 uniapp 中的`uni.createSelectorQuery()`，返回一个 `SelectorQuery` 对象实例。可以在这个实例上使用 `select` 等方法选择节点，并使用 `boundingClientRect` 等方法选择需要查询的信息。

```js
<view class="calc-dom"></view>;
import { getCurrentInstance } from "vue";
const instance = getCurrentInstance();

const query = uni.createSelectorQuery().in(instance.proxy);
query
  .select(".calc-dom")
  .boundingClientRect((data) => {
    console.log("得到布局位置信息" + JSON.stringify(data));
    console.log("节点离页面顶部的距离为" + data.top);
  })
  .exec();
```
