---
title: ES6介绍：块作用域
date: 2016-02-25 18:40:47
tags: [es6, blockscoping]
categories: [js]
author: acelan
---

本文根据 http://dev.venntro.com/2013/09/es6-part-2/ 翻译

这是介绍即将到来的es6规范特性的系列文章的十个章节中的第二部分。如果你没读过第一部分，读一读可能对你有益。

## Let声明

在ES5(当前ECMAScript规范的主要版本，他被实现在所有的主流环境中) 中，变量只能被闭包在执行上下文的变量环境中。实际上，这意味着变量（通过var语句声明）是通过他们所在的执行上下文来访问：

```javascript
function example(x) {
    console.log(y); // undefined (not a ReferenceError)
    console.log(z); // ReferenceError: z is not defined
    if (x) {
        var y = 5; // This declaration is hoisted
    }
}
```

这归结于一个众所周知的概念叫“hoisting（提升）”。当一个函数被调用时，定义绑定初始化算法将函数代码中的每一个变量声明和函数声明以绑定的方式在变量环境中创建。如果你想了解更多关于JavaScript中hoisting的知识，我建议你去读读Ben Cherry的专题文章。

ES6的变量和函数声明依然有这样的表现（这对于向后兼容是一件好事）。不仅如此，接下来要介绍的let关键字给了我们更多的灵活性：

```javascript
function example(x) {
    console.log(y); // ReferenceError: y is not defined
    if (x) {
        let y = 5;
    }
}
```

通过let语句声明的变量被绑定在当前执行上下文的词法环境，而不是在变量环境中。ES6规范对于块语句的一个改变是每一个块都有他自己的词法环境。在上面的例子中，当块（if语句的内容）被执行的时候会创建一个新的词法环境。当let语句被执行的时候会往这个词法环境中添加一个对应的绑定，并且它无法被外部的词法环境（函数声明的这个词法环境）访问到。

>译者：这里应该就是没有hoisting和所谓暂时性死区（TDZ）产生的原因, 这里的描述不够完整，完整的规范描述和分析见本文后面[补充说明](#补充说明)

在ES6草案中我们能找到针对块的这个新的词法环境的创建细节：

Block : { StatementList }

1. 使oldEnv为当前执行上下文的词法环境。
2. 使blockEnv为通过传递oldEnv为参数调用`NewDeclarativeEnvironment`方法获得的声明式环境记录项
3. 使用块代码和blockEnv来执行块定义初始化`BlockDeclarationInstantiation(code, env）`
4. 设置执行上下文的词法环境为blockEnv.

>译者：这里两个方法`NewDeclarativeEnvironment`和`BlockDeclarationInstantiation(code, env）` 传送门 http://www.ecma-international.org/ecma-262/6.0/index.html#sec-newdeclarativeenvironment 和 http://www.ecma-international.org/ecma-262/6.0/index.html#sec-blockdeclarationinstantiation
`NewDeclarativeEnvironment`这个方法简单说就是创建一个新的声明式环境，它的外部环境是传入的oldEnv
`BlockDeclarationInstantiation(code, env）`这个方法跟本文关系比较密切，见本文后面[补充说明](#补充说明)


>译者：<del>这里有个疑问，oldEnv被传递来创建新的blockEnv，那么blockEnv应该是持有外部词法环境，那么查找在上面的TDZ形成的时候查找不到应该去查找外部词法环境就是oldEnv，也就是如果外部声明了某个变量的时候就应该找到而不是报错，这样就没有TDZ的概念了</del>
看另外一个文章，已经没有疑问了，只是规范并不是很正式的说明，也没有具体的实现细节，规范内容见本文后面[补充说明](#补充说明)
例如：
    ```javascript
    let foo;
    if (true) {
        foo = 111;  //ReferenceError？
        let foo;
    }
    ```




值得注意的是let声明不会像var声明一样被提升。试图在let声明被执行之前引用一个标识符会导致错误：

```javascript
console.log(x); // ReferenceError: x is not defined
let x = 10;
```

任何能使用var声明地方都能使用let声明。特别值得关注的是他在loop初始值化器的使用。当使用var语句作为loop的初始化器时这个声明将被提升变量将被通过他所在的执行上下文访问。这对于那些从实现了块作用域的语言中转过来的新手来说，很容易导致混乱。
通过let声明我们能够确保loop的计数器只能被他的块所访问。

```javascript
for (let i = 0; i < 10; i++) {
    console.log(i); // Prints 0 to 9
}
console.log(i); // ReferenceError: i is not defined
```

## Const声明

ES6介绍了另外一个声明类型，const(ES6 § 13.2.1). 他有和let一样的块作用域绑定语义,但是他的值是一个只读的常量。不同于let和var声明，他们必须初始化：

```javascript
var x; // x === undefined
const z; // SyntaxError: const declarations must have an initializer

const y = 10; // y === 10

y = 20; // SyntaxError: Assignment to constant variable
```

注意const关键字被很多引擎支持有一段时间了，但是在ES6规范中有一些略微的不同。一个主要的差别是常量当前被声明在函数作用域而不是块作用域（不是块作用域么，翻译有问题？）。企图为一个常量赋值会导致失败，但是在所有的引擎中都不会导致报错。

>译者：我觉得const最大的需要注意的地方应该在于对于引用类型，比如对象的const上，这里的应该分歧较多，本文没有提到

## 块中的函数声明

ES5中函数声明不允许出现在块中。然而很多实现允许这样，导致了在这些实现中有不同的行为（ES5 §12）：

目前广泛使用的几种ECMAScript的实现是支持把函数声明作为一个语句的。然而这些实现中对这样函数声明的语法应用上有着重大的，不可调和的差异。

ES6提议明确允许函数声明出现在块中，也遵守和let，const声明一样的语义：

```javascript
if (x) {
    function fn() {
        // Do stuff
    }
    someObj.method = fn;
}
console.log(fn); // ReferenceError: fn is not defined
```

然而，这个提议是否可能被实现，依然存在着一些不同的声音，因此我不能确定他是否会被写入最终的规范。如果你对这些疑难的讨论感兴趣，可以去Mozilla和Webkit的issue中看看。

下节再见，下次我们将看看解构，可能是ES6中最多被谈到的特性之一。follow我们的twitter，在文章发布的时候得到通知，还有别忘了我们正在招聘...

## 补充说明

### ES6 & 13.2.14 运行时语义：块定义初始化
_注意_ 当一个普通块或者Case块内容被执行时，一个新的声明式环境记录被创建并且在这个环境记录项中初始化每一个块作用域的变量，常量，函数，生成器函数，或者块中的类声明的绑定。

块定义初始化使用code和env为参数，按照下面的方式来执行。code是块对应的内容的语法产生式。env是指绑定被创建的那个声明式环境记录。

1. 使declarations为代码的词法作用域声明
2. 针对每一个declarations里面的元素d, 执行
    + a. 对d的BoundNames里面的每一个元素dn，执行
        * i. 如果d的IsConstantDeclaration为true，那么
            1. 使status为env.CreateImmutableBinding(dn, true).
        * ii. 否则，
            1. 使status为env.CreateMutableBinding(dn, false).
        * iii. 断言：status永远不会是一个突然完结
    + b. 如果d是一个GeneratorDeclaration产生式或者FunctionDeclaration产生式, 那么
        * i. 使fn为d的BoundNames的唯一元素
        * ii. 使fn为为了d使用env为参数执行InstantiateFunctionObject的结果
        * iii. 执行env.InitializeBinding(fn, fo).

### ES6 & 13.3.1 Let and Const Declarations
> 这是规范中关于暂时性死区TDZ产生的原因的描述

_NOTE_ let and const declarations define variables that are scoped to the running execution context’s LexicalEnvironment. The variables are created when their containing Lexical Environment is instantiated but may not be accessed in any way until the variable’s LexicalBinding is evaluated. A variable defined by a LexicalBinding with an Initializer is assigned the value of its Initializer’s AssignmentExpression when the LexicalBinding is evaluated, not when the variable is created. If a LexicalBinding in a let declaration does not have an Initializer the variable is assigned the value undefined when the LexicalBinding is evaluated.

> 这里大概的意思是说，当遇到块语句的时候，就会创建一个新的词法环境，创建后会立即进行块定义初始化来绑定块中的变量（这里很像函数执行环境中的定义绑定初始化过程，也就是其实已经执行了类似的hoisting过程），唯一的差别在于上面的规范规定了在真正执行到let语句的时候（即使已经通过块定义初始化绑定）才能对变量引用进行读/写，这就产生了TDZ，且这也是虽然有定义初始化过程，但没显示出hoisting特性的原因




