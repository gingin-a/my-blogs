import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/my-blogs/",
  dest: './dist',
  lang: "zh-CN",
  title: "快醒醒",
  description: "快醒醒博客",

  theme

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
