title: cut-and-copy-commands
date: 2016-04-14 13:33:23
tags: js, cut, copy, chrome
author: acelan
---
>本文根据https://developers.google.com/web/updates/2015/04/cut-and-copy-commands翻译

IE10及以上通过`Document.execCommand()`方法提供了`cut`和`copy`的命令支持。在Chrome43的版本里，Chrome也支持了这个命令。

当这个命令被执行的时候任何在浏览器中被选中的文本都会被剪切或者拷贝到用户的剪贴板里。这个方法让你能够提供给用户一个简单的方法来选中部分文本并拷贝到剪贴板。

它在跟Selection API联合使用，以编程的方式来决定选中那些文本应该被选中并拷贝到剪贴板的时候相当有用，接下来我们能看到更多细节。

### 简单的例子

为了举个例子，让我们添加一个按钮用来拷贝一个email到剪贴板。

我们添加一个email地址和一个复制按钮在HTML中：

```html
<p>Email me at <a class="js-emaillink" href="mailto:matt@example.co.uk">matt@example.co.uk</a></p>

<p><button class="js-emailcopybtn"><img src="./images/copy-icon.png" /></button></p>
```

然后在javascript中，我们给按钮添加一个click事件，当我们点击按钮的时候从js-emaillink中选中email地址，执行copy命令让email地址拷贝到剪贴板然后立刻取消掉对email地址的选择以保证用户看不到我们选中过程的发生。

```javascript
var copyEmailBtn = document.querySelector('.js-emailcopybtn');  
copyEmailBtn.addEventListener('click', function(event) {  
  // Select the email link anchor text  
  var emailLink = document.querySelector('.js-emaillink');  
  var range = document.createRange();  
  range.selectNode(emailLink);  
  window.getSelection().addRange(range);  

  try {  
    // Now that we've selected the anchor text, execute the copy command  
    var successful = document.execCommand('copy');  
    var msg = successful ? 'successful' : 'unsuccessful';  
    console.log('Copy email command was ' + msg);  
  } catch(err) {  
    console.log('Oops, unable to copy');  
  }  

  // Remove the selections - NOTE: Should use
  // removeRange(range) when it is supported  
  window.getSelection().removeAllRanges();  
});
```

我们所做的这些使用了Selection API的方法，`window.getSelection()`用程序来为锚点的文本设置选中区域，也就是想要被拷贝到剪贴板中的文本。调用`document.execCommand()`后，我们可以通过调用`window.getSelection().removeAllRanges()`来取消选中区域。

如果你想要确认这一切是否如预期工作，你可以测试`document.execCommand()`的返回，如果这个命令不被支持，它会返回false。由于在某些场景cut和copy的时候可能会抛出异常，所以我们把`execCommand()`放在try，catch中。

`cut`命令能够被用在文本域中当你想要移除文本内容并且让它存放在剪贴板的时候。

在HTML中使用textarea和一个按钮：

```html
<p><textarea class="js-cuttextarea">Hello I'm some text</textarea></p>

<p><button class="js-textareacutbtn" disable>Cut Textarea</button></p>
```

我们用下面的方法来执行剪切

```javascript
var cutTextareaBtn = document.querySelector('.js-textareacutbtn');

cutTextareaBtn.addEventListener('click', function(event) {  
  var cutTextarea = document.querySelector('.js-cuttextarea');  
  cutTextarea.select();

  try {  
    var successful = document.execCommand('cut');  
    var msg = successful ? 'successful' : 'unsuccessful';  
    console.log('Cutting text command was ' + msg);  
  } catch(err) {  
    console.log('Oops, unable to cut');  
  }  
});
```

### queryCommandSupported 和 queryCommandEnabled
调用`document.execCommand()`之前, 你应该用`document.queryCommandSupported()`方法来确认这个API是被支持的。在上面的例子中，我们能够基于支持情况来给按钮设置disabled状态，如下：

```javascript
copyEmailBtn.disabled = !document.queryCommandSupported('copy');
```

`document.queryCommandSupported()`和`document.queryCommandEnabled() `的区别在于前者表示浏览器是否支持cut和copy命令，后者表示cut和copy是否能够使用。
>以上没有按照文章原有的内容来翻译，译者尝试了一下，大概是这样的意思：supported表示浏览器是否支持该特性，不管是否选中文本。enabled只有在选中文本的情况下才返回true，且如果当前选中文本不能被移除，比如在普通的html中而不是editable或者文本域中，cut返回false，这个跟我们的期望的行为一致。

他们在某些场景中很有用，当你没有通过程序来设置选中区域的时候来确认命令是否能按预期执行，否则给用户显示一个信息。

### 浏览器支持情况
* IE 10+
* Chrome 43+
* Firefox 41+
* Opera 29+

safari不支持这些命令（现在貌似已经支持了，译者）

