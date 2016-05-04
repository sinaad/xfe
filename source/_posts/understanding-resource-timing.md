title: 理解资源时间线(待翻译，彤阳)
date: 2016-04-27 13:56:58
tags: [devtool, guide, translate, 域名碎片化]
categories: devtool
author: 徐DerDer
---

> 本文根据 https://developers.google.com/web/tools/chrome-devtools/profile/network-performance/understanding-resource-timing 翻译


理解网络聚集资源的阶段是非常重要的。这是修复加载问题的基础。

> 内容：
> DevTools界面
> 判断网络问题


>太长，不看
> 理解资源时间线的各个阶段。
> 学习每个阶段提供的资源时间线API。
> 认识在timeline图中的不同性能问题的指示器。像是一串透明条或者很多绿块。

所有网络请求都要考虑资源。因为他们检索整个网络，资源在资源时间线上展示了清晰地生命周期。The NetWork Panel使用相同的资源时间线API确保应用开发者能够使用。

资源时间线API提供了每一个单独资源被接收的时间的详细细节。主要阶段的请求生命周期是：

- 重定向
  - 立刻开始startTime。
  - 如果发生重定向，redirectStart也开始。
  - 如果重定向发生在这个阶段的末尾，则redirectEnd会被记录。
- App缓存
  - 如果应用缓存满足请求，一个fetchStart时间点会被记录。
- DNS
  - 在DNS请求开始时，domainLookupStart时间点会被记录。
  - 在DNS请求结束时，domainLookupEnd时间点会被记录。
- TCP
  - 在初始化连接服务器的连接时，connectStart会被记录。
  - 如果TSL或SSL在使用中，当稳定连接开始握手时，secureConnectionStart会开始。
  - 如果连接服务器的连接完成了，connectEnd会被记录。
- 请求
  - 向服务器请求资源的请求被发送时，requestStart会被记录一次。
- 响应
  - responseStart是服务器初始化响应请求的时间点。
  - responseEnd是请求结束和数据被接收的时间点。

![resource-timing-api](./resource-timing-api.png)

## DevTools界面

想要看进入一个Net Panel完整的timing信息，你有三种选择。

1. 将鼠标悬停在时间线下方的时间图上，将会弹出所有的时间数据。
2. 点击任意的条目，然后打开时间标签。
3. 在js中使用时间资源API来获得数据。

![resource-timing-data](./resource-timing-data.png)

这段代码能够在DevTools控制台中运行。它会用network timing API 来获得所有资源。然后它过滤条目寻找一个名字是"style.css"的资源。如果找到了就把数据返回。
![resource-timing-entry](./resource-timing-entry.png)


>Queuing
  - 如果一个请求在排队，它表示：
    - 这个请求被渲染引擎推迟，由于它被认为是比重要资源优先级要低（像scripts或者styles）。这通常发生在图片上。
    - 这个请求被挂起，等待一个非空闲TCP socket被释放。
    - 这个请求被挂起，因为浏览器在HTTP 1只支持6个TCP连接。

>Stalled/Blocking
  - 请求在它可以被发送之前一直等待所花的时间。它会因为各种原因认为在排队，于是开始等待。另外，这个时间包括代理过程中花的时间。

>Proxy Negotiation
  - 代理过程中所花的时间。

>DNS Lookup
  - DNS查询所花的时间。在一个站上所有新的域会进行全面的DNS查询。

>Initial Connection / Connecting
  - 建立一个连接所花的时间，包括TCP握手/重连和通过SSL协议。

>SSL
  - 完成SSL握手所花的时间。

>Request Sent / Sending
  - 发出网络请求所花的时间。通常是零点几毫秒。

>Waiting (TTFB)
  - 等待初始响应所花的时间，也可以理解为获得第一个字节的时间。这个时间是捕获往返服务器的等待时间，除了等待服务器传递响应的时间。

>Content Download / Downloading
  - 获取响应数据所花的时间。

## 判断网络问题

有很多可能出现的问题可以通过Network Panel来揭露。想发现这些问题需要对客户端和服务器如何交互和协议所规定的限制有一个好的理解。

### 一系列队列或停滞

大多数通常的问题看到的是一系列排队或者停滞项目。这表明太多资源接收于一个单独服务器。在HTTP 1.0/1.1连接，Chrome强制一个主机最多有六个TCP连接。如果你一次请求12个项目，前六个连接会开始，而后六个会进入队列。一旦前六个连接完成，队列中的第一个项目会开始它的请求过程。

![stalled-request-series](./stalled-request-series.png)

为了修复这个传统HTTP 1通信问题，你会需要实现域分片。在你的应用从服务器获得的资源上制作多个子域。然后把资源切割成均匀的子域。

修复HTTP 1连接问题的方法不适用于HTTP 2连接的问题。事实上，这会破坏他们。如果你有HTTP 2的部署，不要将你的资源进行切片，这与HTTP 2的设计背道而驰。在HTTP 2，这里只有一个TCP连接通向服务器，表现看起来像多个连接。这突破了HTTP 1的六个连接和多个资源会同步传输的限制。

### 获取第一个字节的缓慢时间
绿色部分
![indicator-of-high-ttfb](./indicator-of-high-ttfb.png)

获取第一个字节的缓慢时间（TTFB）被认为是一个长等待时间。建议你把这个时间降低到200ms以下。一个长的TTFB意味着两个主要问题。分别是：
1. 在客户端和服务器间的网络环境不好
2. 服务器的程序响应很慢

解决长的TTFB，首先要尽可能多的削减网络传输。理想情况是，本地主机应用依然有长的TTFB。如果有，应用需要优化响应速度。这意味着优化数据库查询，实现缓存某些内容，或者修改你的web服务器配置。这有很多原因导致后台变慢。你仍需要去深入查找你的软件并找到什么没有达到你的预期。

如果TTFB是局部缓慢那么在客户端跟服务器之间的网络是有问题的。网络传输会因为很多事情被阻碍。在客户端和服务器间有很多点，并且每一个点有它自己的连接限制而且可能会导致出问题。简单的测试这种问题的方法是把你的应用放在另一个主机上然后看看TTFB是不是有改善。

### 查看吞吐能力
蓝色部分
![indicator-of-large-content](./indicator-of-large-content.png)

如果你发现很多时间花费在内容下载阶段，改善服务器响应或者连接是不会有帮助的。主要的解决办法是减少传输字节。