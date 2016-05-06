title: 理解资源时间线
date: 2016-04-27 13:56:58
tags: [devtool, guide, translate, 域名碎片化]
categories: devtool
author: 徐DerDer
---

> 本文根据 https://developers.google.com/web/tools/chrome-devtools/profile/network-performance/understanding-resource-timing 翻译


理解资源通过网络被聚集到一起的阶段非常重要。这是修复加载问题的基础。

所有网络请求都被认为是一个资源。当他们在网络中被检索，资源时间线上展示了资源不同的生命周期。NetWork面板使用了与开放给开发者使用的[Resource Timing API](http://www.w3.org/TR/resource-timing)相同的API。

Resource Timing API提供了每一个单独资源被接收的详细时间细节。请求生命周期的主要阶段有：

- 重定向
  - 立刻开始startTime。
  - 如果发生了重定向，记录redirectStart。
  - 如果重定向发生在这个阶段的末尾，则redirectEnd会被记录。
- App缓存
  - 如果是应用程序缓存（application cache）填充了请求，fetchStart时间点会被记录。
- DNS
  - 在DNS请求开始时，domainLookupStart时间点会被记录。
  - 在DNS请求结束时，domainLookupEnd时间点会被记录。
- TCP
  - 在初始化连接服务器的连接时，connectStart会被记录。
  - 如果TSL或SSL在使用中，当安全连接开始握手时，secureConnectionStart会开始。
  - 如果连接服务器的连接完成了，connectEnd会被记录。
- 请求
  - 向服务器请求资源的请求被发送时，requestStart会被记录一次。
- 响应
  - responseStart是服务器初始化响应请求的时间点。
  - responseEnd是请求结束和数据被接收的时间点。

![resource-timing-api](./resource-timing-api.png)

## 在DevTools中查看

想要查看Network面板中的实体的完整timing信息，你有三种做法。

1. 将鼠标悬停在Timeline列下方的时间图上（貌似需要点击一下图），将会弹出所有的时间数据。
2. 点击任意的条目，然后打开Timing标签。
3. 在js中使用Resource Timing API来获得数据。

![resource-timing-data](./resource-timing-data.png)

> 这段代码能够在DevTools控制台中运行。它会用网络时间线API 来获得所有资源。然后它过滤条目寻找一个名字是"style.css"的资源。如果找到了就把数据返回。
![resource-timing-entry](./resource-timing-entry.png)


### <span style="color:#fff;outline:1px solid #ccc;">▌</span>排队中Queuing
  - 如果一个请求在排队，它表示：
    - 这个请求被渲染引擎推迟，因为它被认为是比重要资源（比如scripts或styles）优先级要低。这通常发生在图片上。
    - 这个请求被挂起，等待一个非空闲TCP socket被释放。
    - 这个请求被挂起，因为浏览器在HTTP 1只支持[6个TCP连接](https://crbug.com/12066)。

### <span style="color:#cdcdcd">▌</span>停滞Stalled/阻塞Blocking
  - 请求在它可以被发送之前等待所花的时间。它会因为各种原因认为在排队等待。另外，这个时间包括代理协商过程所花的时间。

### <span style="color:#cdcdcd">▌</span>代理协商Proxy Negotiation
  - 代理协商过程中所花的时间。

### <span style="color:#1f7c83">▌</span>DNS查询DNS Lookup
  - DNS查询所花的时间。在一个站上所有新的域会进行全面的DNS查询。

### <span style="color:#e58226">▌</span>初始化连接Initial Connection / 连接中Connecting
  - 建立一个连接所花的时间，包括TCP握手/重连和通过SSL协议。

### <span style="color:#e58226">▌</span>SSL
  - 完成SSL握手所花的时间。

### <span style="color:#5fdd5f">▌</span>请求发送Request Sent / 发送中Sending
  - 发出网络请求所花的时间。通常是零点几毫秒

### <span style="color:#5fdd5f">▌</span>等待Waiting (TTFB)
  - 等待初始响应所花的时间，也可以理解为获得第一个字节的时间（Time To First Byte）。这个时间是捕获往返服务器的等待时间，除了等待服务器传递响应的时间。

### <span style="color:#4189d7">▌</span>内容下载Content Download / 下载中Downloading
  - 获取响应数据所花的时间。

## 判断网络问题

可以通过Network面板来发现很多问题。想发现这些问题需要对客户端和服务器如何交互和对协议的限制有一定的理解。

### 一连串的排队(Queued)或者停滞(Stalled)

最普遍的问题是看到一连串的排队或者停滞。这表明太多资源来自一个单独服务器。在HTTP 1.0/1.1连接，Chrome强制一个主机最多有六个TCP连接。如果你一次请求12个项目，前六个连接会开始，而后六个会进入队列。一旦前六个连接完成，队列中的第一个项目会开始它的请求过程。

![stalled-request-series](./stalled-request-series.png)

为了修复这个传统HTTP 1通信问题，你会需要实现域名分片。在你的应用从服务器获得的资源上制作多个子域。然后把资源切割成均匀的子域。

修复HTTP 1连接问题的方法*不适用*于HTTP 2连接的问题。相反的，这会破坏他们。如果你有HTTP 2的部署，不要将你的资源进行切片，这与HTTP 2的设计背道而驰。在HTTP 2，只有一个TCP连接通向服务器但实际上有多个连接。这突破了HTTP 1的六个连接，多个资源会同步传输。

### 第一个字节时间（TTFB）太慢
绿色部分
![indicator-of-high-ttfb](./indicator-of-high-ttfb.png)

第一个字节时间（TTFB）慢被认为有一个长的等待时间。建议你把这个时间[降低到200ms以下](https://developers.google.com/speed/docs/insights/Server)。一个长的TTFB意味着两个主要问题。分别是：
1. 在客户端和服务器间的网络环境不好
2. 服务器的程序响应很慢

解决长的TTFB，首先要尽可能多的削减网络传输。理想情况下，把应用放在本地主机，看看是否依然有很长的TTFB，如果有，那么需要优化应用的响应速度。这意味着需要优化数据库查询，实现缓存某些内容，或者修改web服务器配置。有很多原因会导致后台变慢，你需要去深入查找你的软件为什么没有达到你的预期。

如果TTFB在本地情况下变小，那么说明客户端跟服务器之间的网络是有问题的。网络传输会因为很多事情被阻碍。在客户端到服务器间有很多环节，并且每一个环节有它自己的连接限制，这些都可能会导致出问题。简单的测试这种问题的方法是把你的应用放在另一个主机上然后看看TTFB是不是有改善。

### 查看吞吐能力
蓝色部分
![indicator-of-large-content](./indicator-of-large-content.png)

如果你发现很多时间花费在内容下载阶段，改善服务器响应或者连接是不会有帮助的。主要的解决办法是减少传输字节。