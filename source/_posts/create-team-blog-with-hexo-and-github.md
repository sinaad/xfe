---
title: 使用hexo和github创建团队博客
date: 2016-02-18 22:07:44
tags: [hexo,github,blog]
categories: other
author: acelan
---

为了沉淀团队技术分享，所以最近需要创建一个前端团队博客，确定了下面几个目标：

* 免费自由的空间，同时正好利用之前创建sinaad这个github组织，所以选用`github`作为承载空间
* `markdown`是一种对码农来说比较自然的写博文的方式

找了一圈后，确定jeklly或者hexo，jeklly通过gem安装，hexo使用nodejs安装，基于前端对nodejs的熟悉，最后选用了hexo。


## hexo ##

了解hexo，请戳：http://hexo.io


## 准备 ##

你需要先安装一个node， 请戳：https://nodejs.org/en/

安装完成后在命令行中输入`node -v`， 出现如下类似版本号说明安装成功，新版本的node都自带npm（node package manager node的包管理工具，后续的hexo通过npm安装）

``` bash
node -v
v5.2.0
```


## hexo安装和使用 ##

### 安装hexo ###

``` bash
sudo npm install -g hexo-cli
```
等待安装完成


### 初始化hexo项目 ###

进入你将要存放本地blog repo的目录，创建一个hexo初始项目，如xfe到当前目录

``` bash
cd some-dir
hexo init xfe
```
等待初始化结束

### 创建一篇文章 ###
 
``` bash
cd xfe
hexo new post-file-name
#hexo n
```

成功后会在xfe目录的source/_posts下自动创建一个post-file-name.md文件

接下来用markdown编辑这个文档，用心写好你的文章，保存

### 编译文章 ###

``` bash
hexo generate
#hexo g
```

### 本地查看文章效果 ###

hexo提供了一个本地server能够在本地启动一个静态服务器查看文章效果

``` bash
hexo server
#或者使用hexo s
```
默认在4000端口启动，当然你也可以通过xfe根目录下的_config.yml文件进行配置（_config.yml有很多高级配置，可以自行查看hexo的文档了解～）

启动后在浏览器上通过http://localhost:4000即可访问


## 发布到github ##

在发布到github前你需要先了解下github的gh-pages相关分支，这里我就不赘述了，搜索一下就清楚了
大致是你在github上申请的一个repo，经过简单的设置，gh-pages分支可以被自动发布成静态站点，之后可以通过reponame.github.io访问这个站点，当然你也可以自己申请一个域名，cname到这个上面来

好了，假装我已经自动配置完成了一个gh-pages，他的repo地址为https://github.com/sinaad/xfe.git

从前面的步骤，我得到了一个hexo初始化好的xfe目录，接下来，需要把它变成一个git repo，通过下面的命令

``` bash
cd xfe
git init
```
然后添加远程push跟pull的地址， 把这个本地仓库跟远程github上的repo关联

``` bash
git remote add origin https://github.com/sinaad/xfe.git
```

接下来，你需要吧xfe文件夹的内容推送到remote的gh-pages分支上去， 这里需要用到强制推送，否则你就先pull一下在push

``` bash
# 提交
git add .
git ci -m "first commit"
# 创建并切换到本地gh-pages分支
git co -b gh-pages
# 强制提交gh-pages分支
git push -f origin gh-pages
```

如果提交成功了，就可以通过http://sinaad.github.io/xfe进行访问了， 打工告成！！！

### 其他方法 ###

上面描述了一种先通过hexo初始化项目，后关联github的方式来创建，当然你也可以先申请repo，然后通过

``` bash
git clone https://github.com/sinaad/xfe.git
```
来创建这个xfe目录，并拉取gh-pages分支

``` bash
git co -b gh-pages
git pull origin gh-pages
```

然后在进入xfe目录，使用hexo init/new来初始化并创建文章，最后在push到gh-pages中的步骤来完成


## 真相 ##

其实，上面所说的关联github的方法主要是我想让你熟悉下git的一些操作，hexo已经贴心的提供了一个很简单的工具进行关联repo（hexo deploy命令）

你只要通过下面几步：

1.安装hexo-deployer-git插件

``` bash
npm install hexo-deployer-git --save
```
2.配置远程git repo地址和deploy的方式

找到根目录下的_config.yml文件，找到并配置下面的内容

``` bash
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repository: https://github.com/sinaad/xfe.git
  branch: gh-pages
```

3、编译并使用`hexo deploy`命令进行发布

``` bash
hexo clean
hexo generate
#hexo g
hexo deploy
#hexo d
```
大功告成，请不要打脸..


## 如何贡献文章　##

如果已经有了初始化好的hexo的git repo，你要贡献文章，那么你只需要按照下面的步骤来做：

1. 根据第一部分的要求安装好node和hexo
2. 检出https://github.com/sinaad/xfe.git的gh-pages分支
3. 为了更好的审核文章质量，请在检出的gh-pages分支上创建一个你自己的名字命名的分支
4. 通过hexo new的步骤创建文章并完成文章的编写，并提交到自己的分支
5. 通知相关技术组成员进行文章审核
6. 审核通过后由相关负责人进行合并到gh-pages

感谢对知识的无私贡献


## 总结 ##

其实没什么好总结的，http://hexo.io 上都写的很清楚，hexo还提供了各种丰富的风格包可以简单安装，你还可以自己看看然后个性化你的blog

最后，欢迎关注 https://sinaad.github.io/xfe


## 其他 ##

### 配置多说评论框 ###
国内，多说算是比较好的一个评论管理平台，hexo也能很简单的集成多说
1、访问 http://duoshuo.com/ ，点我要安装，按步骤填写
2、找到多说域名前面你填入的那个子域名，比如sinaad-xfe
3、配置_config.yml文件
```bash
# Duoshuo ShortName
duoshuo_shortname: sinaad-xfe
```


### 配置tags ###
根据上面的步骤完成后，点击tags是404的页面，需要通过下面的步骤来配置

1、通过命令生成tags页面
```bash
hexo new page "tags"
```

2、编辑生成的tags页面source/tags/index.md
```bash
---
title: Tagcloud
date: 2016-02-19 11:25:40
type: tags
comments: false
---
```
3、在新建的文章开头添加tags: [tag1,tag2,tag3], 类似格式即可
```bash
---
title: 当前端也拥有 Server 的能力
date: 2016-02-18 16:29:25
tags: [js,server,ServiceWorker]
---
```
4、如果tags为中文，为了避免路径中出现中文，可以在_config.yml中配置tags的map

```bash
# Category & Tag
...
tag_map:
    服务端: server
    前端: fe
```

### 配置categories ###

同tags, 把tags改成categories即可

### 部署的不是xxx.github.com/目录而是某个子目录xxx.github.com/xfe的情况 ###

修改_config.yml中的配置
```bash
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://sinaad.github.io/xfe
root: /xfe/
permalink: :year/:month/:day/:title/
permalink_defaults:
```

### 增加rss功能 ###
1、安装对应的feed插件
```bash
npm install --save hexo-generator-feed
```
2、配置_config.yml，按如下配置：
```bash
# Set rss to false to disable feed link.
# Leave rss as empty to use site's feed link.
# Set rss to specific value if you have burned your feed already.
rss: atom.xml
```
3、从新部署文件
```bash
hexo clean
hexo g
hexo g
#这里不是故意写两遍，当你遇到首页只有一篇文章摘要的时候，执行两边能解决问题
hexo d
```


### 文章内图片的使用方法
参考 http://www.tuicool.com/articles/umEBVfI
```bash
# 安装图片相关模块
npm install https://github.com/CodeFalling/hexo-asset-image --save

# 在根目录下设置_config.yml配置post_asset_folder:true
post_asset_folder:true

# 新建文章的语法不变，安装完插件后会自动生成对应的文件夹
hexo new
```

欢迎评论补充你遇到的问题～




