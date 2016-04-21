title: 如何使用Timeline工具
date: 2016-04-21 14:25:38
tags: [tool, devtool, guide]
author: acelan
categories: devtool
---

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
2. 避免不必要的动作。避免行为(鼠标点击，网络加载，等)
3. 
Keep recordings as short as possible. Shorter recordings generally make analysis easier.
Avoid unnecessary actions. Avoid actions (mouse clicks, network loads, etc.) that are extraneous to the activity you want to record and analyze. For example, if you want to record events that occur after you click a Login button, don’t also scroll the page, load an image, and so on.
Disable the browser cache. When recording network operations, it’s a good idea to disable the browser’s cache from the DevTools Settings panel or the Network conditions drawer.
Disable extensions. Chrome extensions can add unrelated noise to Timeline recordings of your application. Open a Chrome window in incognito mode, or create a new Chrome user profile to ensure that your environment has no extensions.

##　查看记录细节
当你在火焰图中选择一个事件时，详细内容面板会显示关于这个事件的额外信息。

![details pane](details-pane.png)

某些页签，比如Summary, 在所有的事件中都会显示。其他的页签只在某些特定的事件类型中展现。详见Timeline事件的每种记录类型的细节说明。


## 记录过程中截图

Timeline面板可以捕获屏幕在页面加载的时候。这个功能通过Filmstrip体现。

当你要创建一个记录并且需要截取屏幕的时候，在控制面板中启用截屏的checkbox。屏幕截图将会显示在概览面板的下面。

![timeline recording with filmstrip](timeline-filmstrip.png)

把你的鼠标移动到屏幕截图上或者
Hover your mouse over the Screenshots or Overview pane to view a zoomed screenshot of that point in the recording. Move your mouse left and right to simulate an animation of the recording.


<video src="https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/animations/hover.mp4" controls></video>


## 审查JavaScript
Enable the JS Profile checkbox before you take a recording to capture JavaScript stacks in your timeline recording. When the JS profiler is enabled, your flame chart shows every JavaScript function that was called.

![flame chart with JS profile enabled](js-profile.png)

## 审查绘图
Enable the Paint checkbox before you take a recording to gain more insight into Paint events. When paint profiling is enabled and you click on a Paint event, a new Paint Profiler tab is displayed in the Details pane that shows much more granular information about the event.

![paint profiler](paint-profiler.png)

Rendering settings
Open the main DevTools menu and select More tools > Rendering settings to access rendering settings that may be helpful when debugging paint issues. The rendering settings opens up as a tab next to the Console drawer (press esc to show the drawer, if it’s hiding).

![rendering settings](rendering-settings.png)

## 查找记录
While looking at events you may want to focus on one type of events. For example, perhaps you need to view the details of every Parse HTML event.

Press Cmd+F (Mac) or Ctrl+F (Windows / Linux) while the Timeline is in focus to open a find toolbar. Type in the name of the event type that you wish to inspect, such as Event.

The toolbar only applies to the currently selected timeframe. Any events outside of the selected timeframe are not included in the results.

The up and down arrows move you chronologically through the results. So, the first result represents the earliest event in the selected timeframe, and the last result represents the last event. Every time that you press the up or down arrow, a new event is selected, so you can view its details in the Details pane. Pressing the up and down arrows is equivalent to clicking on an event in the Flame Chart.

![find toolbar](find-toolbar.png)

## 在Timeline区域缩放
You can zoom in on a section of a recording to make analysis easier. You use the Overview pane to zoom in on a section of the recording. After zooming, the Flame Chart is automatically zoomed to match the same section.

![zoom in on a section of a timeline recording](zoom.png)

To zoom in on a Timeline section:

In the Overview pane, drag out a Timeline selection with your mouse.
Adjust the gray sliders in the ruler area.
Once you have a section selected, you can use the W,A, S, and D keys to adjust your selection. W and S zoom in and zoom out, respectively. A and D move left and right, respectively.

## 保存和加载记录
You can save and open recordings by right-clicking inside the Overview or Flame Chart panes and selecting the relevant option.

![save and open recordings](save-open.png)