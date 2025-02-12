import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  // {
  //   text: "博文",
  //   icon: "pen-to-square",
  //   prefix: "/posts/",
  //   children: [
  //     {
  //       text: "苹果",
  //       icon: "pen-to-square",
  //       prefix: "apple/",
  //       children: [
  //         { text: "苹果1", icon: "pen-to-square", link: "1" },
  //         { text: "苹果2", icon: "pen-to-square", link: "2" },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     {
  //       text: "香蕉",
  //       icon: "pen-to-square",
  //       prefix: "banana/",
  //       children: [
  //         {
  //           text: "香蕉 1",
  //           icon: "pen-to-square",
  //           link: "1",
  //         },
  //         {
  //           text: "香蕉 2",
  //           icon: "pen-to-square",
  //           link: "2",
  //         },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     { text: "樱桃", icon: "pen-to-square", link: "cherry" },
  //     { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
  //     "tomato",
  //     "strawberry",
  //   ],
  // },
  "/record/",
  // { 
  //   text:'记录',
  //   icon: "pen-to-square",
  //   prefix: "record/",
  //   children:[
  //     { text: "微信小程序跳转链接参数丢失", icon: "book", link: "微信小程序跳转链接参数丢失" },
	//   { text: "H5ios获取JSSDK签名失败", icon: "book", link: "H5ios获取JSSDK签名失败" },
  //     { text: "小程序无法渲染富文本视频", icon: "book", link: "小程序无法渲染富文本视频" },
	//   { text: "uniapp通过ref获取dom元素失败", icon: "book", link: "uniapp通过ref获取dom元素失败" },
  //   ]
  // },
    "/tool/",
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
