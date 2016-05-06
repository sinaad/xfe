title: Command Line API参考文档
date: 2016-05-06 12:56:23
tags: [devtool, guide, translate, console, api]
categories: devtool
author: acelan
---

> 本文根据 https://developers.google.com/web/tools/chrome-devtools/debug/command-line/command-line-reference#profilename-and-profileendname 翻译

Command Line API包含了一个非常方便的函数集合，用来执行日常的任务：选择和检查DOM元素，用可读的形式显示数据，停止和启动分析器，监控DOM事件等。

## 注意

> 这个API只能在控制台内部使用。你不能在页面脚本中访问Command Line API


## \$\_
`$_` 返回最近一次执行的表达式的值。

下面的例子中，执行了一个很简单的表达式 `(2 + 2)`， 然后执行`$_`，是一样的值:

![$_ is the most recently evaluated expression](recently-evaluated-expression-1.png)

在下一个例子中，被执行的表达式是一个包含了几个名字的数组。然后执行`$_.length`获取数组的长度, 存储在`$_`中的值变成了最近执行的表达式的值, 4:

![$_ changes when new commands are evaluated](recently-evaluated-expression-2.png)

## \$0 - \$4

`$0, $1, $2, $3` 和 `$4`以历史引用的方式工作，它关联最近在Element面板中查看的5个DOM元素或者最近在Profiles面板中选中的5个Javascript堆。 `$0`返回最近的元素或者javascript对象, `$1`返回第二近的选中对象，以此类推。

在下面的例子中，Element面板中一个class是medium的元素被选中。在Console面板中，`$0`执行后指向了相同的元素：

![Example of $0](element-0.png)

下图显示了在同样的页面中选中不同的元素，`$0`现在指向了新的选中元素, 而`$1`指向了之前选中的那个:

![Example of $1](element-1.png)

## \$(selector)
`$(selector)`返回指定的CSS选择器指向的第一个DOM元素的引用. 这个方法是`document.querySelector()`的别名。

下面的例子返回了文档中第一个`<img>`元素的引用:

![Example of $('img')](selector-img.png)

在返回值中右键并选择‘Reveal in Elements Panel’在DOM树中找到他, 或者选择‘Scroll in to View’在页面中显示.

下面的例子返回当前选中的元素的src属性：

![Example of $('img').src](selector-img-src.png)

> Note

## \$\$(selector)
`$$(selector)` 返回匹配给定CSS选择器的所有元素的数组。这个命令等价于`document.querySelectorAll()`.

下面的例子用`$$()`来创建当前文档中所有 `<img>`元素的数组并且显示他们的src属性：

```javascript
    var images = $$('img');
    for (each in images) {
        console.log(images[each].src);
    }
```

![Example of using $$() to select all images in the document and display their sources.](all-selector.png)

> Note

## \$x(path)
`$x(path)`返回匹配给定的XPath表达式的所有DOM元素的数组。

比如下面的例子返回页面上所有的`<p>`元素。

```javascript
   $x("//p")
```

![Example of using an XPath selector](xpath-p-example.png)

下面的例子返回页面上所有包含`<a>`的`<p>`元素.

```javascript
    $x("//p[a]")
```

![Example of using a more complicated XPath selector](xpath-p-a-example.png)

## clear()
`clear()`清除控制台中的历史.

```javascript
    clear();
```

## copy(object)
`copy(object)`复制指定对象的字符串表示到剪贴板。

```javascript
    copy($0);
```

## debug(function)
当指定函数被调用时，debugger被调用，函数在Source面板内暂停，用来进行单步跟踪调试。

```javascript
    debug(getData);
```

![Breaking inside a function with debug()](debug.png)

使用`undebug(fn)`来停止函数暂停, 或者在界面中停止所有断点。

更多关于断点的信息，请看[断点调试](https://developers.google.com/web/tools/chrome-devtools/debug/breakpoints).

## dir(object)
`dir(object)`以对象风格列表的形式展现了所有指定的对象属性。displays an object-style listing of all the specified object’s properties. 这个方法是Console API中`console.dir()`方法的别名.

下面的例子显示了直接执行`document.body`和使用 `dir()`来显示相同元素之间的不同：

```javascript
    document.body;
    dir(document.body);
```

![Logging document.body with and without dir() function](dir.png)

更多信息请见Console API中的[console.dir()](https://developers.google.com/web/tools/chrome-devtools/debug/console/console-reference#console.dir) 

## dirxml(object)
`dirxml(object)`打印出执行对象的XML展现形式, 就像在Elements面板中看到的那样。这个方法同[console.dirxml()](https://developer.mozilla.org/en-US/docs/Web/API/Console)。

## inspect(object/function)
`inspect(object/function)`打开并且选中指定的元素或者对象在对应的面板中：DOM元素在Elements面板，Javascript堆对象在Profiles面板。

下面的例子打开`document.body`在Element面板:

```javascript
    inspect(document.body);
```

![Inspecting an element with inspect()](inspect.png)

当给inspect传递的是一个函数的时候，这个函数会打开Sources面板给你调试。

## getEventListeners(object)
`getEventListeners(object)`返回对象中注册的事件监听者列表。这个返回值是一个对象，包含了每一种注册的事件类型(“click” 或者“keydown”, 等)所对应的数组。每一个数组的成员是一个对象，描述了每一种类型注册的监听器。例如，下面的列表是docuemnt对象上注册的所有时间监听器：

```javascript
    getEventListeners(document);
```

![Output of using getEventListeners()](get-event-listeners.png)

如果指定的对象上注册了多于一个的监听器，那么数组包含每一个监听器成员。在下面的例子中，有两个事件监听器注册在`#scrollingList`元素的“mousedown”事件上：

![Multiple listeners](scrolling-list.png)

你可以展开每一个对象来深入浏览他们的属性：

![Expanded view of listener object](scrolling-list-expanded.png)

## keys(object)
`keys(object)`返回一个包含指定对象的所有属性名的数组。要获取属性关联的值，可以使用`values()`.

例如，假设你的应用程序定义了下面这样的对象：

```javascript
    var player1 = { "name": "Ted", "level": 42 }
```

假设`player1`定义在全局空间内（简单起见）, 在控制台中输入`keys(player1)`和`values(player1)`能得到下面的结果：

![Example of keys() and values() methods](keys-values.png)

## monitor(function)
当指定的函数被调用的时候，控制台中会打印一个消息，指出被执行的函数的函数名和传递给它的参数。

```javascript
    function sum(x, y) {
        return x + y;
    }
    monitor(sum);
```

![Example of monitor() method](scrolling-list-expanded.png)

使用`unmonitor(function)`来停止监控。

## monitorEvents(object[, events])
当指定对象中的指定事件中的一个发生的时候，Event对象会被打印到控制台，你可以给监视器指定唯一的事件，一组事件，或者通过主要事件“类型”来映射到这个类型对应的所有预定义的事件集合（下面表格中有这个类型的说明）。如下：

下面监视了window对象中的所有resize事件。

```javascript
    monitorEvents(window, "resize");
```

![Monitoring window resize events](monitor-events.png)

下面定义了一个数组来监视window对象中的“resize”和“scroll”事件:

```javascript
    monitorEvents(window, ["resize", "scroll"])
```

你也可以执行一个可用的事件”类型“，一个字符串映射到一个预定义的事件集合。下表列出了可用的事件类型和它所关联的事件映射：

| 事件类型 | 对应的映射事件 |
|------------|-----------------------------|
| mouse  | "mousedown", "mouseup", "click", "dblclick", "mousemove", "mouseover", "mouseout", "mousewheel" |
| key | "keydown", "keyup", "keypress", "textInput" |
| touch |  "touchstart", "touchmove", "touchend", "touchcancel" |
| control | "resize", "scroll", "zoom", "focus", "blur", "select", "change", "submit", "reset" |

例如，下面的例子应用了“key”事件类型对应的所有按键相关事件在当前Element面板中选中的input元素。

```javascript
    monitorEvents($0, "key");
```

下面的例子是在文本域中输入字符时的输出：

![Monitoring key events](monitor-key.png)

## profile([name]) and profileEnd([name])
`profile()`通过一个可选的name来启动一个Javascript CPU 分析会话。 `profileEnd()` 完成分析并在Profile面板中显示结果. (见[提高JavaScript执行性能]().)

要开始分析:

```javascript
    profile("My profile")
```

结束分析并在profile面板中显示结果:

```javascript
    profileEnd("My profile")
```

profile也可以嵌套. 例如，下面这样将按顺序执行:

```javascript
    profile('A');
    profile('B');
    profileEnd('A');
    profileEnd('B');
```

Profiles面板中的结果:

![Grouped profiles](grouped-profiles.png)

> 注意

## table(data[, columns])
通过传递data对象和一个可选的表头来用表格的方式打印对象数据。例如，要在控制台中用表格显示names的列表，你可以这么做：

```javascript
    var names = {
        0: { firstName: "John", lastName: "Smith" },
        1: { firstName: "Jane", lastName: "Doe" }
    };
    table(names);
```

![Example of table() method](table.png)

## undebug(function)
`undebug(function)` 去除指定函数的调试功能以便当函数被调用的时候，debugger不在调用。

```javascript
    undebug(getData);
```

## unmonitor(function)
`unmonitor(function)`去除指定函数的监视功能. 这跟`monitor(fn)`配套使用.

```javascript
    unmonitor(getData);
```

## unmonitorEvents(object[, events])
`unmonitorEvents(object[, events])`停止监听指定对象的事件. 例如，下面的代码停止监听window对象上的所有事件:

```javascript
    unmonitorEvents(window);
```

你也可以选择性的停止监听对象上的指定事件。例如，下面的代码开始监听当前选中的元素中所有的鼠标事件，然后停止监听“mousemove”事件（为了减少控制台输出的干扰）：

```javascript
    monitorEvents($0, "mouse");
    unmonitorEvents($0, "mousemove");
```

## values(object)
`values(object)` 返回包含指定对象中所有属性的值的数组。

```javascript
    values(object);
```


