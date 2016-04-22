title: Timeline事件说明
date: 2016-04-22 09:54:22
tags: [guide, devtool, tool, translate]
categories: devtool
author: acelan
---
> 本文根据 https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/performance-reference?hl=en 翻译

Timeline事件模式显示了所有录制过程中触发的事件。通过本章来学习每一个timeline事件类型的详细内容。

## 公共的timeline事件属性

某些细节存在于所有事件类型中，而有些只在某些事件类型中可用。本节列出了不同事件类型中公共的属性。其他关于事件类型的特殊属性在这个说明的后面列出。


| 属性名 | 何时显示 |
|---------|-----------------|
| Aggregated time | 对于有嵌套事件的事件，每一类事件花费的时间。|
| Call Stack | 对于有子事件的事件，每一类事件花费的时间 |
| CPU time |  被记录的事件花费的CPU时间 |
| Details | 事件其他细节信息 |
| Duration (at time-stamp)  | 事件和它所有子事件执行完成花费的时间；时间戳表示的是事件开始的时间，相对于记录开始时间 |
| Self time |  事件自身消耗的时间，不包括子事件 |
| Used Heap Size | 当事件被记录时，应用程序所占用的内存，以及自上次采样后的内存堆大小的变化量（+/-）|

## Loading事件
本节列出了Loading分类的事件和它们的属性。

| 事件 |  描述 |
|-------|--------------|
| Parse HTML | Chrome执行解析HTML的算法 |
| Finish Loading | 一个网络请求完成 |
| Receive Data | 请求的数据被接收到。可能有一个或者多个这样的事件 |
| Receive Response |  从一个请求发起的初始化HTTP响应 |
| Send Request  |  请求被发送 |

### Loading事件属性

| 属性 |  描述 |
|----------|--------------|
| Resource | 请求资源的URL |
| Preview | 请求资源预览(只能是图片). |
| Request Method |  请求使用的HTTP方法 (例如GET， POST). |
| Status Code | HTTP响应状态码 |
| MIME Type |  请求资源的MIME类型 |
| Encoded Data Length | 请求资源的字节长度 |

## Scripting事件
本节列出了Scripting分类的事件和它们的属性。


| 事件 |  描述 |
|-------|--------------|
| Animation Frame Fired |   一个计划中的动画帧被触发，并调用它的回调函数。 |
| Cancel Animation Frame  | 一个计划中的动画帧被取消 |
| GC Event  |  垃圾回收机制触发 |
| DOMContentLoaded |  浏览器触发了DOMContentLoaded。这个事件在页面所有的DOM内容被加载并且解析后触发 |
| Evaluate Script | 执行一个脚本 |
| Event  |  一个JS事件(比如“mousedown”, 或者 “key”) |
| Function Call |  一个顶级javascript函数调用（只在浏览器进入js引擎时候显示） |
| Install Timer | 通过setInterval()或者setTimeout()创建了一个定时器 |
| Request Animation Frame | 一个requestAnimationFrame()按计划调用了一个新的帧 |
| Remove Timer  |  先前定义的一个定时器被清除 |
| Time |   脚本调用了console.time() |
| Time End  | 脚本调用了console.timeEnd() |
| Timer Fired | setInterval()或者setTimeout()计划的一个定时器被触发 |
| XHR Ready State Change | XMLHTTPRequest的状态改变 |
| XHR Load  |  XMLHTTPRequest完成加载 |

### Scripting事件属性

| 属性名  |   描述 |
|-----------|---------------|
| Timer ID |  定时器ID |
| Timeout | 定时器规定的超时时间 |
| Repeats | 布尔值，规定定时器是否需要重复 |
| Function Call |  被调用的那个函数 |


##　Rendering事件
本节列出了Rendering分类的事件和它的属性。

| 事件 |  描述 |
|-------|--------------|
| Invalidate layout |  由于DOM的改变页面布局失效 |
| Layout |  执行页面布局 |
| Recalculate style  |  Chrome重新计算元素样式. |
| Scroll | 嵌套内容被滚动 |

### Rendering事件属性

| 属性名  |  描述 |
|-----------|--------------|
| Layout invalidated  | 对于Layout记录，显示了引起布局失效的代码的跟踪栈 |
| Nodes that need layout | 对于Layout记录, 显示在重新布局开始前被标记为需要布局的节点的数量。这些通常是那些因为开发者代码而失效的节点，把路径附加到重新布局的根上。|
| Layout tree size  | 对于Layout记录， 显示了重新布局根下的节点总数（那些Chrome将重新布局的节点） |
| Layout scope  |  可能的值有“Partial” (重新布局边界是DOM的一部分)和“Whole document”. |
| Elements affected |   对于Recalculate style记录，显示了重新计算样式影响的元素数量 |
| Styles invalidated | 对于Recalculate style记录，提供了导致样式失效的代码的跟踪栈. |

## Painting事件
本节列出了Painting分类的事件和他们的属性。

| 事件 |  描述 |
|-------|--------------|
| Composite Layers  |  Chrome的渲染引擎组合图片层. |
| Image Decode  |  图片资源被解码 |
| Image Resize  |   图片被从它的原始尺寸进行了缩放 |
| Paint |  组合层被绘制到显示器的某一个区域。悬停在一个Paint记录的时候可以高亮绘制的区域 |

### Painting事件属性

| 属性名   | 描述 |
|------------|-------------|
| Location   | 对于Paint事件, 显示了绘制矩形的xy坐标. |
| Dimensions  | 对于Paint事件, 显示了绘制矩形的长宽。 |

