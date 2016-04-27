title: 诊断强制同步布局
date: 2016-04-27 15:16:08
tags: [devtool, translate, guide]
author: acelan
categories: devtool
---
> 本文根据 https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/forced-synchronous-layouts?hl=en 翻译

学习怎样通过DevTools来诊断强制同步布局。

本教程通过在一个实时demo中定位和修复问题来让你学习到如何调试强制同步布局。这个demo的动画图像使用了`requestAnimationFrame()`， 这是实现帧动画的推荐方法。然而，这个动画中有相当多的jank。你的目标是确定jank的原因，解决这些问题使demo在如丝般顺滑的60帧上运行。

## 收集数据

首先，你需要获取一些数据使你能够准确知道当你的页面运行时发生了什么。

1. 打开[demo](https://googlesamples.github.io/web-fundamentals/samples/tools/chrome-devtools/profile/rendering-tools/forcedsync.html)。
2. 打开DevTools的Timeline面板
3. 启用JS Profile选项。 之后当你分析燃烧图的时候，这个选项可以让你精确地看到哪个函数被调用了。
4. 点击页面上的Start按钮开始动画。
5. 点击Timeline面板上的记录按钮开始记录时间线。
6. 等2秒钟。
7. 再次点击记录按钮停止记录。
8. 当你结束记录的时候，你会看到下面这样的Timeline面板。

![timeline recording of janky demo](demo-recording.png)

## 定位问题

现在你掌握了一份数据，是时候开始体会下它的作用了。


一目了然，你可以在你的时间轴记录的摘要面板中看到浏览器花费了大多数时间在渲染上。一般来说，如果你可以优化你的页面的布局操作，则可以减少渲染所花费的时间。

![Timeline summary](summary.png)

现在把你的注意力放在概览面板下面的粉色条上。这些条代表帧。将鼠标悬停在这些帧的上面能看到更多相关的信息。

![long frame](long-frame.png)

这些帧到完成花费了很长一段时间。为了流畅的动画你要达到60FPS的目标。

现在是时候来精确诊断到底哪里出了问题。使用你的鼠标放大调用栈。

![zoomed timeline recording](zoom.png)

栈的顶部是一个Animation Frame Fired事件。一旦这个事件触发，你传递给`requestAnimationFrame()`的函数就会被调用。在Animation Frame Fired事件后面，你能看到Function Call事件，然后你能看到`update`。可以推断，`update()`是`requestAnimationFrame()`的回调函数。

> **注意：** 这是您先前启用的JS配置文件选项很有用。如果被禁用，你只是看到函数调用，然后是所有的小紫事件（下面讨论），如果没有这些函数的调用上完全相同的细节。


现在，把注意力集中于update事件下面所有的小紫的事件。许多这些事件的上面是红的。这是一个警告信息。将鼠标悬停在这些事件上，你能看到DevTools警告你，你的页面可能是强制回流的受害者。强制回流是强制同步布局的另一个叫法。

![hovering over layout event](layout-hover.png)


现在来看看造成所有的强制同步布局的方法。点击一个布局事件选中它。在摘要面板中你应该能看到有关此事件的详细信息。点击下的 Layout Forced（update@ forcedsync.html：457）跳转到函数定义的地方。

![jump to function defintion](jump.png)

现在你能在source面板中看到函数定义。

![function definition in sources panel](definition.png)

`update()`函数是`requestAnimationFrame()`的回调方法。该方法基于图片的offsetTop值来计算每一个图片的left属性。这迫使浏览器立即执行新的布局来确保它能够提供一个正确的值。每一帧都强制布局正是产生janky动画的原因。

那么现在你已经定位了问题，你可以尝试着直接在DevTools中修复它。

## 在DevTools中修复

脚本内嵌在HTML中，因此你不能通过Source面板来编辑它（）
This script is embedded in HTML, so you can’t edit it via the Sources panel (但是，*.js的脚本可以在Source面板中编辑)。

然而，为了测试你的更改，你可以在Console中重新定义这个方法。从HTML文件中复制相关函数定义并粘贴到DevTools的Console中。删除使用的offsetTop的语句并启用它下面那段被注释的代码。完成后按回车。

![redefining the problematic function](redefinition.png)

重启动画，你能感觉到现在顺畅了很多。

## 通过另外一个记录来验证

通过在获取一个记录来验证动画确实是比以前更快，更高效，一直都是一种最佳实践。

![timeline recording after optimization](after.png)

这样更好！
