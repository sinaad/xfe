title: RAIL性能模型
date: 2016-04-22 13:21:54
tags: [devtool, guide, translate, tool]
categories: devtool
author: acelan
---
> 本文根据 https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/rail?hl=en 翻译

RAIL is a user-centric performance model. Every web app has these four distinct aspects to its life cycle, and performance fits into them in very different ways:

![RAIL performance model](rail.png)

## Focus on the user
Make users the focal point of your performance effort. The majority of time users spend in your site isn’t waiting for it to load, but waiting for it to respond while using it. Understand how users perceive performance delays:

| Delay |  User Reaction |
|-------|----------------|
| 0 - 16ms |   Given a screen that is updating 60 times per second, this window represents the time to get a single frame to the screen (Professor Math says "1000/60 ~= 16"). People are exceptionally good at tracking motion, and they dislike it when the expectation of motion isn’t met, either through variable frame rates or periodic halting. |
| 0 - 100ms  | Respond to a user action within this time window and they will feel like the result was immediate. Any longer, and the connection between action and reaction is broken. |
| 100 - 300ms | Users experience a slight perceptible delay. |
| 300 - 1000ms  |  Within this window, things feel part of a natural and continuous progression of tasks. For most users on the web, loading pages or changing views represents a task. |
| 1000+ms | Beyond 1 second, the user loses focus on the task they are performing. |
| 10,000+ms  | The user is frustrated and is likely to abandon the task; they may or may not come back later. |

## Response: respond in under 100ms
You have 100ms to respond to user input before they notice a lag. This applies to any input, whether they are clicking a button, toggling form controls, or starting an animation.

If you don’t respond, the connection between action and reaction is broken. Users will notice.

While it may seem obvious to respond to user’s actions immediately, that’s not always the right call. Use this 100ms window to do other expensive work, but be careful not to block the user. If possible, do work in the background.

For actions that take longer than 500ms to complete, always provide feedback.

> Remember
>   Respond to user's touchmoves and scrolling in under 16ms.

## Animation: render frames every 16ms
Animations aren’t trivial actions that web apps can opt into. For example, scrolling and touchmoves are types of animation. Your users will really notice if the animation frame rate varies. Your goal is to produce 60 frames per second, and every frame has to go through all of these steps:

![Steps to render a frame](render-frame.png)

From a purely mathematical point of view, every frame has a budget of 16.66ms (divide 1 second by 60) but, because browsers have housekeeping to do, the reality is that there is a window of 10ms for your code during animations.

In high pressure points like animations, the key is to do nothing where you can, and where you can’t, do the absolute minimum. Whenever possible, make use of the 100ms response to pre-calculate expensive work so that you maximize your chances of hitting 60fps.

For more information, see [Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering/).

## Idle: maximize idle time
Use idle time to complete deferred work. For example, keep pre-load data to a minimum so that your app loads fast, and use idle time to load remaining data.

Deferred work should be grouped into blocks of about 50ms. Should a user begin interacting, then the highest priority is to respond to that.

To allow for <100ms response, the app must yield control back to main thread every <100ms, such that it can execute its pixel pipeline, react to user input, and so on.

Working in 50ms blocks allows the task to finish while still ensuring instant response.

## Load: deliver content under 1000ms
Load your site in under 1 second. If you don’t, your user’s attention wanders, and their perception of dealing with the task is broken.

Focus on [optimizing the critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) to unblock rendering.

You don’t have to load everything in under 1 second to produce the perception of a complete load. Enable progressive rendering and do some work in the background. Defer non-essential loads to periods of idle time (see this [Website Performance Optimization Udacity course](https://www.udacity.com/course/website-performance-optimization--ud884) for more information).

## Summary of key rail metrics
To evaluate your site against RAIL metrics, use the Chrome DevTools [Timeline tool](/xfe/2016/04/21/how-to-use-the-timeline-tool/#more) to record user actions. Then check the recording times in the Timeline against these key rail metrics:

| RAIL Step  |  Key Metric  User Actions |
|------------|---------------------------|
| Response  |  Input latency (from tap to paint) < 100ms.  User taps on an icon or button (e.g., opening the nav menu, tapping Compose). |
| Response  |  Input latency (from tap to paint) < 16ms.   User drags their finger and the app's response is bound to the finger position (e.g., pull to refresh, swiping a carousel). |
| Animation  | Input latency (from tap to paint) < 100ms for initial response. User initiates page scroll or animation begins. |
| Animation  | Each frame's work (JS to paint) completes < 16ms.   User scrolls the page or sees an animation. |
| Idle |   Main thread JS work chunked no larger than 50ms.    User isn't interacting with the page, but main thread should be available enough to handle the next user input. |
| Load  |  Page considered ready to use in 1000ms. User loads the page and sees the critical path content. |
| Load   | Satisfy the Response goals during the full page load process.   User loads the page and starts interacting (e.g., scrolls or opens navigation). |
