title: 深入ES6 Generator
date: 2016-07-11 16:48:11
tags: [es6, generator, tanslate]
categories: translate
author: acelan
---

如果你还不熟悉ES6 generator, 首先需要阅读并且玩下“[Part1：ES6 Generators基础](http://sinaad.github.io/xfe/2016/07/11/the-basics-of-es6-generators/)”的代码。一旦你已经掌握了基础部分，那么你就可以深入更多的细节了。

## 错误处理
ES6 generator设计中最强大部分之一是generator的代码语义是同步的，即便外部迭代控制异步执行。

这是一种很奇妙/复杂的说法，就是你可以使用简单的错误处理技术，你可能非常熟悉 —— 叫做`try..catch`机制。

例如：
```javascript
function *foo() {
    try {
        var x = yield 3;
        console.log( "x: " + x ); // may never get here!
    }
    catch (err) {
        console.log( "Error: " + err );
    }
}
```

即便函数将暂停在`yield 3`表达式，并且可能暂停了一段时间，如果一个错误被发送回generator, `try..catch`都能够捕获它！试试在正常的异步回调中做同样的事情。：）

但是，如何准确的将一个错误发送回generator？
```javascript
var it = foo();

var res = it.next(); // { value:3, done:false }

// instead of resuming normally with another `next(..)` call,
// let's throw a wrench (an error) into the gears:
it.throw( "Oops!" ); // Error: Oops!
```

在这里，你可以看到我们使用了迭代器上的另外一个方法 —— `throw(...)` —— 它抛出一个错误给generator，在错误发生的个时间点，这时候generator正被yield-paused暂停。try..catch如你预期的一样捕获了这个错误。

> 注意，如果你 throw(..) 一个错误给generator, 但是没有try..catch捕获它，这个错误将会（如同正常的表现）传播出去（如果没有最终处理，那么会变成一个未处理的拒绝）, 所以：

```javascript
function *foo() { }

var it = foo();
try {
    it.throw( "Oops!" );
}
catch (err) {
    console.log( "Error: " + err ); // Error: Oops!
}
```

显然，错误处理的反过来也同样有效：
```javascript
function *foo() {
    var x = yield 3;
    var y = x.toUpperCase(); // could be a TypeError error!
    yield y;
}

var it = foo();

it.next(); // { value:3, done:false }

try {
    it.next( 42 ); // `42` won't have `toUpperCase()`
}
catch (err) {
    console.log( err ); // TypeError (from `toUpperCase()` call)
}
```

## 代理Generators
你可能发现你想要做的另外一件事情是在另外一个generator里面调用你的generator函数。我的意思不只是在正常的方法中初始化一个generator，而是实质上的把你的迭代器控制委托给另外一个generator。 为了实现这样的需求，我们使用yield关键字的另外一种方式：`yield *`("yield star").

例如:
```javascript
function *foo() {
    yield 3;
    yield 4;
}

function *bar() {
    yield 1;
    yield 2;
    yield *foo(); // `yield *` delegates iteration control to `foo()`
    yield 5;
}

for (var v of bar()) {
    console.log( v );
}
// 1 2 3 4 5
```

跟第一部分描述的类似（我使用`function *foo() { }` 来代替`function* foo() { }`）, 我也使用`yield *foo()`来取代其他文章/文档中说的`yield* foo()`。我认为这样更能准确/清晰说明将发生什么。

让我们来破解这是如何工作的。`yield 1`和`yield 2`把他们的值直接传递给了`for..of`循环的`next()`调用（隐式的）, 想我们了解和期望的那样。

但是之后遇到了`yield *`, 并且你将注意到我们赋予了它另外一个generator，通初始化（`foo()`）。也就是我们委托了另外一个generator的跌代器 —— 这可能是我们描述它的最准确的方法。

一旦`yield*`被从`*bar()`代理（临时的）成`*foo()`, 现在`for..of`循环的next()调用实际上是对`foo()`的控制，也就是`yield 3`和`yield 4`会发送他们的值给`for..of`循环。

一旦`*foo()`完成，控制权返回给原来的generator, 它最后调用了`yield 5`。

为了简单起见，这个例子只传出值。但是当然，如果你不使用`for..of`循环，而只是人工调用迭代器的`next(..)`方法并且传递了信息进去，这些信息将会通过`yield*`代理进去，如期望的一样：

```javascript
function *foo() {
    var z = yield 3;
    var w = yield 4;
    console.log( "z: " + z + ", w: " + w );
}

function *bar() {
    var x = yield 1;
    var y = yield 2;
    yield *foo(); // `yield*` delegates iteration control to `foo()`
    var v = yield 5;
    console.log( "x: " + x + ", y: " + y + ", v: " + v );
}

var it = bar();

it.next();      // { value:1, done:false }
it.next( "X" ); // { value:2, done:false }
it.next( "Y" ); // { value:3, done:false }
it.next( "Z" ); // { value:4, done:false }
it.next( "W" ); // { value:5, done:false }
// z: Z, w: W

it.next( "V" ); // { value:undefined, done:true }
// x: X, y: Y, v: V
```

虽然我们这里只是显示了代理的一个层级，没有理由说`*foo()`不能通过`yield*`代理另外一个generator迭代器，然后这个generator又代理另外一个，等等。

另外一个“特性”是`yield*`可以从被代理的那个generator那回收值。

```javascript
function *foo() {
    yield 2;
    yield 3;
    return "foo"; // return value back to `yield*` expression
}

function *bar() {
    yield 1;
    var v = yield *foo();
    console.log( "v: " + v );
    yield 4;
}

var it = bar();

it.next(); // { value:1, done:false }
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // "v: foo"   { value:4, done:false }
it.next(); // { value:undefined, done:true }
```

如你所见，`yield *foo()` 被委托给迭代控制器（`next()`调用）直到它完成，然后一旦他完成，从`foo()`返回的值(在这里是字符串"foo")被作为结果值设置给`yield*`表达式, 然后被赋值给本地变量v.

这是一个`yield`和`yield*`之间有趣的区别: `yield`表达式，结果总是随后的`next(..)`调用中传递的值，而`yield*`表达式， 它只从代理的generator的返回值中获取结果（因为`next(..)`通过代理透明的传值）。

你也可以通过`yield *`代理双向进行错误处理(见上文)：


```javascript
function *foo() {
    try {
        yield 2;
    }
    catch (err) {
        console.log( "foo caught: " + err );
    }

    yield; // pause

    // now, throw another error
    throw "Oops!";
}

function *bar() {
    yield 1;
    try {
        yield *foo();
    }
    catch (err) {
        console.log( "bar caught: " + err );
    }
}

var it = bar();

it.next(); // { value:1, done:false }
it.next(); // { value:2, done:false }

it.throw( "Uh oh!" ); // will be caught inside `foo()`
// foo caught: Uh oh!

it.next(); // { value:undefined, done:true }  --> No error here!
// bar caught: Oops!
```

如你所见，`throw("Uh oh!")` 通过`yield*`代理抛出错误给`*foo()`的`try..catch`。同样的，在`*foo()`内部抛出“Oops!”抛给了外部的`*bar()`，它通过另外一个`try..catch`捕获了错误。 如果我们没有捕获他们中的任意一个，错误都将如你预期的那样继续往外传播。


## 总结
Generators有同步执行语义，意味着你可以在`yield`语句中使用`try..catch`这种错误处理机制。generator迭代器还拥有`throw(..)`的方法可以在generator暂停的位置抛出一个错误给generator，当然它是可以被generator里面的`try..catch`捕获的。


`yield*`允许你委托迭代控制从当前的generator到另外一个generator。结果是`yield*`表现的如同一个双方向的传递，无论是消息还是错误。

但是，到目前为止有个根本性的问题还没有答案：generators如何在异步代码模式中起作用？在这两篇文章中，我们所看到的都是同步迭代的generator函数。

问题的关键是建立一个机制，在generator停下来的时候开始一个异步任务，然后当异步任务结束的时候恢复（通过他的迭代器的`next()`调用）。我们将在下一篇文章中探讨通过generators来创建异步控制的不同方法。敬请关注！
