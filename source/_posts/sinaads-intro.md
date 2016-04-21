title: sinaads介绍
date: 2016-04-20 00:04:48
tags: [js, sinaads, ad, intro]
author: acelan
category: js
---
## 什么是sinaads
sinaads是用来支持sina统一商业广告的展现的脚本，主要实现通过发送广告统一资源码（PDPS），从投放引擎中获取广告对应的数据，在页面上展现广告的功能。

从前端的角度来看，统一广告脚本解决了旧sina投放方式将所有广告位相关数据注入在页面上，造成页面加载数据过多，浪费流量，以及需要人工控制投放时间，轮播数等可能出现的问题。

## sinaads支持的广告类型
根据资源分析，旧代码分析，目前sinaads支持以下几种sina常用的广告类型。

### 跨栏广告CoupletMedia
![跨栏广告](http://d9.sina.com.cn/litong/zhitou/img/CoupletMedia.jpg)
>1. 默认展现左右素材, 鼠标划过, 触发主素材;
>2. 默认左右素材紧贴浏览器边缘展现, 当(屏幕宽度 < 主素材宽度+左右素材宽度*2), 部分隐藏左右素材, 当(屏幕宽度 < 主素材宽度), 完全隐藏跨栏广告;
>3. 主素材居中展现,动画展开;
>4. 整体素材距离浏览器顶部高度可由默认配置项传值;
>5. 主素材关闭按钮触发后, 页面刷新之前, 鼠标划过左右素材, 不再展现主素材
>6. 左右任意素材关闭按钮触发后, 页面刷新前, 不再展现跨栏广告;

```javascript
xxx.push({
    params : {
        sinaads_couple_top : 10, //距离顶部高度
    }
});
```


### 视窗广告VideoWindowMedia
![视窗广告](http://d9.sina.com.cn/litong/zhitou/img/VideoWindowMedia.jpg)
>1. 视窗广告素材默认展现在浏览器窗口右下角,并跟随页面滚动;
>2. 触发关闭按钮, 页面刷新前, 不再展现视窗广告;

### 对联广告Float
![对联广告](http://d9.sina.com.cn/litong/zhitou/img/float.jpg)
>1. 默认展现左右素材
>2. 默认左右素材紧贴浏览器边缘展现, 当(屏幕宽度 < 内容页宽度+左右素材宽度*2), 部分隐藏左右素材, 当(屏幕宽度 < 内容页宽度), 完全隐藏对联广告;
>3. 整体素材距离浏览器顶部高度可由默认配置项传值;
>4. 左右任意素材关闭按钮触发后, 24小时内同频道不再展现对联广告;
xxx.push({
    params : {
        sinaads_float_top : 10, //距离顶部高度
    }
});
### 流媒体广告StreamMedia
![流媒体广告](http://d9.sina.com.cn/litong/zhitou/img/StreamMedia.jpg)
>1. 默认展示流媒体主素材, 素材默认透明度60%;
>2. 主素材展现位置位于浏览器可视区域居中, 默认展现8秒;
>3. 8秒展现时间耗尽 或 关闭按钮触发, 主素材隐藏, 显示回收位素材, 并带有重播和关闭按钮;
>4. 重播按钮触发后, 主素材再次显示, 重复 2 行为;
>5. 回收位的关闭按钮触发后, 页面刷新之前, 流媒体广告不再出现;


### 全屏广告FullscreenMedia
![全屏广告](http://d9.sina.com.cn/litong/zhitou/img/FullscreenMedia.jpg)
>1. 默认展示全屏广告主素材
>2. 素材位置于构建页面时预设, 默认展现8秒, 动画展开;
>3. 可根据配置文件预设,预留关闭按钮和回收位;
>4. 8秒展现时间耗尽 或 关闭按钮触发, 主素材隐藏, 动画收回
>5. 如3中, 配置了回收位,点击回收位再次重复播放广告;
>6. 回收位的关闭按钮触发后, 页面刷新之前, 全屏广告不再出现;
>7. 如3中没有配置回收位, 广告播放一次以后不再出现;
```javascript
sinaads_fullscreen_close : 1 //是否带展开关闭按钮
```

### 背投广告BpMedia
![背投广告](http://d9.sina.com.cn/litong/zhitou/img/BpMedia.jpg)
>1. 页面加载时会弹出独立浏览器窗口展现背投广告
>2. 背投广告不会主动切换到活动窗口
>3. 部分浏览器会默认拦截弹出窗口,需要手动触发

### 翻牌广告Turning
![翻牌广告](http://d9.sina.com.cn/litong/zhitou/img/turning.jpg)
>1. 翻牌广告默认只存在某些短顶通广告两侧
>2. 单个翻牌广告由多个素材轮播展现, 轮播间隔由配置文件设定
```javascript
sinaads_turning_flip_duration : 10, //翻页动画时间
sinaads_turning_flip_delay : 10, //翻页间隔秒数
sinaads_turning_wait : 10 //等待时间
```
### 普通块状广告EmbedMedia
![普通块状广告](http://d9.sina.com.cn/litong/zhitou/img/EmbedMedia.jpg)
>1. 块状广告按照页面预设位置,和引擎返回尺寸渲染广告;
>2. 不影响页面展现的广告位在无广告时收起;
>3. 影响页面布局的广告位在无广告投放时展现垫底广告;


## sinaads详细设计

### 投放方法
要投放一个广告，仅需要以下步骤：

1. 再sax系统中导入广告位信息，广告大小，类型都由PDPS映射，保存再sax管理系统中，广告埋点只关心PDPS代码。注：广告位类型对应的值见后面表格
[sinaads对应类型和值映射表](#sinaads%E5%AF%B9%E5%BA%94%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%80%BC%E6%98%A0%E5%B0%84%E8%A1%A8)

2. 在投放广告的位置填入下面的代码，其中data-ad-pdps=“xxxx”替换成该位置对应的统一资源码
```html
<!-- 可以只在头部引入该段代码一次， 如果不知道某个页面是否引入sinaads，可以整段引入，不会重复执行影响效率 -->
<script>
    (function (d, s, id) {
        var s, n = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        s = d.createElement(s);
        s.id = id;
        s.setAttribute('charset', 'utf-8');
        s.src = '//d' + Math.floor(0 + Math.random() * (9 - 0 + 1)) + '.sina.com.cn/litong/zhitou/sinaads/release/sinaads.js';
        n.parentNode.insertBefore(s, n);
    })(document, 'script', 'sinaads-script');
</script>
<!-- 埋点代码， 头部如果引入后每次只需要这两行 -->
<ins class="sinaads" data-ad-pdps="PDPS888888888888"></ins>
<script>(sinaads = window.sinaads || []).push({});</script>
```
> 注意：sinaads.js可以在head或者body最后统一一次引入（当然，类似上面，你可以在每个区块都引入），甚至在文档中间任意地方引入，不会造成广告无法加载异常，但是需要注意的是，广告真正开始渲染的时间取决于此js在什么时候加载完成（确切的说，是初始化完成）


如果这个广告位有特殊的设置，你还可以对上文中的push的对象进行详细配置，如下：
```javascript
(sinaads = window.sinaads || []).push({
    element : HTMLDOMElement, //广告填充的具体容器，如果没有指定，就是指它上面紧跟的那个ins容器
    params : {
        sinaads_ad_width : 100, //广告宽度
        sinaads_ad_height : 100, //广告高度，
        sinaads_ad_pdps : 'PDPS2222', //资源吗
        sinaads_couplet_top : 10, //针对跨栏广告，距离顶部的高度
        sinaads_ad_delay : 5, //广告展现延迟时间，只针对非嵌入式块状广告
        ...   //其他扩展属性
    }
});
```

如果页面上有许多的广告位，那么你可能需要对广告位进行批量请求，那么，在`<head>`标签内增加下面这段代码：(素组内容为需要批量加载的广告资源码)

```html
<script>
        var sinaadsPerloadData = [
            'PDPS000000047211', 
            'PDPS000000042135', 
            'PDPS000000006450',
            'PDPS000000042135'
        ];
</script>
```
### sinaads对应类型和值映射表
<table>
<tr><th>sax注册值</td><td>sinaads使用值</td><td>媒体类型</td></tr>
<tr><td>lmt</td><td>stream</td><td>流媒体</td></tr>
<tr><td>kl</td><td>couplet</td><td>跨栏</td></tr>
<tr><td>sc</td><td>videoWindow</td><td>视窗</td></tr>
<tr><td>hzh</td><td>embed</td><td>画中画</td></tr>
<tr><td>tl</td><td>embed</td><td>通栏</td></tr>
<tr><td>jx</td><td>embed</td><td>矩形</td></tr>
<tr><td>dtl</td><td>embed</td><td>短通栏</td></tr>
<tr><td>an</td><td>embed</td><td>按钮</td></tr>
 <tr><td>dan</td><td>embed</td><td>大按钮</td></tr>
 <tr><td>xan</td><td>embed</td><td>小按钮</td></tr> 
<tr><td>wzl</td><td>textlink</td><td>文字链</td></tr>
 <tr><td>ztwzl</td><td>textlink</td><td>智投文字链</td></tr>
 <tr><td>qp</td><td>fullscreen</td><td>全屏</td></tr>
 <tr><td>fp</td><td>turnig</td><td>翻牌</td></tr>
 <tr><td>dl</td><td>float</td><td>对联</td></tr>
 <tr><td>tip</td><td>tip</td><td>tip</td></tr>
 <tr><td>bt</td><td>bp</td><td>背投</td></tr>
 <tr><td>sx</td><td>follow</td><td>随行</td></tr>
 <tr><td>kzdl</td><td>coupletExt</td><td>扩展对联</td></tr>
</table>

### 控制广告播放顺序
sinaads支持按照广告位pdps来控制广告播放顺序，只需要在sinaads引入前声明下面的顺序配置即可
```html
<script>
    //设置本页面的富媒体类型的顺序, 默认配置顺序为全屏，流媒体，跨栏，背投，视窗
    var _SINAADS_CONF_PAGE_MEDIA_ORDER = ["PDPS000000000001", "PDPS000000002520", "PDPS000000006450", "PDPS000000051826", "PDPS000000052408"];
    //var sinaadsPageMediaOrder = ['fullscreen', 'stream', 'couplet', 'bp', 'videoWindow'];
</script>
```

### 页面静态数据模拟/不使用sax作为后端进行广告投放

```html
<!-- 在广告埋点代码前插入下面的模拟数据即可不通过sax投放静态广告数据 -->
<script>
_sinaadsCacheData = window._sinaadsCacheData || {};
_sinaadsCacheData['PDPS000000049826'] = {   //pdps
    "type" : "bp",   //sax使用类型，见相关映射表格
    "content" : [
        {
            "monitor":[""],  //点击监测
            "link":[""],   //落地页
            "type":["flash"],  //广告类型
            "pv":[],   //曝光监测
            "src":[
                "http://d1.sina.com.cn/201401/03/532368_BT-950-450-0103-LYYM.swf"  //素材，多个素材依次排列
            ]
        }
    ],
    "size":"950*450",  //广告尺寸
    "id":"PDPS000000049826"   //pdps
};
</script>
```
另外，如果需要轮播数据，可以直接再sinaads.push代码的参数中传递广告数组，以数组长度作为轮播数

```html
<script>
(sinaads = window.sinaads || []).push{   
     params : {
       sinaads_ad_data : [
          { "type" : "bp",   //sax使用类型，见相关映射表格
            "content" : [
              {
                 "monitor":[""],  //点击监测
                 "link":[""],   //落地页
                 "type":["flash"],  //广告类型
                 "pv":[],   //曝光监测
                 "src":[
                    "http://d1.sina.com.cn/201401/03/532368_BT-950-450-0103-LYYM.swf"  //素材，多个素材依次排列
                 ]
              }
           ],
           "size":"950*450",  //广告尺寸
           "id":"PDPS000000049826"   //pdps
         },
         //第二个轮播
         { "type" : "bp",   //sax使用类型，见相关映射表格
            "content" : [
              {
                 "monitor":[""],  //点击监测
                 "link":[""],   //落地页
                 "type":["flash"],  //广告类型
                 "pv":[],   //曝光监测
                 "src":[
                    "http://d1.sina.com.cn/201401/03/532368_BT-950-450-0103-LYYM.swf"  //素材，多个素材依次排列
                 ]
              }
           ],
           "size":"950*450",  //广告尺寸
           "id":"PDPS000000049826"   //pdps
         }
       ]
    }
});

</script>
```

### 进入预览模式
如果你想预览下某个广告创意再某个页面的展现，你可以这么在url上输入
```html
http://{pageurl}?sinaads_preview_pdps={pdps}&sinaads_preview_size={size}&sinaads_preview_src={src}&sinaads_preview_type={type}
```
上面的模版变量分别替换成下表所述
<table>
    <tr><th>变量名</th><th>说明</th></tr>
    <tr><td>{pageurl}</td><td>要预览的广告所在的页面</td></tr>
    <tr><td>{pdps}</td><td>预览的广告资源码</td></tr>
    <tr><td>{size}</td><td>预览广告的尺寸</td></tr>
    <tr><td>{src}</td><td>预览广告的src，多个src用‘|’分割</td></tr>
    <tr><td>{type}</td><td>预览广告src的类型，多个src对应的多个类型使用‘|’分割</td></tr>
</table>

例如下面这个例子，预览的是http://d3.sina.com.cn/rwei/news2013/news_100090_dt.html 这个资源地址的素材

http://d1.sina.com.cn/litong/zhitou/sinaads/preview.html?sinaads_preview_pdps=PDPS000000047211&sinaads_preview_size=1000*90&sinaads_preview_src=http://d3.sina.com.cn/rwei/news2013/news_100090_dt.html&sinaads_preview_type=url

### 进入调试模式
如果你想了解当前广告执行的详细过程，或者看到抛出的异常，在广告页面的url后面添加__sinaadToolkitDebug__参数即可
* ie7及以下，你可以看到下面的信息

![](https://raw.github.com/acelan86/whatthefuck/master/doc/images/KS{X8{1CII3022E~7{YJ4T6.jpg)
* 其他浏览器你可以在控制台中看到信息

![](https://raw.github.com/acelan86/whatthefuck/master/doc/images/CB311CD4-9097-4BA5-BC74-FEA68E0299CF.png)

### 主要流程
![](https://raw.github.com/acelan86/whatthefuck/master/doc/images/BF4D2768-DCA3-4CD7-AF97-31DA543B8AF9.png)

* 进入广告页面，如果js在head中声明，此时开始载入js
* 如果有需要预先批量加载的数据，此时声明sinaadPerloadData（这时候js可能还在载入中）
* 此时遇到广告位声明，即sinaads.push语句（这时候js可能还在载入中，此时sinaads是一个数组）
* 当js加载完毕后，判断是否有需要预先批量加载的数据声明，即sinaadPerloadData数组不为空，如果有，开始加载数据，没有，直接执行下一步
* 数据加载完毕或者无需加载数据，此时进入初始化流程，判断sinaads数组是否不为空（即，在js开始加载到加载完成的这段时间内，遇到了广告位声明），如果有，遍历sinaads数组，执行广告渲染方法_init, 如果没有，将sinaads重置成对象，并声明sinaads.push为渲染方法_init.(这里是关键所在)
* 进入渲染广告流程_init, 从页面上获取未完成的sinaads的广告标签，取得psps码，如果此pdps码的数据已经存在，则直接进入广告展现render，如果没有，进入该pdps的加载数据流程，完成后继续广告展现render
* 当js加载完成后，sinaads.push已经被重置成_init方法，此时如果继续遇到广告位声明，即sinaads.push语句，将立即进入上面的广告渲染流程_init
* 知道页面加载完毕，不存在没有渲染的广告位为止

### 接口数据
请求接口
```text
http://sax.sina.com.cn/impress?
    rotate_count=0&   //轮播数，递增种子
    adunitid=PDPS000000005564,PDPS000000001111& //pdps，一个或多个
    TIMESTAMP=1373868393016&   //时间戳
    referral=http%3A%2F%2Fsports.sina.com.cn%2F&  //广告所在页面
    tgkeywords=%2F%2F&     //关键词定向，用逗号分割
    tgentry=%2F%2F&  //入口定向
    tgtpl=%2F%2F&     //模板定向
    callback=_sinaads_cbs_4co73  //回调方法
```
响应接口
```json
{
  "ad" : [{
      "type" : "kl", //kl-跨栏 lmt-流媒体 sc-视窗 hzh-画中画 tl-通栏 jx-矩形 dtl-短通栏 an-按钮 wzl-文字链
      "content" : [
          {
              "src" : ["url1", "url2", "url3"],
              "link" : ["link1", "link2", "link3"],
              "type" : "url", //url, html, js, image, flash, text
              "pv" : ["pv1", "pv2", "pv3"],
              "monitor" : ["monitor1", "monitor2", "monitor3"]
           },
          ...
      ],
      "id" : "pdps code",
      "size" : "width*height"
  }],
  "mapUrl" : ["mapping1", "mapping2", "mapping3"]
}
```


### sinaads渲染广告内容的实现方案
sinaads支持以下几种类型的广告素材
* 图片image
* flash
* 文字text
* 资源地址url
* 代码片段html
* 脚本地址js
* adbox素材

其中：

* 图片素材可以简单通过`<img src="img url" />`展现
* flash素材可以通过`<embed>`或`<object>`展现
* 文字可以简单通过`<span>text</span>`展现
* 资源地址可以通过`<iframe src="url"></iframe>`展现
* adbox素材同资源地址

但是，对于代码片段，如果直接使用`innerHTML = html`片段的方式填充，可能会造成html片段中的样式，或者所包含的script脚本与页面冲突，因此不能直接填充，而对于js脚本地址类资源，也同样存在上述两个问题。js直接添加在head中还会造成一定的安全隐患。
另外，如果js或者html片段中有`document.write`的方法，还可能会造成已经完成加载的页面被写成空白。

因此，为了保证广告能正常展现，而且对主页面没有其他的影响，sinaads使用了沙箱（sandbox）的概念，将以上5中类型的素材都当作html片段来处理，即：

* 图片资源拼装成 `'<img src="img url"/>'`
* flash资源通过创建`'<embed>'`或`'<object>'`片段展现
* 文字拼装成`'<span>text</span>'`
* url拼装成`'<iframe src="url"></iframe>'`
* html片段直接使用
* js拼装成`'<script src="js"></script>'`
* adbox素材，同url

然后自建一个iframe节点，将上述内容填充到iframe的contentbody中。这样，间接的通过iframe构造了一个与外部隔离的沙箱环境，保护了主页面的干净不受影响，同时每个iframe只负责渲染当前的广告，没有其他内容。将document.write的影响降到了自身广告的级别中。

所以，sinaads创建的普通标准广告位都是存在于iframe中的，这个沙箱方法被提供在sinaadToolkit中（见sinaadToolkit.sandbox.create(....)）。

### sinaads曝光的实现方案
sinaads的曝光监测链接通过接口中content.pv传递给前端。
上文中提到每个广告都是存在于自建的iframe中，因此，pv的实现方案如下：

* 遍历pv数组，将每个pv拼装成html片段`'<iframe src="pv1"></iframe><iframe src="pv2"></iframe>....'`
* 在创建沙箱的同时，将pv片段和广告内容一同放入iframe的contentbody中，实现pv曝光的发送

> 注：见`sinaadToolkit.monitor.createImpressMonitor(pvs)`方法

> 需要注意的是，此处的曝光监测链接都是同步发出，并不是进行二跳

### sinaads点击监测的实现方案
sinaads的点击监测链接通过接口中的content.monitor传递给前端，并且，约定，只有提供了落地页content.link字段的广告才进行监测链接。
在上文提到的几种类型广告中：

* 图片类型广告拚装的时候在外部增加`'<a href="content.link" target="_blank" onclick="try{monitorCode}catch(e){}">...</a>'`
* flash素材在上面覆盖一层`'<a href="content.link" target="_blank" onclick="try{monitorCode}catch(e){}">...</a>'`
* 文字类型广告同图片类型处理

其他类型素材暂不支持点击监测。

> 注意：adbox虽然也属于url的一种，但由于adbox素材自身有对外接口实现点击监测，因此它的点击监测是可以实现的，具体见https://github.com/acelan86/pandora/wiki/%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E#%E6%8A%95%E6%94%BE%E5%B9%BF%E5%91%8A%E8%AF%B4%E6%98%8E

其中，monitorCode通过`sinaadToolkit.monitor.createClickMonitor(type, monitor)`方法生成, 做法如下：
* 对于图片，文字，flash类型广告，生成的监测字符串为`sinaadToolkit.sio.log(monitorurl)`，这个字符串被放在onclick中随点击事件执行
* 对于adbox素材，生成的监测字符串为`api_exu=monitorurl`, 这个字符串被放在iframe的name字段中，随后由adbox自身监测脚本接管，完成点击监测的发送

> 需要注意的是，此处的monitor监测链接都是同步发出，并不是进行二跳

### 关于广告用iframe填充的脚本细节
一般来说，对于标准浏览器，页面脚本创建的空iframe不会产生跨域，因此可以用以下方法进行内容填充:
```javascript
              /**
               * 代码段1， 处理标准浏览器的iframe填充
               */
              try {
                    doc = iframe.contentWindow ?
                            iframe.contentWindow.document : 
                            iframe.contentDocument, sinaadToolkit.browser.firefox && doc.open("text/html", "replace");
                       doc.write(content);
                       doc.close();
                } catch(e) {
                    sinaadToolkitthrowError("sinaadToolkit.iframe.fill: 无法使用标准方法填充iframe的内容, ", e);
                }
```
而对于ie浏览器，页面脚本创建的空iframe分为两种情况
* 页面没有声明document.domain, 这时候不会产生跨域情况，因此可以使用下面的方法进行填充：
```javascript
                       /**
                        * 代码段2， 处理ie下主页面不设置document.domain情况的iframe填充
                        */
                       try {
                        //ie > 6
                        if (ie > 6) {
                            window.frames[iframe.name].contents = content;
                            iframe.src = 'javascript:window["contents"]';
                        // ie < 6
                        } else {
                            window.frames[iframe.name].contents = content;
                            iframe.src = 'javascript:document.write(window["contents"]);/* document.close(); */';
                        }
                    } catch(e) {
                        sinaadToolkitthrowError("sinaadToolkit.iframe.fill: 无法往ie的iframe中写入内容, ", e);
                    }
```
* 页面声明document.domain，这时候脚本创建的空iframe会产生跨域，无法填充内容，因此，可以通过给脚本生成的iframe也设置document.domain的方式尝试进行数据填充，如下：
```javascript

                    /**
                     * 代码段3， 处理ie下主页面设置document.domain情况的iframe填充
                     */
                    try {
                        var key = "sinaads-ad-iframecontent-" + sinaadToolkit.rnd();
                        window[key] = content;
                        content = 'var adContent = window.parent["' + key + '"];window.parent["' + key + '"] = null;document.write(adContent);';
                        content = sinaadToolkit.browser.ie && sinaadToolkit.browser.ie <= 6 ? 
                             "window.onload = function() {"
                                + "document.write(\\'<sc\\' + \\'ript type=\"text/javascript\">document.domain = \"" + document.domain + '";' + content + "<\\/scr\\' + \\'ipt>\\');"
                                + "document.close();"
                            + "};" :
                             'document.domain = "' + document.domain + '";'
                            + content
                            + "document.close();";

                        iframe.src = 'javascript:\'<script type="text/javascript">' + content + "\x3c/script>'";
                    } catch(e) {
                        window[key] = null;
                        sinaadToolkitthrowError("sinaadToolkit.iframe.fill: 无法通过修改document.domain的方式来填充IE下的iframe内容, ", e);
                    }
```

因此综上逻辑，我们可以得到脚本自建iframe填充的全部分支代码如下：
```javascript
        /**
         * 往iframe中填充内容
         * @param  {HTMLIframeElement} iframe  iframe节点
         * @param  {String} content 要填充的内容
         */
        fill : function (iframe, content) {
            var doc,
                ie = sinaadToolkit.browser.ie;
            //ie
            if (ie) {
                //是否可以获取到iframe的document, 即是否在ie浏览器中主页面设置了document.domain
                try {
                    doc = !!iframe.contentWindow.document
                } catch(e) {
                    doc = false;
                }
                if (doc) {
                    //这里为上面的代码段2
                } else {
                    //这里为代码段3
                }
            } else {
               //这里为代码段1
            }
        }
```
具体代码见`sinaadToolkit.iframe.fill`

### 对于非块状媒体类型广告的展现
非块状媒体类型广告包括上面说到的视窗广告，流媒体广告（流媒体，疯狂流媒体），全屏广告，跨栏广告，背投广告。这些广告直接展现在主页面中，如果通过iframe投放，需要作为代码片段投放，且代码中引用的window需全部修改成`parent.window`或`top.window`。否则广告将被展现在frame区块中，与正常展现不符。

而如果采用`parent.window`的修改方案，第三方富媒体公司输出的脚本都必须进行修改才能正常投放。而且会出现一些非预期的问题，增加麻烦
另外，由于该媒体类型广告通常为可信任广告，因此针对这些类型的广告，最终采用了直接在页面上展现的方案。

媒体类型通过数据接口中的ad.type字段给出，处理方式如下：
#### 跨栏(couplet, kl)
对于`ad.type === 'couplet'(kl)` 跨栏，我们约定当ad.content.src只有1个元素，且类型为js时，为富媒体供应商提供的跨栏脚本，因此通过下面的方法投放
```javascript
if (content.src.length === 1 && conent.type[0] === 'js') {
    core.sio.loadScript(content.src[0]);
}
```
当ad.content.src多于1个元素时，我们判断为直接投放素材，因此通过我们自己实现的CoupletMedia类来构建跨栏对象
```javascript
                    if (content.src.length > 1) {
                        //注入跨栏数据
                        var CoupletMediaData = {
                            src         : content.src,
                            type        : content.type,
                            link        : content.link,
                            top         : config.sinaads_couple_top || 0,
                            // mainWidth   : width,
                            // mainHeight  : height,
                            // sideWidth   : 120,
                            // sideHeight  : 270,
                            monitor     : content.monitor || [],
                            delay       : config.sinaads_ad_delay || 0
                        };
                        core.sio.loadScript('./src/plus/CoupletMedia.js', function () {
                            new core.CoupletMedia(CoupletMediaData);
                        });
                        content.src = [];
                    }
```
为防止非预期数据格式造成页面渲染问题，其他情况不做处理（注意，此时仍然会发曝光，这是个问题，没想好怎么改）


#### 流媒体（stream, lmt）
同跨栏，当data.content.src.length === 1且类型为js时，我们约定此流媒体为富媒体供应商提供的js脚本实现
```javascript
                   if(content.src.length === 1 && content.type[0] === 'js'){
                        //富媒体供应商提供的js
                        //生成一个用于渲染容器到页面中
                        var streamContainer = document.createElement('div');
                        streamContainer.id = 'SteamMediaWrap';
                        document.body.insertBefore(streamContainer, document.body.firstChild);
                            
                        core.sio.loadScript(content.src[0]);
                    }
```
当data.content.src.length >= 1时，我们认为此时的流媒体提供的是素材
```javascript
                    if (content.src.length > 1) {
                        //注入流媒体数据
                        var StreamMediaData = {
                            main : {
                                type    : 'flash',
                                src     : 'http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fc1715.swf',
                                link    : 'http://sina.com.cn',
                                width   : width,
                                height  : height
                            },
                            mini : {
                                src     : 'http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fb1.swf',
                                type    : 'flash',
                                link    : 'http://sina.com.cn'
                            },
                            delay : config.sinaads_ad_delay || 0
                        };
                        core.sio.loadScript('./src/plus/StreamMedia.js', function () {
                            new core.StreamMedia(StreamMediaData);
                        });
                    }
```
需要注意的问题同跨栏

#### 视窗（videoWindow）
同上

#### 全屏（fullscreenMedia）
同上

#### 背投（bpMedia）
背投采用widnow.open打开一个新的页面，注意浏览器会拦截此类广告，检查时请记得关闭弹窗拦截
```javascript
window.open('http://d1.sina.com.cn/d1images/pb/pbv4.html?' + content.link[0] + '${}' + content.type[0] + '${}' + content.src[0]);
```


## 功能检查说明
### 跨栏广告
1. 构造引擎返回数据如下：
```json
//跨栏广告
_sinaadsCacheData["PDPS000000006450"] = {
    size : "1000*90",
    type : 'couplet',
    content : [
        {
            pv : ['http://123.126.53.109/click?type=3&t=MjAxMy0wOC0xOSAwO',  //曝光地址
            type : ['image', 'image', 'image'],   //素材类型
            src : [
                'http://d1.sina.com.cn/201307/31/504121_100090news_tl04_0801.jpg', //中部大图
                'http://d5.sina.com.cn/201307/31/504120_25300ls_kl_bt_0801.jpg',   //左边栏
                'http://d5.sina.com.cn/201307/31/504120_25300ls_kl_bt_0801.jpg'    //右边栏
            ],
            monitor : ["http://stream.com"],  //点击监控地址
            link : ['http://stream.com', 'http://stream.sina.com.cn']  //素材链接
        }
    ]
};
```


2.构造测试页面，并在测试页面中要展现跨栏广告的位置插入如下代码：
```html
<script async charset="utf-8" src="http://d1.sina.com.cn/litong/zhitou/sinaads/src/sinaads.js"></script>
<ins class="sinaads" data-ad-pdps="PDPS000000006450"></ins>
<script>
    (sinaads = window.sinaads || []).push({});
</script>
```

3. 刷新测试页面，查看广告是否正常展现，需要检查

* 跨栏正确展现，按照上面说明检查（交互，即缩放页面）
* 曝光是否正常，是否发送的是构造数据中提供的曝光
* 鼠标移上两边栏，是否正确展现中间主广告
* 点击两侧或中间的素材，是否发送正确曝光

4. 只提供两个素材（主，边素材），是否正确展现，此时，右侧素材应该同左侧边素材

5. 将素材换成swf格式是否依然正确，检查3中所有点


### 全屏广告
同跨栏广告检查逻辑
src素材列表换成只有一个数组元素

### 视窗广告
同跨栏广告检查逻辑
src素材列表换成只有一个数组元素

### 流媒体广告
同跨栏广告逻辑
src素材列表换成只有两个数组元素（主，次）

### 对联广告
同跨栏广告检查逻辑
src素材列表只有两个元素（左右）

### 嵌入块状广告
* 嵌入块状广告均只有一个素材，即src里面只有一个数组元素
* 根据数据格式意义，构造image类型，flash类型，url类型，adbox类型，js类型，html片段类型广告素材，并检查
* 广告是否正常展现
* 点击链接是否正确
* 曝光是否正确
* 构造多轮数据，是否正常展现
* 构造dsp和network数据，检查广告是否正常展现


### 其他逻辑
#### 数据批量请求逻辑检查
在页面head处添加如下代码，表明需要批量请求数据
```html
<script>
        var sinaadsPerloadData = [
            'PDPS000000047211', 
            'PDPS000000042135', 
            'PDPS000000006450'
        ];
    </script>
//批量请求'PDPS000000047211', 'PDPS000000042135', 'PDPS000000006450'数据
```
* 检查批量请求是否正确，数据格式如下：
```json
{ad : [
   {
     id : 'pdpsxxxx',
     content : [{
          monitor : [],
          pv : [],
          src : [],
          link : [],
          type : [] 
     }]
   },
   {
     id : 'pdps2222',
     content : [...]
   }
],
mapurl : []
}
```

* 检查这三个广告为对应的广告是否正常展现

* 检查后续遇到相同pdps是否会重复请求（正常为不重复请求）


> 以上检查逻辑建议在ie6，7，8，9，10，chrome，firefox下执行
> 主页面添加document.domain重新测试一遍上面所有内容
 

## 一些记录
* 通过iframe.fill写入的文档片段`<script src="xxx"></script>`加载的顺序在ie6-8中为异步，因此它后面的'<script></script>'要引用到前面js的内容时，需要等待前面js加载完，最好使用window.onload进行处理。否则会出问题。


## LEJU嵌入广告位的接管方法
1. 同普通嵌入广告为在页面埋点
2. 投放一轮代码如下：

```html
<div id="Container"></div>
<script charset="utf-8" src="http://d1.sina.com.cn/litong/zhitou/sinaads/release/sinaadToolkit.js"></script>
<script>
    var pos = "14448";
    function fold() {
        parent.document.getElementById(sinaadToolkitSandboxId).parentNode.parentNode.style.display = "none";
    }
    var timer = setInterval(function () {
        if (sinaadToolkit) {
             clearInterval(timer);
             parent.lejuMedia.then(function (data) {
                 var data = data[pos];
                 if (data && data[0] && (data = data[0].params)) {
                     document.getElementById("Container").innerHTML = sinaadToolkit.ad.createHTML(sinaadToolkit.ad.getTypeBySrc(data.src), data.src, sinaads_ad_width, sinaads_ad_height, data.link);
                 } else {
                     fold();
                 }
             }, function () {
                 fold();
             });
       }
   }, 100);
</script>
```

其中pos根据乐居页面不同修改成对应的id即可

* PDPS000000049428 ad_5679 邮箱首页


## LEJU跨栏广告位接管方法
1、同嵌入页面方式埋点
2、投放一轮cpd投放如下：

```html
<script> 
var sinaadsLejuCoupletID = "couplet"
lejuMedia.then(function (data) { 
    var data = data[sinaadsLejuCoupletID]; 
    if (data && data[0] && (data = data[0].params)) {
        //注入跨栏数据
        var CoupletMediaData = {
            src: [data.bar, data.left, data.right],
            type: [
                sinaadToolkit.ad.getTypeBySrc(data.bar), 
                sinaadToolkit.ad.getTypeBySrc(data.left),
                sinaadToolkit.ad.getTypeBySrc(data.right)
            ],
            link: [data.link],
            mainWidth: 1000,
            mainHeight: 90, 
            top: 43 || 0, 
            monitor: []
        }; 
        if (sinaadToolkit.CoupletMediaData) { 
            new sinaadToolkit.CoupletMedia(CoupletMediaData);
        } else { 
            sinaadToolkit.sio.loadScript(
                sinaadToolkit.RESOURCE_URL + "/release/plus/Media.js", 
                function () {
                    new sinaadToolkit.CoupletMedia(CoupletMediaData); 
                }
            ); 
        } 
    } else {
       try {
           sinaadsROC.done('pdps');
       } catch(e) {
            //hack sax bug, it will change {} 2 []
       }
    }
});
</script>
```



## 文章内画中画200*300

1、逻辑通用, 仅更换divid及pdps


```javascript
//coding by lingchen on Oct 27th 2012

//正文中有新组件容器需要过滤时请搜索“黑名单容器class”添加

var hzh = {};

hzh.flag = 0;

hzh.divid = "ad_49447";

hzh.pdps = "PDPS000000049447";

hzh.surround_num = 800; //环绕文字最优字符总数

hzh.str_sum = 0;

hzh.str_temp = 0; 

hzh.p_num = 0; //正文页p标签节点个数

hzh.nodes = []; //所有子节点

hzh.p_node = [];//子节点的p标签数组（不包含孙节点）

hzh.img_num = null;

//hzh.$ = function(id){return document.getElementById(id);}

hzh.$ = function(vArg){

    this.elements = [];

    switch(typeof vArg){

        case 'function': //window.onload = vArg

            hzh.addEvent(window,'load',vArg);

            break;

        case 'string':

            switch(vArg.charAt(0)){

                case '#': //id

                    var obj = document.getElementById(vArg.substring(1));

                    return obj;

                    break;

                case '.': //class

                    this.elements = hzh.getClass(document,vArg.substring(1));

                    return this.elements;   

                    break;

                default: //tagName  

                    this.elements = document.getElementsByTagName(vArg);

                    return this.elements;   

            }

            break;

        case 'object':

            this.elements.push(vArg);

            return this.elements;   

    }

}

hzh.getClass = function(oParent,sClass){

    var parent = oParent || document;

    var re = new RegExp('\b'+sClass+'\b');

    var aEles = parent.getElementsByTagName('*');

    var arr = [];

    for(var i=0; i<aEles.length; i++){

        if(re.test(aEles[i].className)){arr.push(aEles[i]);}

    }

    return arr;

}

hzh.addEvent = function(obj, sEv, fn){

    if(obj.attachEvent){

        obj.attachEvent('on'+sEv,function(){

            fn.call(obj);   

        }); 

    }

    else{

        obj.addEventListener(sEv, fn, false);   

    }

}

hzh.main_container = hzh.$("#artibody"); //正文主容器

hzh.p = hzh.main_container.getElementsByTagName("p"); //子孙节点的p标签数组

hzh.div = hzh.main_container.getElementsByTagName("div"); //子孙节点的div标签数组

hzh.className = 'otherContent_01';

hzh.cssText = 'display:none;width:200px; height:300px; margin:10px 20px 10px 0px; float:left; overflow:hidden; clear:both; padding:4px; border:1px solid #CDCDCD;';

hzh.zhengwen_div = hzh.main_container.getElementsByTagName("div"); //子孙节点的div标签数组

hzh.noAD = hzh.$("#noAD");

hzh.ua = navigator.userAgent.toLowerCase();

hzh.isIE6 = /msie 6/.test(hzh.ua);

hzh.isIE7 = /msie 7/.test(hzh.ua);

hzh.iOS = /\((iPhone|iPad|iPod)/i.test(hzh.ua);

hzh.iOS_tag = 1;

//获取cookie

hzh.getAdCookie = function(N){

    var c=document.cookie.split("; ");

    for(var i=0;i<c.length;i++){var d=c[i].split("=");if(d[0]==N)return unescape(d[1]);}

    return "";

};

hzh.removeHTMLTag = function(str) {//过滤字符串里的tag，空白等

    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag

    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白

    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行

    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;

    return str;

}

hzh.Len = function(str){ //计算字符数

     var i,sum;

     sum=0;

     for(i=0;i<str.length;i++){

         if ((str.charCodeAt(i)>=0) && (str.charCodeAt(i)<=255))

             sum=sum+1;

         else

             sum=sum+2;

     }

     return sum;

}

hzh.insertAfter = function(newElement,targetElement) { //封装的后插函数

    var parent = targetElement.parentNode;

    if (parent.lastChild == targetElement) {

        //如果最后的节点是目标元素，则直接添加。

        parent.appendChild(newElement);

    }else {

        //如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面。

        parent.insertBefore(newElement,targetElement.nextSibling);

    }

}

hzh.createHzh = function(){ //创建画中画广告容器（div标签）

    var oDiv = document.createElement("div");

    oDiv.id = hzh.divid;

    oDiv.className = hzh.className;

    oDiv.style.cssText = hzh.cssText;

    oDiv.innerHTML = '<ins class="sinaads" id="Sinads49447" data-ad-pdps="'+hzh.pdps+'"></ins>';

    return oDiv;    

}

hzh.createSpanHzh = function(){ //创建画中画广告容器（span标签）

    var oDiv = document.createElement("span");

    oDiv.id = hzh.divid;

    oDiv.className = hzh.className;

    oDiv.style.cssText = hzh.cssText;

    oDiv.innerHTML = '<ins class="sinaads"  id="Sinads49447" data-ad-pdps="'+hzh.pdps+'"></ins>';

    return oDiv;    

}

hzh.insertAd_after = function(insert_p){ //后插广告

    var cur_p = insert_p;

    hzh.insertAfter(hzh.createHzh(),cur_p);

}

hzh.insertSpanAd_after = function(insert_p){ //后插广告(span)

    var cur_p = insert_p;

    hzh.insertAfter(hzh.createSpanHzh(),cur_p);

}

hzh.insertAd_before = function(thisDiv){ //前插广告

    var parent = thisDiv.parentNode;

    parent.insertBefore(hzh.createHzh(),thisDiv);

}

hzh.insertClear =function(insert_p){ //插入清除浮动div

    //清浮动div

    var oDivClear = document.createElement("div");

    oDivClear.style.fontSize = "0px";

    oDivClear.style.height = "0px";

    oDivClear.style.clear = "both";

    var last_p = insert_p;

    hzh.insertAfter(oDivClear,last_p);

}

hzh.nodePage = hzh.$(".page")[0];

hzh.nodeShare = hzh.$("#sinashareto");

//判断主容器里是否有分页容器

hzh.hasPage = function(){

    if(hzh.nodePage){

        return true;

    }else{

        return false;

    }

}();

//判断主容器里是否有分享容器

hzh.hasShare = function(){

    var shareFlag = false;

    for(var i=0;i<hzh.div.length;i++){

        if(hzh.div[i].id=="sinashareto"){

            shareFlag = true;

            break;  

        }

    }

    return shareFlag;

}();

hzh.yule_node = null;

for(var i=0;i<hzh.div.length;i++){

    if(hzh.div[i].innerHTML.indexOf('查看更多美图请进入娱乐幻灯图集')!=-1){

        hzh.yule_node = hzh.div[i].parentNode;

    }

}

//步骤1：筛选出主容器内在分页容器或分享容器之上所有子节点(不包含文本节点)

for(var i=0;i<hzh.main_container.childNodes.length;i++){

    if(hzh.main_container.childNodes[i].nodeType==1){

        var sel_childNodes = hzh.main_container.childNodes[i];

        //判断主容器里是否有“查看更多美图请进入娱乐幻灯图集”节点

        var yule_txt = '查看更多美图请进入娱乐幻灯图集';

        if(sel_childNodes.id=="sinashareto" || sel_childNodes.innerHTML.indexOf(yule_txt)!=-1 || sel_childNodes.className=="page"){

            break;

        }else{

            hzh.nodes.push(hzh.main_container.childNodes[i]);

        }

    }

}

//步骤2：

for(var i=hzh.nodes.length-1;i>=0;i--){

    var zhengwen_img_arr = hzh.nodes[i].getElementsByTagName("img");

    var zhengwen_p_script_arr = [];

    var zhengwen_p_align = false;

    if(hzh.nodes[i].nodeName.toLowerCase() == 'p'){

        zhengwen_p_script_arr = hzh.nodes[i].getElementsByTagName("script");

        if(hzh.nodes[i].getAttribute("align")=='center'){

            zhengwen_p_align = true;

        }

    }

    var zhengwen_table_node = hzh.nodes[i].nodeName.toLowerCase();

    var zhengwen_child_table_node = hzh.nodes[i].getElementsByTagName("table");

    var zhengwen_node_class = hzh.nodes[i].className;

    var nodeClassTag = false;

    //黑名单容器class

    var classList = ['weiboListBox otherContent_01','contentPlayer','blk_video_news','hdFigureWrap','artical-player-wrap','sdFigureWrap','img_wrapper'];

    for(var k=0;k<classList.length;k++){

        if(zhengwen_node_class==classList[k]){

            nodeClassTag = true;

            break;  

        }

    }

    //筛选出主容器内第一个白名单子节点在整个子节点中的位置（排除含有jpg图片，script标签，table标签，微博容器，“p标签里有居中属性”以及它以上的节点）

    if((zhengwen_img_arr[0] && (zhengwen_img_arr[0].src.indexOf(".jpg")!=-1 || zhengwen_img_arr[0].src.indexOf(".png")!=-1)) || zhengwen_table_node=="table" || zhengwen_child_table_node[0] || zhengwen_p_script_arr[0] || zhengwen_p_align==true || nodeClassTag == true){

        hzh.img_num = i+1;

        break;

    }

    else{

        hzh.img_num = i;

    }

}

//步骤3：筛选剩余子节点中标签名为p的节点

for(var i=hzh.img_num;i<hzh.nodes.length;i++){

    if(hzh.nodes[i].nodeName.toLowerCase() == 'p'){

        hzh.p_node.push(hzh.nodes[i]);

    }

}

if(hzh.p_node.length>0){

    for(i=0;i<hzh.p_node.length;i++){ 

        var html = hzh.p_node[i].innerHTML; 

        var txt = hzh.removeHTMLTag(html);

        var p_str_num = hzh.Len(txt);

        hzh.str_sum += p_str_num;

        hzh.p_num++;

    }

}

if(!hzh.noAD){

    //ie6,7下判断是否有视频容器，有就直接插在视频容器的后面(并且使用span容器标签)

    //左浮动容器，样式名blk_ntchack1

    var lFloatArr = hzh.$('.blk_ntchack1');

    var lFloatTarget = null;

    if(lFloatArr.length==1){

        lFloatTarget = lFloatArr[0];    

    }else if(lFloatArr.length>1){

        lFloatTarget = lFloatArr[lFloatArr.length-1];   

    }

    if((hzh.isIE6||hzh.isIE7) && lFloatTarget||( hzh.$("#p_player")||(hzh.$("#J_Article_Player")&&hzh.$("#J_Article_Player").parentNode.className.indexOf('blk_video_news')!=-1))){

        if(hzh.$("#p_player")){

            var oSpan = hzh.$("#p_player").parentNode;

            hzh.insertSpanAd_after(oSpan);

        }else if(lFloatTarget){

            hzh.insertSpanAd_after(lFloatTarget);

        }

        else{

            var oSpan = hzh.$("#J_Article_Player").parentNode;

            hzh.insertSpanAd_after(oSpan);

        }

    }

    else{

        //筛选出的p个数为0时将广告插在分页容器之上；如果没有分页，插入分享容器之上；如果没有分享容器，直接插在主容器的最后

        if(hzh.p_node.length<1){

            if(hzh.hasPage == true){

                hzh.insertAd_before(hzh.nodePage);

                hzh.insertClear(hzh.$("#"+hzh.divid));

            }else if(hzh.yule_node){ //娱乐频道特殊节点

                hzh.insertAd_before(hzh.yule_node);

                hzh.insertClear(hzh.$("#"+hzh.divid));

            }else if(hzh.hasShare == true){

                hzh.insertAd_before(hzh.nodeShare);

                hzh.insertClear(hzh.$("#"+hzh.divid));

            }else{

                hzh.main_container.appendChild(hzh.createHzh());

                hzh.insertClear(hzh.$("#"+hzh.divid)); 

            }

        }

        //筛选出的p个数为1时将广告插在该p的前面 

        else if(hzh.p_node.length==1){

            hzh.insertClear(hzh.p_node[hzh.p_node.length-1]);

            hzh.insertAd_before(hzh.p_node[hzh.p_node.length-1]);

        }

        //筛选出的p个数大于1时进行文字个数计算

        else if(hzh.p_node.length>1){

            //字符总数小于最佳环绕数，插在第一个p的前面

            if(hzh.str_sum<=hzh.surround_num){

                hzh.insertClear(hzh.p_node[hzh.p_node.length-1]);

                hzh.insertAd_before(hzh.p_node[0]);

            }else{

                //字符总数大于hzh.surround_num，从后向前遍历选出的p里的字符数，总和超过800后，广告插在该p的前面

                for(var i=hzh.p_num-1; i>=0; i--)

                {

                    var txt_last = hzh.removeHTMLTag(hzh.p_node[i].innerHTML);

                    var txt_last_num = hzh.Len(txt_last);

                    hzh.str_temp += (parseInt(txt_last_num/30) + 1)*30;

                    if(hzh.str_temp < hzh.surround_num){

                        hzh.p_num--;

                    }

                    else{

                        hzh.insertClear(hzh.p_node[hzh.p_node.length-1]);

                        hzh.insertAd_before(hzh.p_node[hzh.p_num-1]);

                        break;

                    }

                }

            }

        }

    }

}

hzh.hzh_div = hzh.$("#"+hzh.divid);

(function(){

    var adScript = document.createElement('script');

    adScript.src = 'http://d9.sina.com.cn/litong/zhitou/sinaads/release/sinaads.js';

    document.getElementsByTagName('head')[0].appendChild(adScript);

})();

(sinaads = window.sinaads || []).push({
    element: document.getElementById('Sinads49447'),

    params : {

      sinaads_success_handler : function () { 

            if(hzh.iOS&&(hzh.hzh_div.innerHTML.toLowerCase().indexOf('.swf')!=-1||hzh_div.innerHTML.toLowerCase().indexOf('<iframe')!=-1)){

                hzh.hzh_div.style.display = 'none'; 

            }else{

                hzh.hzh_div.style.display = 'block'; 

            }

            /*try{

                _ssp_ad.load(hzh.divid,function(){

                    hzh.hzh_div.style.display = 'none';

                });

            }catch(e){

                hzh.hzh_div.style.display = 'none';

            }*/

      },

      sinaads_fail_handler : function () {

      }

    }   

});
```