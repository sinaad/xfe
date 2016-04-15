---
title: 暂时性死区(TDZ)并不神秘
date: 2016-02-26 17:16:19
tags: [js, es6, tdz, translate]
categories: js
author: acelan，徐DerDer
---

本文根据 http://jsrocks.org/2015/01/temporal-dead-zone-tdz-demystified/ 翻译


暂时性死区是ECMAScript与作用域相关的一个新语义模块， 在ES2015(又叫ES6)中引入。

虽然这个名字听起来有点吓人，但实际上这个概念不难把握。首先，让我们退一步看看ES5中作用域是如何工作的：

```javascript
var x = 'outer scope';
(function() {
    console.log(x);
    var x = 'inner scope';
}());
```

通过执行上面的代码，你能告诉我`console.log(x)`打印的是什么么？如果你猜是`undefined`, 那么你可以往下继续阅读。否则，你需要花点时间阅读一下关于声明提升（[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting), [Adequately Good](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)）和[变量隐藏](http://en.wikipedia.org/wiki/Variable_shadowing)相关的内容，这是充分了解TDZ的关键。


## 接触暂时性死区（TDZ）

好的，现在让我们稍微往前一点点，从一个及其简单并且刻意的TDZ作用域的例子开始：

```javascript
console.log(x); // throws a ReferenceError
let x = 'hey';
```

就像你看到的一样，老的`var`和新的`let/const`声明（除了他们的作用域外）最大的主要不同点之一就是后者被暂时性死区所约束，也就是当他们在初始化之前被访问(读/写)的时候将抛出`ReferenceError`, 而不是跟var声明变量一样返回`undefined`。这使得代码中的潜在问题更容易被预测和发现，对吧？

## 好吧，TDZ确实没有这么简单
再花点时间看看上面的例子，可以很容易推断`let/const`声明并没有被提升，并且这能解释抛出了ReferenceError么？当然不能，这是一种不正确的过于简化的解释（当心一个不明确的资源夺走他）
>译者：估计是指不要知其然不知其所以然

让我们回到文章最早的那个例子，把var替换成let，看看会发生什么：
```javascript
let x = 'outer scope';
(function() {
    console.log(x);
    let x = 'inner scope';
}());
```
你能猜猜`console.log(x)`现在会打印出什么么？好吧，实际上，没有结果——因为TDZ的语义的约束，这段代码将抛出`ReferenceError`。尽管`let/const`声明提升了，但是当他们在初始化前被访问的时候抛出了错误（而不是跟var一样返回undefined）。我知道前面已经解释过这个事情，但是他真的是TDZ的一个关键点，所以非常值得我重复强调（主要是为了做一些记忆训练——重复这个段落中的重要部分直到他能够深入你的大脑！）

当然，这仍然有一些过分简化，为了创造一个容易记住和理解的概念，我已经做了很大的努力保持准确且简单。
现在进入细节...


## 残酷的细节

很好奇，是不？接下来让我们来深入探索TDZ。

ECMAScript2015规范。在一个不规范的_“注意”_中清晰的解释了let/const声明提升和TDZ语义：

### 13.2.1 Let 和 Const声明

_注意：_ let和const声明定义的变量作用在当前执行上下文的_词法环境_中。变量在他们的词法环境被初始化的时候被创建，但是在变量的词法绑定被执行前他们不能被以任何形式被访问。以带有初始化器的词法绑定形式定义的变量，在词法绑定被执行的时候用他的初始化器的赋值表达式的计算结果来赋值，而不是在变量被创建的时候赋值。如果一个let声明的词法绑定没有初始化器，那么这个变量在初始化绑定被执行的时候会被用`undefined`赋值。

如果你对ECMAScript的理解不够透测，我将用英语再转述一下规范的相关部分：

> 变量在当他们的词法环境被初始化的时候创建[...]

这意味着不管控制流何时进入新的作用域(例如：module, function或者块作用域), 所有属于给定的作用域的let/const绑定都会在任何代码执行之前被初始化 —— 换句话说，let/const声明被提升了！

>[...]但是不能被以任何形式访问直到变量的词法绑定被执行。

这就是TDZ。一个给定的let/const声明绑定不能被以任何形式访问（读/写）直到控制流执行了声明语句 —— 这个跟提升无关，但是跟声明实际在代码中的位置有关。通过例子能简单的解释：

```javascript
// Accessing `x` here before control flow evaluates the `let x` statement
// would throw a ReferenceError due to TDZ.
// console.log(x);

let x = 42;
// From here on, accessing `x` is perfectly fine!
console.log(x);
```

最后的部分：

>如果一个let声明的词法绑定没有初始化器，那么这个变量在初始化绑定被执行的时候会被用`undefined`赋值

意思是：

```javascript
let x;
```
等价于：
```javascript
let x = undefined;
```
同样的，在控制流执行初始化器（或者“隐式” = undefined 的初始化器）之前试图以任何方式访问x都将导致ReferenceError, 当控制流已经执行了声明后访问则是正常的——在上面两个例子中，在let x声明之后读取x变量都会返回undefined。

相信现在你已经对TDZ语义有了一个比较好的认识，所以让我们试着做一些稍微高级一点的练习。

假设有下面的代码：

```javascript
let x = x;
```
这个代码执行的时候会不会有错误？代码执行后x的值是多少？

首先，记住let/const变量只有在他的初始化器被完全执行后才算作已经完成初始化——也就是说，在赋值的右边表达式被执行并且他的结果被赋值给所声明的变量后（才算做已经完成初始化）。

在这种情况下，右边的表达式尝试去读取x变量，但x的初始化器还没有被完全执行——实际上这个时候我们正在执行——所以这个时刻x仍然未始化，而试图去读取他的值将会导致一个TDZ的ReferenceError。

嗯，这里还有一个稍微高级的TDZ的例子——感谢TC39成员和Traceur的维护者Erik Arvindson：

```javascript
let a = f();
const b = 2;
function f() { return b; }
```
第一行，`f()`调用导致了控制流跳转去执行`f`方法，他将尝试去读取`b`常量，在运行时的这个时候，他（b）还没有被初始化(在TDZ描述的范围内)，因此这将会抛出一个ReferenceError。如你所见，TDZ语义也适用于访问父作用域的变量。

## TDZ无处不在！
到目前为止，我只是展示了let/const声明的例子，但是TDZ语义实际上在ES2015规范中有很广泛的应用。例如，默认参数也有TDZ语义。

```javascript
// Works fine.
(function(a, b = a) {
    a === 1;
    b === 1;
}(1, undefined));

// Default parameters are evaluated from left to right,
// so `b` is in the TDZ when `a`'s initializer tries to read it.
(function(a = b, b) {}(undefined, 1)); // ReferenceError

// `a` is still in the TDZ when its own initializer tries to read `a`.
// See the "gory details" section above for more details.
(function(a = a) {}()); // ReferenceError
```
你可能会疑惑，在下面这种情况下会发生什么：
```javascript
let b = 1;
(function(a = b, b) {
    console.log(a, b);
}(undefined, 2));
```

上面这个例子看起来可能有点让人困惑，但是他实际上也是一个TDZ反例 —— 因为[默认参数在给定函数的父作用域和内部作用域之间的中间作用域](https://github.com/google/traceur-compiler/issues/1376)被执行。`a`和`b`参数被绑定在这个（中间）作用域并且从左到右被初始化，因此当`a`的初始化器试图读取`b`的时候，由当前作用域（中间作用域）`b`绑定解决的`b`标识符在这个时候尚未初始化，这时由于TDZ语义抛出了一个ReferenceError。

另外一个例子，子类（通过`class x extends y{}`创建的）的构造器如果在`super`构造器调用之前尝试访问`this`也会抛出TDZ的ReferenceError。这是因为只要一个子类的构造器还没有调用`super()`, 他的this绑定就被认为是未初始化。同样的，如果子类构造器执行到构造器代码的结尾仍然没有调用`super()`，这个构造器将（其他任何构造器都一样）隐式地尝试返回this; 当this仍然没有初始化的时候会抛出TDZ ReferenceError。
引用：[ES6 super construct proposal](https://github.com/tc39/ecma262/blob/master/workingdocs/ES6-super-construct%3Dproposal.md). （注意，这个建议是写本文两周前提出的，所以在最终的ES2015规范中他可能有所变化或者被舍弃掉）


## TDZ无处不在...除了在转换器或者引擎中

目前，转换器比如像6to5（译者：babel）和Traceur并不会强制任何TDZ语义——[Traceur](https://github.com/google/traceur-compiler/issues/1382)和[6to5](https://github.com/6to5/6to5/issues/563)都有一个开放着的issue，且只是形式上的（译者：这里说的意思可能是这的issue还没有一个很好的解决），6to5试图通过快速的肮脏的静态特征检查来实现TDZ, 但因为[算法上的问题导致许多bug](https://github.com/6to5/6to5/issues/527)所以不得不立即回退。
这里有一些转换器目前无法优先考虑强制TDZ的原因：

* _性能_: 每一个涵盖TDZ语义的标识符必须有通过运行时检查包装的读/写访问操作用来完全覆盖TDZ语义（见之前“残酷的细节”章节中嵌套作用域例子）。这个问题依据一个可选的TDZ检查变换器配置项工作作，只在开发环境中被打开 —— 如果你的代码只为了正常的工作而不要求抛出TDZ ReferenceErrors（这应该是一个比较罕见的使用场景）它应该能很好的工作。

>译者：罕见估计是说需要抛出ReferenceErrors的情况

* _性价比_：实现合适的TDZ检查需要花费一些时间和精力，而这完全可以用来实现新的功能或者改进已经存在的实现。

* _不可能截获所有的可能的用户错误_：几乎所有的转换器的目标都是正确的把ES.next转换为ES.current，因此他们希望你知道你自己在干什么。捕获所有类型的错误，莫名其妙的和用户能够输入到转换器的边界误差情况的错误将花费你无限量时间。

在我写这个文章的时候，还没有任何一个浏览器的Javascript引擎完全实现let声明的规范。参见（[引用](http://kangax.github.io/compat-table/es6/#let)）。Firefox Nightly（38.0a1的版本（2015-01-30）在写作的时候）提供了一个亲切，干净并且客观的TDZ错误信息像下面这样：
```javascript
{ x; let x; }
// ReferenceError: can't access lexical declaration `x' before initialization
```
这意味着当你使用转换器的时候你必须格外的小心，你可能现在写出的看起来运行的很好的代码在你升级成强制执行适当的TDZ语义的转换器，或者当你尝试着不用转换步骤而直接在ES2015+的兼容TDZ的环境中执行代码的时候出现问题。

## 那么var呢？
var声明的变量将仍然保持他们在ES5中的行为——ECMAScript规范，必须总是在向后兼容的前提下进行改进，以利于浏览器厂商采用新的规范，而不至于破坏原来的web。
理论上，可以通过引入一个新的“执行模式”（跟“use strict”类似）到var中来应用TDZ语义，然而，这是不太可能发生的，原因如下：

* 绝大多数TC39的成员都反对添加更多的执行模式/编译(条件)/标记。
* 即使这种新的执行模式被实现，在var声明变量上增强了TDZ语义将引入不必要的学习壁垒，且对那些想要将原有代码转向新的执行模式的人存在一些重构的风险。


## 结语
在你的代码可能不小心访问到未初始化的绑定的情况下，暂时性死区语义通过给开发者提供错误反馈避免产生意外的结果（就像ES5现在这样）的特点将会显得非常有用。当你在使用一个没有强制TDZ的转换器的时候你要注意这些语义，否则你可能无意中写出有问题的代码。

或者，如果你真的害怕TDZ —— 其实不应该害怕，一旦转换器/引擎实现了TDZ语义，大多数情况下错误都将是明确的而且容易修复的 ——，当然你也可以暂时继续使用没有TDZ语义的var。;)

## 延伸阅读

* [Temporal Dead Zone explanations](https://gist.github.com/rwaldron/f0807a758aa03bcdd58a) by TC39 members Rick Waldron and Allen Wirfs-Brock.
* [let - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) at Mozilla Developer Network.
*[Block-Scoped Declarations - You Don't Know JS: ES6 & Beyond](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/ch2.md#block-scoped-declarations) by Kyle Simpson.
*[ES6 Notes: Default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/) by Dmitry Soshnikov.