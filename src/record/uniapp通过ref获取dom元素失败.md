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

# uniapp使用vue3的ref获取dom元素出现undefined

在小程序端通过`ref`获取不到dom元素，查阅资料发现小程序中，uniapp的`ref`要绑定在子组件中才能被获取，如果绑定在`view`，是获取不了的，需要把业务写在一个组件来引用才行。h5则没有这种情况。
可以通过uniapp中的`uni.createSelectorQuery()`，返回一个 `SelectorQuery` 对象实例。可以在这个实例上使用 `select` 等方法选择节点，并使用 `boundingClientRect` 等方法选择需要查询的信息。

```python
<view class="calc-dom"></view>
import { getCurrentInstance } from 'vue';
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
