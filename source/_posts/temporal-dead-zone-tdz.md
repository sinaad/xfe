---
title: 暂时性死区是个什么鬼
date: 2016-02-26 17:43:42
tags:
---
在ECMA2015（EC6）中，介绍了一个有关作用域的新概念：暂时性死区（简称TDZ）。
虽然听起来有点可怕，但实际上，概念是不难掌握的。首先，我们先回顾一下在ES5中，作用域是如何工作的：

```javascript
var x = 'outer scope';
(function(){
	console.log(x);
	var x = 'inner scope';
}())
```

看完上面的这段代码，你能说出console.log(x)输出的是什么么？如果你认为是undefined，那么就接着往下看。如果你认为是其他的结果，那么建议你花一些时间去看一看变量声明提前（hoisting）和变量隐藏，这些概念是理解TDZ的关键。

# 探索暂时性死区

现在我们来看一个非常简单并且出现TDZ的例子：

```javascript
console.log(x); // throws a ReferenceError
let x = 'hey';
```

就像你看到的那样，过去的var和现在新出的let\const两者一个比较大的不同就是(除了作用域之外)后者被TDZ所限制，意味着变量在初始化之前被读/写会抛出ReferenceError，而不是像之前的var那样会返回undefined。这使得代码变得更加可预期并且更容易找到潜在的bugs。TDZ看起来很容易是吧？

# 好吧，TDZ并没有那么简单

再看一次之前的例子，一种推测是let/const不会有hoist，所以会抛出ReferenceError,对吧？错！这种想法太简单了（要当心这种无根据来源的的猜测？）。
回到本文中最初的例子，用let替换var，然后看看结果。

```javascript
let x = 'outer scope';
(function(){
	console.log(x);
	let x = 'inner scope';
}())
```

你能猜到这次conso.log(x)的结果么？事实上，这次没有任何结果，代码会因为TDZ而抛出ReferenceError。这是因为let/const确实有hoist，但是他们在初始化之前就进行读/写操作的时候会直接抛出错误（而不是像之前的var那样会返回undefined）。我知道这在之前已经说过一次了，但这真的是TDZ重要的点，所以值得尽可能的多提几次（多看几次，能让你记忆深刻。。。）

当然，这仍然很简单，我想先让你记住并且简单地理解一下。现在，开始看更深入的细节。

# 详细的细节

我们很好奇，所以让我们来一场“TDZ深层次之旅”吧！

在ECMAScript2015规范中的一个“不规范”的node中有对let/const声明和TDZ的解释：

## [13.3.1 Let and Const Declarations](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-let-and-const-declarations)

NOTE let and const declarations define variables that are scoped to the running execution context’s LexicalEnvironment. The variables are created when their containing Lexical Environment is instantiated but may not be accessed in any way until the variable’s LexicalBinding is evaluated. A variable defined by a LexicalBinding with an Initializer is assigned the value of its Initializer’s AssignmentExpression when the LexicalBinding is evaluated, not when the variable is created. If a LexicalBinding in a let declaration does not have an Initializer the variable is assigned the value undefined when the LexicalBinding is evaluated.

人话版：

let and const declarations define variables that are scoped to the running execution context’s LexicalEnvironment.
let和const声明定义的变量作用在当前执行上下文的词法环境中。

The variables are created when their containing Lexical Environment is instantiated but may not be accessed in any way until the variable’s LexicalBinding is evaluated.
上面大概的意思是说，所有let/const声明在他们的词法环境被实例化的时候创建（hoist），但在执行词法绑定执行之前是不能存取的(TDZ)。

A variable defined by a LexicalBinding with an Initializer is assigned the value of its Initializer’s AssignmentExpression when the LexicalBinding is evaluated, not when the variable is created.
以带有初始化器的词法绑定形式定义的变量，在词法绑定被完全执行的时候使用他的初始化器的赋值表达式计算的值来进行赋值，而不是在变量被创建的时候。

```javascript
//在执行let x之前任何x的读取都会抛出错误
//console.log(x);throws a ReferenceError
let x = 42;
//执行之后就可对x进行读取
console.log(x);//42
```

接下来的部分：
If a LexicalBinding in a let declaration does not have an Initializer the variable is assigned the value undefined when the LexicalBinding is evaluated.
如果一个let声明的词法绑定没有初始化器，那么这个变量在初始化绑定被执行的时候会被用undefined赋值。
简单来说就是下面的这样

```javascipt
let x;
```
等于
```javascript
let x = undefined;
```
在执行词法绑定初始化（包括隐式的赋值undefined）之前，任何读取操作都会抛出错误。在执行之后就可以正常工作，上面的两个例子，在代码后面获取到的x的值都是undefined。

希望你已经对TDZ有一定认识了，接下来做一点稍微进阶的练习：
```javascript
let x = x;
```
上面这段代码会报错么？执行完后，x的值是什么？

首先，要记住的是let/const变量在它的“初始化器”完全执行后才会进行初始化。所以右表达式执行完后，会把值赋给变量。
因此右表达式在尝试读取x变量，但是x的“初始化器”还没有执行完全，事实上我们正在执行中，所以x还处在未初始化状态，于是形成TDZ。

这里有另一个TDZ例子，感谢TC39成员和Traceur的维护者Erik Arvindson：
```javascript
let a = f();
let b = 2;
fucntion f(){ return b; }
```
在第一行，f的调用使得控制流跳到执行f函数，而f函数的返回值b还处于TDZ，所以会报错误。可以看到，在读取父级作用域，也会出现TDZ。

# TDZ无处不在

目前我所举的例子都是let/const声明，但TDZ其实应用于很宽的领域。默认参数也有TDZ。
```javascript
//正常工作
(function(a, b = a){
	console.log(a === 1);//true
	console.log(b === 1);//true
}(1,undefined));

//a在尝试读取b的时候，b还未完成绑定初始化
(function(a = b, b){}(undefined,1));//ReferenceError
//a同样处于TDZ
(function(a = a){}());//ReferenceError
```

再多想一个，下面这个例子会发生什么？
```javascript
let b = 1;
(function(a = b,b){
	console.log(a,b);
}(undefined,2));
```

看起来有些让人困惑，但事实上是TDZ的反例。因为默认参数在中间域（介于父级域和函数内部域之间）中被赋值。参数a和b在中间域中绑定并且由左到右初始化，因此“初始化器”尝试读取b，b标识符在当前域（中间域）开始处理绑定b，这时b还未完全初始化，于是形成TDZ并报错。（感觉跟let只是用来迷惑人的）

另一个例子，子类（class x extends y{}）的构造器在调用父类构造器之前访问this会形成TDZ报错.这是因为如果子类构造器没有调用父类构造器，它的this会认为未绑定初始化。同样的，子类构造器在执行到构造代码的最后一行都没有调用父类构造器，那么这个构造器（像其他构造器一样）就会隐式的返回this？就像没有完全初始化一样发生TDZ。
引用：[ES6 super construct proposal](https://github.com/tc39/ecma262/blob/master/workingdocs/ES6-super-construct%3Dproposal.md). （注意，这个建议是写本文两周前提出的，所以在最终的ES2015规范中他可能有所变化或者被舍弃掉）

# TDZ无处不在...除了转换器和引擎中

目前，转换器比如像6to5（译者：babel）和Traceur并不会强制任何TDZ语义——Traceur和6to5都有一个开放着的issue，且只是形式上的（译者：这里说的意思可能是这的issue还没有一个很好的解决），6to5试图通过快速的肮脏的静态特征检查来实现TDZ, 但因为算法上的问题导致许多bug所以不得不立即回退。
这里有一些转换器目前无法优先考虑强制TDZ的原因：

性能: 每一个涵盖TDZ语义的标识符必须有通过运行时检查包装的读/写访问操作用来完全覆盖TDZ语义（见之前“残酷的细节”章节中嵌套作用域例子）。这个问题依据一个可选的TDZ检查变换器配置项工作作，只在开发环境中被打开 —— 如果你的代码只为了正常的工作而不要求抛出TDZ ReferenceErrors（这应该是一个比较罕见的使用场景）它应该能很好的工作。

性价比：实现合适的TDZ检查需要花费一些时间和精力，而这完全可以用来实现新的功能或者改进已经存在的实现。

不可能截获所有的可能的用户错误：几乎所有的转换器的目标都是正确的把ES.next转换为ES.current，因此他们希望你知道你自己在干什么。捕获所有类型的错误，莫名其妙的和用户能够输入到转换器的边界误差情况的错误将花费你无限量时间。

在我写这个文章的时候，还没有任何一个浏览器的Javascript引擎完全实现let声明的规范。参见（[引用](http://kangax.github.io/compat-table/es6/#let)）。Firefox Nightly（38.0a1的版本（2015-01-30）在写作的时候）提供了一个亲切，干净并且客观的TDZ错误信息像下面这样：

```javascript
{x; let x;}
// ReferenceError: can't access lexical declaration `x' before initialization
```

这意味着当你使用转换器的时候你必须格外的小心，你可能现在写出的看起来运行的很好的代码在你升级成强制执行适当的TDZ语义的转换器，或者当你尝试着不用转换步骤而直接在ES2015+的兼容TDZ的环境中执行代码的时候出现问题。

# 那么 var 呢？

var声明的变量将仍然保持他们在ES5中的行为——ECMAScript规范，必须总是在向后兼容的前提下进行改进，以利于浏览器厂商采用新的规范，而不至于破坏原来的web。
理论上，可以通过引入一个新的“执行模式”（跟“use strict”类似）到var中来应用TDZ语义，然而，这是不太可能发生的，原因如下：

绝大多数TC39的成员都反对添加更多的执行模式/编译(条件)/标记。
即使这种新的执行模式被实现，在var声明变量上增强了TDZ语义将引入不必要的学习壁垒，且对那些想要将原有代码转向新的执行模式的人存在一些重构的风险。

## 结语

在你的代码可能不小心访问到未初始化的绑定的情况下，暂时性死区语义通过给开发者提供错误反馈避免产生意外的结果（就像ES5现在这样）的特点将会显得非常有用。当你在使用一个没有强制TDZ的转换器的时候你要注意这些语义，否则你可能无意中写出有问题的代码。

或者，如果你真的害怕TDZ —— 其实不应该害怕，一旦转换器/引擎实现了TDZ语义，大多数情况下错误都将是明确的而且容易修复的 ，当然你也可以暂时继续使用没有TDZ语义的var。

# 延伸阅读

[Temporal Dead Zone explanations](https://gist.github.com/rwaldron/f0807a758aa03bcdd58a) by TC39 members Rick Waldron and Allen Wirfs-Brock.
[let - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) at Mozilla Developer Network.
[Block-Scoped Declarations - You Don’t Know JS: ES6 & Beyond](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/ch2.md#block-scoped-declarations) by Kyle Simpson.
[ES6 Notes: Default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/) by Dmitry Soshnikov.