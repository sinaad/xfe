title: 提升javascript执行速度
date: 2016-04-27 17:08:37
tags: [devtool, translate, guide, runtime]
author: 赵鹏
categories: [devtool]
---

> 本文根据 https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/js-execution?hl=en 翻译
> 作者：Kayce Basques(Technical Writer at Google)，Meggin Kearney(Meggin is a Tech Writer)

使用Chrome开发工具的CPU分析器(CPU Profiler)来识别高耗的函数或功能。

![](cpu-profile.png)

## 记录 CPU 分析文件
如果在你的JavaScript中发现了jank现象，可以收集一个JavaScript CPU profile 来分析。CPU 分析文件展示了你页面上哪些功能消耗了执行时间。
1. 切到开发工具的Profiles面板
2. 选择"Collect JavaScript CPU Profile"按钮
3. 按下Start
4. 你可以重新加载页面，或者让页面继续运行。这取决于你要试着对什么进行分析。
5. 当结束的时候按下Stop按钮。

你也可以使用["Command Line API"](https://developers.google.com/web/tools/chrome-devtools/debug/command-line/command-line-reference#profilename-and-profileendname)从命令行记录和分组你的分析。

## 查看 CPU 分析文件
当你完成记录的时候，开发工具会自动将你记录的数据填充到Profile面板。

默认视图是"Heavy(Bottom Up)"。这个视图可以让你看到哪些函数功能最影响性能，并且可以检查函数功能的调用路径。

### 改变排序顺序
改变排序顺序，点击**"focus selected function"**(![focus selected function](focus.png))旁边的下拉菜单，然后选择下面的选项之一：
**Chart**
展示一个按时间先后排序的火焰图。

![flamechart.png](flamechart.png)

**Heavy (Bottom Up)**
列出对性能影响的函数功能，并能让你检查函数功能的调用路径。这个是默认视图

![heavy.png](heavy.png)

**Tree (Top Down)**
在调用栈的顶部开始，展示了调用结构的一个整体面貌。

![tree.png](tree.png)

### 排除函数
从CPU分析文件中排除一个函数，点击并选中它，然后按排除选中函数图标![exclude function icon](exclude.png)。排除函数的调用者任持有排除函数的总时长。

点击恢复所有函数图标![restore all functions icon](restore.png)恢复所有被排除的函数到记录中来。

## 用火焰图查看CPU分析文件
火焰图视图提供了一个对CPU分析文件的可视化表现。

当记录完一个CPU分析文件的时候，通过变换排序顺序到Chart选项来观察一个火焰图的记录。

![flamechart.png](flamechart.png)

火焰图分为两部分：
1. **概览**一个全纪录的鸟瞰视图。柱子的高度表示调用栈的深度。所以，柱子越高，调用栈越深。
2. **调用栈**这个视图，表明函数在记录过程中被调用的深度。水平轴是时间，纵轴是调用栈。栈是自上而下的组织。所以，上面的函数调用它下面的一个，依次这样。

函数被随机染色，但是同一函数的调用永远是同色的，以便你观察执行模式。在别的面板中并没有随机使用颜色。

![annotated-cpu-flame.png](annotated-cpu-flame.png)

一个高的调用栈未必是有意义的，它仅仅意味着有很多函数被调用。但是一个宽的的柱子则表示这个调用是花了很长时间来完成。这些都是待优化的候选。

### 放大记录上的特定部分
在概览处按下鼠标左右拖动来放大调用栈的特定部分。放大后，调用栈会自动展示你选中的那部分记录。

![benchmark-zoom.png](benchmark-zoom.png)

### 查看函数细节
点击一个函数，在Sources面板中查看它的定义。

鼠标悬浮在一个函数上来展示它的名称和一些时间数据。提供了以下的信息：
+ **Name** 函数名称
+ **Self time** 用了多长时间完成函数的当前调用，仅包含自身，不包含它调用的其他函数。
+ **Total time** 函数的当前调用和它所调用的函数完成所花的总时间。
+ **URL** 以`file.js:100`的形式定义函数的位置。file.js表示函数在哪个js文件中，100表示函数定义所在的行号。
+ **Aggregated self time** 记录上此函数所有调用的总时间，不包含此函数调用的函数。
+ **Aggregated total time** 此函数所有调用的总时间，包含此函数调用的函数。
+ **Not optimized** 分析器检测到此函数的一个可能的优化。

![details.png](details.png)

