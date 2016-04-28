title: 运行时性能分析
date: 2016-04-27 13:55:59
tags: [tool, devtool]
categories: [devtool]
author: 赵鹏
---

> 原文：[https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/analyze-runtime?hl=en](https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/analyze-runtime?hl=en) 需翻墙
> 作者：Kayce Basques(Technical Writer at Google), Meggin Kearney(Meggin is a Tech Writer)

## 运行时性能
为了确保你的网站在任何设备上看起来很好且运行流畅。可以在浏览器渲染页面元素的时候，使用工具来识别和解决一些常见问题。

### 运行时性能分析
用户期待页面可以交互，并且流畅。像素管道的每个阶段都是一个很好的机会来说明jank现象。 学习工具和策略来定位和解决那些降低运行时性能的常见问题。


### JavaScript
JavaScript的计算，尤其是那些触发大量视觉变化的，可能拖慢应用性能。不要让不良定时程序或长时间运行的JavaScript干扰到用户交互。

#### 工具

创建一个Timeline记录，寻找可疑的长时的Evaluate Script(计算脚本)事件。如果找到了，启用JS Profiler功能，重新记录一次来得到更多关于哪些JS函数被调用和每个阶段消耗时长的细节。

如果在你的JavaScript中发现了很多jank现象，你可能需要更高层级的分析，收集一个JavaScript CPU profile。CPU profiles展示了页面上函数执行所花费的时间。在Speed Up JavaScript Execution(本系列的第二篇文章)学习如何创建CPU profiles。

#### 问题
下面表格描述了一些常见的JavaScript问题和可能的解决方案：

| 问题 | 例子 | 解决方案 |
| :----| :----| :--------|
| 昂贵的输入处理影响响应和动画 | 触摸，视觉滚动 | 让浏览器处理触摸和滚动，或者尽可能晚的绑定监听(see [Expensive Input Handlers in Paul Lewis' runtime performance checklist](http://calendar.perfplanet.com/2013/the-runtime-performance-checklist/)) |
| 不良的定时JavaScript程序影响响应、动画和加载 | 用户在页面加载后滚动，通过setTimeout/setInterval实现动画 | [优化JavaScript执行](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution) 使用requestAnimationFrame，在框架之上展开DOM操作，使用Web Worker|
| 长时间运行的JavaScript影响响应 | 在繁忙的js运行工作时，[DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)事件停止。| 将纯计算的工作移到web workers中，如果需要访问DOM，使用requestAnimationFrame([优化JavaScript执行](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution)) |
| garbage-y的脚本影响响应和动画 | 垃圾回收发生在任何地方 | 少些garbage-y的脚本 ([Garbage Collection in Animation in Paul Lewis' runtime performance checklist](http://calendar.perfplanet.com/2013/the-runtime-performance-checklist/)) |

### 样式
样式的变化代价很高，尤其是那些不止影响一个元素的DOM的变化。一旦你将样式应用到元素上，浏览器就会算出所有与之相关元素，重新计算它们的布局并且重绘页面。

相关指导
+ [降低样式计算的范围和复杂度
](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)

#### 工具
创建一个Timeline记录，查看大块的Recalculate Style(重计算样式)事件记录(紫色显示)。

点击一个 Recalculate Style(重计算样式)的事件，在详细面板中观察它的更多信息。如果这个样式变化花了很长时间，那么这就是一个影响性能的关键点。如果样式计算会影响大量元素，那么它也是一个有待改进的地方。

![重计算样式](recalculate-style.png)

减少 Recalculate Style (重计算样式)的影响
1. 使用[CSS Triggers](https://csstriggers.com/) 来学习哪些CSS属性分别会触发布局、重绘或者合成。这些属性在渲染性能上影响很严重。
2. 转到改变影响较少的属性上。看这个指导 [优先使用渲染层合并属性、控制层数量
](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)

#### 问题
下面表格描述了一些常见的样式问题和可能的解决方案：

| 问题 | 例子 | 解决方案 |
| :----| :----| :--------|
| 昂贵的样式计算影响响应和动画 | 任何改变元素几何结构的CSS属性，像width, height, 或者 position。浏览器就必须检查其他所有元素来重做布局。|[避免大规模、复杂的布局](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)|
| 复杂的选择器影响响应和动画 | 嵌套的选择器迫使浏览器要知道所有其他的元素情况，包括父元素和子元素。 |[降低样式计算的范围和复杂度](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)|

### 布局
布局(或Firefox中的回流)是指浏览器计算页面上所有元素的位置和大小的过程。网页的布局模型意味着一个元素可以影响其他元素。例如，<body>元素的width往往会影响其子元素的宽度，同理，整棵树自上而下都存在。这个过程对于浏览器是相当复杂的。

一般经验来说，如果你在一个frame完成之前请求其DOM中的几何值，你会意识到这是一个"forced synchronous layouts"(强制同步布局)，如果在一棵大的DOM树中频繁的重复执行这将是个很大的性能瓶颈。

相关指导
+ [避免大规模、复杂的布局](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)
+ [诊断强制同步布局](https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/forced-synchronous-layouts)  ([本系列的第三篇文章](http://sinaad.github.io/xfe/2016/04/27/diagnose-forced-synchronous-layouts/))

#### 工具
当一个页面发生强制同步布局时，chrome开发工具Timeline 会识别出来。这些布局事件被用红色条来标注。

![强制同步布局](forced-synchronous-layout.png)

"Layout thrashing"是一个重复强制同步布局的条件，它发生在JavaScript反复读写DOM，迫使浏览器一遍又一遍的的重计算布局的时候。为了定位layout thrashing，请查看强制同步布局的警告。(如上截图)

#### 问题
下面表格描述了一些常见的布局问题和可能的解决方案：

| 问题 | 例子 | 解决方案 |
| :----| :----| :--------|
|强制同步布局影响响应和动画 |迫使浏览器在像素管道中过早的执行布局，在渲染过程中导致重复步骤。|分批处理样式，先读后写。[避免大规模、复杂的布局](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)|
|Layout thrashing影响响应和动画|让浏览器进入一个read-write-read-write的循环周期中，迫使浏览器一遍又一遍的的重计算。|使用FastDOM库，自动批量处理读写操作。[FastDOM库](https://github.com/wilsonpage/fastdom)|

### 绘制和组合
绘制是像素填充的过程。它通常是渲染过程中最消耗性能的部分。如果你注意到页面出现jank情况，很可能就是绘制问题。

合成就是将页面上画好的部分放到一起在屏幕上展现。大多数情况，如果坚持仅合成属性和避免完全绘制，将会对性能上有个重要的提升，但是需要避免过多的层。[优先使用渲染层合并属性、控制层数量](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)

#### 工具
想知道绘制需要多长时间和多长时间发生一次绘制吗？激活Timeline上的Paint profiler面板然后创建一个记录。如果大部分渲染时间花在绘制上，那么就是有绘制问题了。

![长时间绘画](long-paint.png)

进一步检查渲染设置菜单配置可以帮助判断绘制问题。

#### 问题
下面表格描述了一些常见的绘制问题和可能的解决方案：

| 问题 | 例子 | 解决方案 |
| :----| :----| :--------|
|大规模绘制影响响应和动画|大的绘制区域或者复杂的绘制影响响应和动画|避免绘制，在同一个层中移动元素，使用变换和不透明。([简化绘制的复杂度、减小绘制区域](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas))|
|层爆炸(层数过多)影响动画|太多有translateZ动画效果的元素极大影响动画性能|减少层数，只有当你知道它确实能提供优化作用的时候才使用层。([优先使用渲染层合并属性、控制层数量](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count))|


### 备注
**Layout thrashing**：为了最大化渲染性能，Chrome通常会在应用程序中批处理布局变化请求，并制定一个计划来异步计算和渲染这些变化请求。尽管如此，当一个应用程序获取依赖于布局的属性值的时候(比如offsetHeight或offsetWidth)，Chrome依然会强制立刻同步渲染页面布局。我们称之为强制同步布局。这会明显的降低渲染的性能，在大的DOM树中重复运行时尤为明显。这种情形也被称之为"layout thrashing"。

**Jank**，就是当用户浏览网站或者app的时候，刷新频率没有跟得上时，出现的卡顿、不稳定或者停止的现象。
