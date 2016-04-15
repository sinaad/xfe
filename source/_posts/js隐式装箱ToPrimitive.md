---
title: js隐式装箱ToPrimitive
tags: [js,隐式装箱,toPrimitive]
---

# js隐式装箱ToPrimitive


很多前端面试题中会有这样令人一头雾水的题目：
[]+[]、{}+{}、[]+{}、{}+[] 
在看完本文后，大家应该能够比较轻松的得出答案，并且明白原理。

**Ps1：**本文基于ES6版本
**Ps2：**“§”指ecma-262 6.0的章节，例如“§12.7.3 The Addition operator ( + )”
**Ps3：**本文只讨论加法

-------------------


## 值类型

原始值：string number boolean null undefined symbol
对象值：object

## 加号

### 加法运算符

先来看一下标准里是如何定义加法运算符“+”的：
> 加法运算符是用来连接字符串或数字相加的。——[§12.7.3](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-addition-operator-plus)

再来看一下标准里是如何定义加法过程的[§12.7.3.1](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-addition-operator-plus-runtime-semantics-evaluation)：
> AdditiveExpression : AdditiveExpression + MultiplicativeExpression

1. 把AdditiveExpression的result赋值给lref
2. 把GetValue(lref)的结果赋值给lval
3. 把MultiplicativeExpression的result赋值给rref
4. 把GetValue(rref)的结果赋值给rval
5. 把ToPrimitive(lval)的结果赋值给lprim
6. 把ToPrimitive(lval)的结果赋值给rprim
7. 如果Type(lprim)和Type(rprim)中有一个是String，则
	a.把ToString(lprim)的结果赋给lstr
	b.把ToString(rprim)的结果赋给rstr
	c.返回lstr和rstr拼接的字符串
8. 把ToNumber(lprim)的结果赋给lnum
9. 把ToNumber(rprim)的结果赋给rnum
10. 返回lnum和rnum相加的数值

在加法的过程中，首先把等号左右两边进行了求原值ToPrimitive()操作，然后如果两个原值只要有一个是String类型，就把两个原值都进行转化字符串ToString()操作，进行字符串拼接；否则把两个原值都进行转化数字ToNumber()操作，进行数字相加。
一共涉及了三个方法：ToPrimitive(),ToString(),ToNumber()。这三个方法在接下来会有介绍。
### 一元运算符“+”
老规矩，先来看一下标准里是如何定义一元运算符“+”的：
>一元运算符“+”是用来把目标转化成数字类型的。——[§12.5.9](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-unary-plus-operator)

再来看一下标准里是如何定义一元运算“+”过程的[§12.5.9.1](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-unary-plus-operator-runtime-semantics-evaluation):
>UnaryExpression : + UnaryExpression

1. 把UnaryExpression的result赋值给expr
2. 返回ToNumber(GetValue(expr)).

在一元“+”运算过程中，把目标直接转化成数字类型。
一共涉及了一个方法：ToNumber()。

## 类型转换

由于ECMAScript是一个弱类型语言，所以在进行值加减乘除的操作的时候，会有求原值的问题。
假设有这样一道题：一匹马 + 一匹驴 = ？
在强类型语言中，如果不进行强制类型转化，将会告诉你“马不能+驴！这是不科学的！”
可是在ECMAScript中，会进行隐式的求原值，然后进行相加，于是你会发现很神奇的事情“马 + 驴 = 马或者驴或者骡子！世界真奇妙！”

在上一节我们看到不管是加法还是一元运算“+”，过程中都涉及到类型的转换，那么接下来就来介绍上面涉及到的三种方法。

### ToNumber

[§7.1.3](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-tonumber)

|input|result|
| :-------- | :------: |
| null    |   +0 |
| undefined   |   NaN|
| number    |   不转换 |
| boolean    |   +0或1 |
| string    |   参照[§7.1.3.1](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-tonumber-applied-to-the-string-type) |
| symbol    |   TypeError |
| object    |   ToNumber(ToPrimitive(input,Number)) |
有几个地方需要注意：
1. 把字符串转换成数字，不是简单地“去掉引号”，具体规则参照[§7.1.3.1](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-tonumber-applied-to-the-string-type)。
```javascript
Number('123');//123
Number('');//0
Number(' 123 ');//123
Number('a123');//NaN 
```
2. 把symbol转换成数字，会直接抛出类型错误。 

3. 把对象转换成数字，会先进行ToPrimitive(input,Number)，然后把得到的值进行转换
### ToString

[§7.1.12](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-tostring)

| input      |     result |
| :------- | :------: |
| null    |   ‘null’ |
| undefined   |   ‘undefined’ |
| number    |   参照[§7.1.12.1](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-tostring-applied-to-the-number-type) |
| boolean    |   'true'或'false' |
| string    |   不转换 |
| symbol    |   TypeError |
| object    |   ToString(ToPrimitive(input,String)) |
有几个地方需要注意：
1. 把数字转换成字符串，不是简单地“加上引号”，具体规则参照[§7.1.12.1](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-tostring-applied-to-the-number-type)。

```javascript
var a = Number.NaN;
String(a);//'NaN'
String(123);//'123'
String(+0);//'0'
```

2. 把symbol转换成字符串，会直接抛出类型错误。 
3. 把对象转换成字符串，会先进行ToPrimitive(input,String)，然后把得到的值进行转换

### ToPrimitive

[§7.1.1](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-toprimitive)
ToPrimitive(input [, PreferredType])使用来把input转换成原始值。PreferredType为可选参数，只接受Number或String，作用是设置转换原值时的转换偏好。

| inputTpye      |     result |
| :-------- | :------: |
| Null    |   不转换，直接返回 |
| Undefined   |   不转换，直接返回 |
| Number    |   不转换，直接返回 |
| Boolean    |   不转换，直接返回 |
| String    |   不转换，直接返回 |
| Symbol    |   不转换，直接返回 |
| Object    |   按照下列步骤进行转换 |
```javascript
ToPrimitive(input [, PreferredType])

1.如果没有传入PreferredType参数，则让hint的值为'default'
2.否则，如果PreferredType值为String，则让hint的值为'string'
3.否则，如果PreferredType值为Number，则让hint的值为'number'
4.如果input对象有@@toPrimitive方法，则让exoticToPrim的值为这个方        法，否则让exoticToPrim的值为undefined
5.如果exoticToPrim的值不为undefined，则
	a.让result的值为调用exoticToPrim后得到的值
	b.如果result是原值，则返回
	c.抛出TypeError错误
6.否则，如果hint的值为'default'，则把hint的值重新赋为'number'
7.返回 OrdinaryToPrimitive(input,hint)

OrdinaryToPrimitive(input,hint)

1.如果hint的值为'string',则
	a.调用input对象的toString()方法，如果值是原值则返回
	b.否则，调用input对象的valueOf()方法，如果值是原值则返回
	c.否则，抛出TypeError错误
2.如果hint的值为'number',则
	a.调用input对象的valueOf()方法，如果值是原值则返回
	b.否则，调用input对象的toString()方法，如果值是原值则返回
	c.否则，抛出TypeError错误
```

当没有给ToPrimitive方法传类型时，通常的表现就像是传递了Number类型。但是在ES6中，用户是可以自定义@@toPrimitive方法从而进行重写这个行为。在本标准中，Symbol对象[(§19.4.3.4)](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-symbol.prototype-@@toprimitive)和Date对象[(§20.3.4.45)](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-date.prototype-@@toprimitive)已经默认定义了@@toPrimitive方法。Date对象不传类型时，表现就像是传递了String类型。

稍微总结一下：在没有改写或自定义@@toPrimitive方法的条件下，如果是Date求原值，则PreferredType是String，其他均为Number。PreferredType是String，则先调用toString()，结果不是原始值的话再调用valueOf()，还不是原始值的话则抛出错误；PreferredType是Number，则先调用valueOf()再调用toString()。

```javascript
var obj = {
	toString : function(){
		console.log("toString");
		return {};
	},
	valueOf : function(){
		console.log("valueOf");
		return {};
	}
};
Number(obj);
/*
	"toString"
	"valueOf"
	TypeError: Cannot convert object to primitive value
*/
```

提到的@@toPrimitive方法是Well-Known Symbols[(§6.1.5.1)](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-well-known-symbols)中一个，可以理解为是一个方法名，提供给引擎去调用。

Date默认定义的方法是Date.prototype[Symbol.toPrimitive]
Symbol默认定义的方法是Symbol.prototype[Symbol.toPrimitive]
用户可以重写上面的两种方法或者给其他对象新定义求原值的方法，用如下方式：

```javascript
Array.prototype[Symbol.toPrimitive] = function(hint){
	switch(hint){
		case 'number' :
			return 123;
		case 'string' :
			return 'hello world!';
		case 'default' : 
			return 'default';
		default :
			throw new Error();
	} 
}
```

### 开始做题

> [ ] + [ ]

进行ToPrimitive，两个都是Array对象，不是Date对象，所以以Number为转换标准，所以先调用valueOf()，结果还是[ ]，不是原始值，所以继续调用toString()，结果是“”原始值，将“”回。

第二个[ ]过程是相同的，返回“”。

加号两边结果都是String类型，所以进行字符串拼接，结果是“”。
	
> [ ] + { }

进行ToPrimitive，依然是以Number为转换标准。

[ ]的结果是“”。

{ }先调用valueOf()，结果是{ }，不是原始值，所以继续调用toString()，结果是“[object Object]”,是原始值，将“[object Object]”返回。

加号两边结果都是String类型，所以进行字符串拼接，结果是“[object Object]”。

>{ } + [ ]

这道题按照上一题的步骤，讲道理的话，结果应该还是“[object Object]”，但结果却如人意料——显示的答案是0！

这是什么原因呢？原来{ } + [ ]被解析成了{ };+[ ]，前面是一个空代码块被略过，剩下+[ ]就成了一元运算。[ ]的原值是""， 将""转化成Number结果是0。

>{ } + { }

这道题的结果在不同的环境下结果不一样。

在金丝雀版本的chrome浏览器和node中，结果符合预期。
结果是"[object Object][object Object]"。

在普通版本的chrome浏览器中结果是NaN。

这是为什么呢？原因是在node中会将以“{”开始，“}”结束的语句外面包裹一层( )，就变成了({ } + { })，结果就符合预期。而普通版本的chrome依然会解析成{};+{}，结果就变成了NaN。

>++[[ ]][+[ ]]+[+[ ]]

这道题第一眼看上去很鬼畜，接下来我们一步一步来拆解，最后会发现这道题一点也不鬼畜。（拆解只是用来理清思路，并不是真正的解析过程）。
1.	先拆分成A：++[[ ]][+[ ]]和B：[+[ ]]
2.	B式比较简单：[0]
3.	A式转换成++[[ ]][0]也就是++[ ]
4.	A式结果为1
5.	1 + [0]
6.	结果是"10"

## 自定义求原值

以上做得题的结果均基于默认的求原值方法，那么我们如何能自定义求原值的逻辑呢？

有两种方法，第一就是去改写valueOf和toString这两个方法，从而达到效果，另一种方法就是去重写或者新定义@@toPrimitive方法。

在之前有提到过@@toPrimitive是Well-Known Symbols中的一个key，事实上，Well-Knonw Symbols中一共有11个这样的key，作为索引供引擎去调用。

接下来我们来看一下如何给对象自定义求原值方法。

### 新定义@@toPrimitive方法

除了Symbol对象和Date对象，其他对象默认是没有@@toPrimitive方法的，如果我们想自定义一个，就要用下面的方法，例子中是给数组对象添加@@toPrimitive方法。

```javascript
Array.prototype[Symbol.toPrimitive] = function(hint){
	switch(hint){
		case 'number' :
			return 123;
		case 'string' :
			return 'hello world!';
		case 'default' : 
			return 'default';
		default :
			throw new Error();
	} 
}

var arr = [];
arr + 2;//"default2"
arr * 2;//"246"
String(arr);//"hello world!"
```

给Symbol或者Date对象重写@@toPrimitive方法需要用下面的方法，有一点要注意的是，Symbol和Date对象的@@toPrimitive方法，默认是可配置，不可写，不可枚举，所以要用defineProperty方法来重写，例子中是给Date对象重写@@toPrimitive方法

```javascript
//重写date1[Symbol.toPrimitive],date2作为对照
var date1 = new Date();
var date2 = new Date();
//强制重写
Object.defineProperty(date1,Symbol.toPrimitive,{
	value : function(hint){
		switch(hint){
			case 'number' : 
				return 123;
			case 'string' :
				return 456;
			case 'default' :
				return 'default2';
			default :
				throw new Error();
		}
	}
});

console.log(2 + date1);//2default2
console.log(2 * date2);//2912431204420
```