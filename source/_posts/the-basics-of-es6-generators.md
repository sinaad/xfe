title: ES6 generators入门
date: 2016-07-11 13:35:58
tags: [es6, generator, translate]
categories: translate
author: acelan
---
本文翻译自：https://davidwalsh.name/es6-generators

Javascript ES6中最让人兴奋的新特性之一是function的一个新的衍生方法，叫做generator。这个名字有点奇怪，但它的行为乍一看更加奇怪。本文旨在解释它是怎么工作的，并且带你理解为什么它对于未来的JS是如此有用。



## 执行直到完结(Run-To-Completion)
首先我们要说的是在“执行到完结”这点上，generators是如何与普通function不同的。

无论你是否意识到这一点，你总是能够设想到关于函数的一些基本点：一旦函数开始执行，它将总是执行到结束才能执行另外一个JS代码。

例如：
```javascript
setTimeout(function(){
    console.log("Hello World");
},1);

function foo() {
    // NOTE: don't ever do crazy long-running loops like this
    for (var i=0; i<=1E10; i++) {
        console.log(i);
    }
}

foo();
// 0..1E10
// "Hello World"
```

在这里，for循环将消耗相当长一段事件直到结束，可能超过1毫秒，而我们的回调是`console.log(...)`语句的计时器无法打断`foo()`的执行，所以它被卡在这一行的后面（在事件循环中）并且等待轮到它执行。

但是，如果`foo()`可以被打断？它会不会破环我们的程序？

这就是挑战多线程编程的噩梦，但是很幸运的是在Javascript中我们不必担心这样的事情，JS是单线程的（在给定的时间中只执行一条命令/函数）

> 注意: Web Workers是一种机制，通过它你可以把JS程序的一部分拆分成线程来执行，和你的JS程序的主线程并行执行。 我们不介绍多线程到我们的程序中的原因在于两个线程只能通过正常的异步事件相互沟通，而它总是遵循event-loop一次一个的行为, 要求执行到完结。

## 执行..停止..执行(Run..Stop..Run)
通过`ES6 generator`, 我们拥有另外一种不同的函数，能够在中间暂停，一次或者多次，并且之后恢复执行，在它暂停的期间允许其他代码执行。

如果你曾经了解过任何并发或者线程编程，你可能看过“cooperative”这个词，它基本表明一个进程（在我们的语境下，表示一个函数）将由自己决定是否允许一个中断，用来使它可以跟其他的代码进行协作。这个概念与“preemptive(优先权)”形成鲜明对比，它建议进程/函数可以根据自己的意愿被打断。

`ES6 generator`函数是“cooperative（合作的）”在他们的并发行为中。
在generator的函数体中，你可以使用新的`yield`关键字来从函数内部暂停函数。函数外部无法暂停一个generator；当遇到`yield`的时候它会暂停自身执行。

然而，一旦generator通过yield-paused暂停了它自己，它不能自己恢复。要重启generator，必须由外部控制。一会我们将解释这是怎么发生的。

因此，基本上说，一个generator函数能够按你想要的被多次停止和重启。实际上，你能够定义一个无限循环的generator函数（就像著名的`while (true) { .. }`）他永远不会结束。
While that's usually madness or a mistake in a normal JS program, with generator functions it's perfectly sane and sometimes exactly what you want to do!

更重要的是，启动和停止不只是控制generator函数的执行，同时它为generator提供了双向信息传递。在正常的函数中，你在最开始的时候获取参数并且在最后返回值。而在generator函数中，你通过yield传递出信息，并且在每一次重启的时候传递进信息。


## 请看语法!
让我们深挖一下这些新的且令人兴奋的gendeator函数的语法。

首先，新的声明语法：
```javascript
function *foo() {
    // ..
}
```

注意这里的`*`？这是新的且有点奇特。对于那些来自其他语言的人来说，他看起来像一个可怕的返回值是指针的函数。但是千万不要混淆！这只是一种形式用来标识这种特殊的generator函数类型。

你可能看过有些文章/文档，它们使用`function* foo(){ }`来替代`function *foo() { }`(\* 所在的位置不同)。两种都是可以的，但是最近我认为`function *foo(){ }`跟准确一些，因此我在这里使用这个写法。

现在，让我们来讲讲generator函数的内容。在大多数情况下，Generator函数只是一个普通的JS函数。在generator函数里面，只有很小一部分语法需要学习。

我们要玩的主要的新玩具，如上面提到的，就是`yield`关键字。 `yield ___`叫做“yield表达式”(而不是语句) 因为当我们重启generator的时候，我们将会回传一个值，而且无论如何传进去的值都是`yield ___`表达式的计算结果。

例如:
```javascript
function *foo() {
    var x = 1 + (yield "foo");
    console.log(x);
}
```

`yield "foo"`表达式将传递出“foo”值在暂停generator函数的那个时候，并且无论何时generator被重启，被回传的那个值都是这个表达式的结果，之后它将被加1后赋值给x变量。

看看双向沟通? 你往外传递了一个”foo“, 暂停了自己，然后在未来的某个时间点（可能是立即，也可能是很长一段时间），generator被重启并且将给你回馈一个值，这非常类似yield关键字为一个值创建了请求。

在任何表达式所在的地方，你都可以只使用yield，这样会传递出一个undefined的值：
```javascript
// note: `foo(..)` here is NOT a generator!!
function foo(x) {
    console.log("x: " + x);
}

function *bar() {
    yield; // just pause
    foo( yield ); // pause waiting for a parameter to pass into `foo(..)`
}
```

### Genrator迭代器
"Genrator迭代器". Quite a mouthful, huh? //什么鬼？

迭代器是一种特殊的行为类型，实际上也是一种设计模式，我们通过调用next()一次获取一个有序集合中的一个值。想象一下这样的例子，我们在有5个值的数组上使用一个迭代器：[1,2,3,4,5]。第一次的next()调用返回1， 第二次调用返回2，以此类推。在所有的值都返回之后，next()将返回null或者false或者任意其他能够表明所有值遍历完成的信号。

我们从外面控制generator的方式是构造并且和generator迭代器进行交互。这听起来比它实际使用复杂很多。思考下面这个有点笨的例子：

```javascript
function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
}
```

为了一步步访问`*foo()`generator函数的值，我们需要构造一个迭代器。怎么做？很简单！
```javascript
var it = foo();
```

噢！只是通过正常的方式调用generator函数，并不需要实际上去执行任何内容。

你可能感到有点奇怪。你也可能有点疑惑，为什么不是`var it = new foo()`。╮（╯_╰）╭ ... 这背后复杂的语法不在我们这里的讨论范围。

所以现在，开始迭代我们的generator函数，我们只要：

```javascript
var message = it.next();
```

它将给我们返回一个yield 1语句中的1，但这不是我们得到的全部信息。

```javascript
console.log(message); // { value:1, done:false }
```
实际上，我们从next()的调用中得到一个对象，有一个value属性是yielded-out的值，还有一个布尔类型的done属性表明了generator函数是否完全执行完毕。

我们继续迭代：
```javascript
console.log( it.next() ); // { value:2, done:false }
console.log( it.next() ); // { value:3, done:false }
console.log( it.next() ); // { value:4, done:false }
console.log( it.next() ); // { value:5, done:false }
```

有意思的是，当我们得到5的值的时候done依然是false。
那是因为技术上，generator函数并没有结束。我们必须最后再调用一次next(), 并且如果我们传递进一个值，他将被设置成yield 5表达式的结果。然后这才是generator函数的完结。

那么：
```
console.log( it.next() ); // { value:undefined, done:true }
```

所以，generator函数最后的结果是我们完成了函数，但没有结果返回（因为我们用完了所有的`yield ———` 语句）

对于这个你可能还有疑惑，我可以在generator函数里面使用return么，而且如果我用了，这个值会被在value属性中传递出来么？

是的...

```javascript
function *foo() {
    yield 1;
    return 2;
}

var it = foo();

console.log( it.next() ); // { value:1, done:false }
console.log( it.next() ); // { value:2, done:true }
```

... 然而也不完全是.

从generator函数中return一个值可能不是一个好主意，因为当通过`for...of`迭代generator函数的时候（后面会讲），最后返回的值将被丢弃。

完整起见，
For completeness sake, let's also take a look at sending messages both into and out of a generator function as we iterate it:

```javascript
function *foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
}

var it = foo( 5 );

// note: not sending anything into `next()` here
console.log( it.next() );       // { value:6, done:false }
console.log( it.next( 12 ) );   // { value:8, done:false }
console.log( it.next( 13 ) );   // { value:42, done:true }
```
你可以看到我们可以像使用正常函数一样，在的迭代器初始化过程`foo(5)`中传递参数（我们的例子中的x），使x的值是5.

第一次的next(..)调用，我们没有传递任何值。为什么？因为没有yield表达式接收我们传递进去的内容。

但如果我们给第一次next(..)调用传递了值，也不会发生什么不好的事情。他就是一个废弃的值。在这种情况下，ES6告诉generator函数忽略无用的值。（注意：在写作的时候，Chrome和FF的开发版工作正常，但其他浏览器还没有完全支持，并且这种情况下可能会抛出错误）

`yield(x + 1)`传递出6. 第二个next(12)调用传递12给等待中的`yield(x + 1)`表达式，所以y被设置成2 * 12，24.
然后接下来的`yield(y/3) (yield(24/3))`传递出8，第三个next(13)的调用传递给等待中的`yield(y/3)`表达式，使得z的值是13.

最后，`return (x + y + z)`返回(5 + 24 + 13), 也就是最后返回了42.

重新再读几次。第一次或者头几次看到他都会感到奇怪。

## for..of

ES6通过直接提供对”执行迭代器直到完成“的支持，在语法层面实现了这种迭代器模式：`for..fo`循环

例如:
```javascript
function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

for (var v of foo()) {
    console.log( v );
}
// 1 2 3 4 5

console.log( v ); // still `5`, not `6` :(
```

如你所见，通过foo()创建的迭代器被for..of循环自动捕获，并且为你自动迭代，每次迭代过程返回一个值，直到done:true 传出。只要done是false，它自动提取value属性并且赋值给迭代变量（v）。一旦done为true，迭代结束（并且没有任何最终的结果返回，即使有return）

如上所述，您可以看到`for..of`循环忽略且丢弃return 6的值。同时，因为没有暴露的next()调用，`for..of`循环不能被用在像我们上面说的那样，需要给generator按步骤传递值的情况。

## 总结

好了，这就是generator的基础内容。不用担心依然有点小纠结，一开始我们所有人都会这样！



很自然地，我们都想知道这个新玩具将给我们的代码带来什么。虽然还有很多未知，我们只是稍微触及了下表皮。因此，我们必须更加深入以让我们能否探索更多它们将要/能够带来的变化。

在你尝试完上面所有的代码片段后（使用chrome nightly/canary或者FF nightly，或者node 0.11以上版本，通过`--harmory`参数）, 那么有下面的问题：

* 错误处理如何工作?
* 一个generator能调用另一个generator么？
* 怎么用generator进行异步编码?

这些问题，或者更多，将会在后续的文章中涉及, 敬请关注!