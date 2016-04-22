title: 如何使用Timeline工具
date: 2016-04-21 14:25:38
tags: [tool, devtool, guide]
author: acelan
categories: devtool
---
> 本文根据 https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/timeline-tool?hl=cn 翻译

使用Chrome开发者工具的Timeline面板来记录和分析你的应用执行过程的所有的活动。这是开始调查你的应用性能问题的最好的地方。

![timeline](timeline-panel.png)


## Timeline面板概览
Timeline面板包括以下四个部分：

1. *控制条* 开始记录，停止记录，和配置记录过程中哪些信息需要捕获。
2. *总览* 页面性能最顶层的总览。它下面有更多的信息。
3. *燃烧图*  一个可视化的CPU执行栈追踪。

>你可以在燃烧图中看到一到三条垂直的虚线。蓝色线表示`DOMContentLoaded`事件。绿色线表示第一次绘制的时间。红色线表示`load`事件。

4. *详细* 当选择一个事件的时候，这个面板会现实更多关于这个事件的信息。当没有选中任何事件的时候，这个面板现实关于选中的时间帧的信息。


![annotated timeline panel](timeline-annotated.png)

## 总览面板

总览面板包括三个图：
* *FPS* 每秒帧数。绿色的条越高，FPS越高。FPS图上面的红色块标记出长帧，which are likely candidates for jank.
* *CPU* CPU资源。这个区域图标记出什么类型的事件消耗了CPU资源。 This area chart 
* *NET* 每一个颜色的条表示一种资源。条越长，这种资源占用的处理时间越长。每一个条中较浅的部分表示等待时间（资源请求到资源第一个字节被下载的时间）。较深的部分表示传输时间（第一个字节被下载到下载完成的时间)。

条按照下面的方式分配颜色:
* HTML文件是<span style="color:hsl(214, 67%, 66%)">蓝色<span>。
* 脚本是<span style="color:hsl(43, 83%, 64%)">黄色</span>。
* 样式表是<span style="color:hsl(256, 67%, 70%)">紫色</span>。
* 媒体文件是<span style="color:hsl(109, 33%, 55%)">绿色</span>。
* 其他资源是<span style="color:hsl(0, 0%, 70%)">灰色</span>。

![overview pane, annotated](overview-annotated.jpg)

## 创建记录

要创建一个页面加载的记录，打开Timeline面板，打开你想记录的页面，然后重载页面。Timeline面板自动记录页面的重载。

要创建一个页面交互的记录，打开Timeline面板，然后点击记录按钮或者使用Cmd+E(Mac)或者Ctrl+E(Windows/Linux) 开始记录。当开始记录的时候记录按钮会变成红色。执行页面交互，然后点击记录按钮或者使用快捷键停止记录。

当记录完成的时候，DevTools会猜测那个记录区域对你最有价值，然后自动缩放到这个区域。

### 记录提示
1. 保持记录尽可能短。越短的记录通常越容易分析。
2. 避免不必要的动作。避免那些跟你的记录和分析无关的行为(鼠标点击，网络加载等)。比如，你要记录点击登陆按钮这个动作，不要滚动页面，也不要加载图片，等等。
3. 禁用浏览器缓存。当记录网络操作的时候，从开发工具的设置面板或者Network面板的条件控制中禁用浏览器缓存是一个好的做法。
4. 禁用扩展。Chrome扩展会给你的应用的Timeline记录增加无关的噪音。用隐身模式打开Chrome窗口或者创建一个新的配置文件确保你的环境中没有扩展程序。


## 查看记录细节

当你在火焰图中选择一个事件时，详细内容面板会显示关于这个事件的额外信息。

![details pane](details-pane.png)

某些页签，比如Summary, 在所有的事件中都会显示。其他的页签只在某些特定的事件类型中展现。详见[Timeline事件](/xfe/2016/04/22/timeline-event-reference/#more)的每种记录类型的细节说明。


## 记录过程中截图

Timeline面板可以捕获屏幕在页面加载的时候。这个功能通过Filmstrip体现。

当你要创建一个记录并且需要截取屏幕的时候，在控制面板中启用截屏的checkbox。屏幕截图将会显示在概览面板的下面。

![timeline recording with filmstrip](timeline-filmstrip.png)

可以把你的鼠标悬停在屏幕截图上或者概览面板来查看某个记录点上的放大截图。左右移动鼠标来模拟记录的整个动态过程。

<video src="https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/animations/hover.mp4" controls></video>


## 审查JavaScript

在开始记录之前启用JS审查的复选框用来捕获js的执行栈。当Js审查被启用的时候，你的火焰图中会现实每一个被调用的JS函数。

![flame chart with JS profile enabled](js-profile.png)

## 审查绘图

在开始记录之前启用Paint的复选框用来获得更多关于绘制事件的信息。当绘制审查启用并且在一个绘制事件上点击的时候，一个新的绘制审查页签会被显示在详细面板中，它会显示更多更细致的关于这个事件的信息。

![paint profiler](paint-profiler.png)

### 渲染设置
打开主菜单，选择更多工具>渲染设置, 进入渲染设置选项卡，在调试绘制的问题时它非常有用。渲染设置以紧跟在Console面板后面的一个页签形式打开（如果Console是隐藏的，可以用ESC打开）。

![rendering settings](rendering-settings.png)

## 查找记录

在查看事件的时候，你可能想集中在一个类型的事件。例如，你需要查看每一个解析HTML事件的细节。

激活Timeline并按CMD + F（MAC）或Ctrl + F（Windows/Linux）能够打开一个查找工具栏，键入要检查的事件类型的名称，比如Event。

工具栏只适用于当前选定的时间范围内。在选定的时间段以外的任何事件都不包括在结果中。

向上和向下箭头可以移动搜索结果。因此，第一个结果表示最早的事件在选定的时间内，最后的结果是最后的事件。每次按“上”或“向下”箭头，选择一个新事件，这样你就细节面板中的查看它的细节。按上下箭头相当于在火焰图中点击一个事件。

![find toolbar](find-toolbar.png)

## 在Timeline区域缩放

你可以在一个记录中放大某一个区域来方便分析。你可以使用概述面板来放大记录中的某个部分。放大后，火焰图也会自动放大以匹配相同的部分。

![zoom in on a section of a timeline recording](zoom.png)

如果要放大某个部分，可以使用下面两种方式:

1. 在概览面板中，用鼠标拖出要放大的区域。
2. 在标尺中调整灰色滑块。

如果你选中了一个区域，你可以使用W, A, S, D来调整这个区域。W，S对应放大和缩小，A，D对应左移和右移。

## 保存和加载记录
你可以保存或者打开一个记录，通过在概览面板或者燃烧图中点击右键，然后选中相关选项进行操作。
![save and open recordings](save-open.png)