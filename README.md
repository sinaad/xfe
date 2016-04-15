# xfe
前端知识拯救计划

## 贡献文章方法
```bash
# 先克隆本项目
git clone https://github.com/sinaad/xfe.git

# 安装hexo及对应的包，详见package.json
npm install

# 新建文章, 执行玩下面的命令会在source/_post下生成一个名字为postname_in_english.md的文件
hexo new postname_in_english

# 编辑这个文件

# 编译md为html
hexo g
hexo g

# 启动本地服务器测试
hexo s

# 测试通过后提交，你可能没有权限做这一步，所以可以跳过
hexo d

# 如果你没有编辑master分支的权限，请用github的pullrequest功能给我提交pr
```

## 文章头信息设置
自动生成的文件会有一个默认头
title可以改成中文，在文章中的标题就是中文的，其他的看情况写

```text
title: cut和copy命令
date: 2016-04-14 13:33:23
tags: [js, cut, copy, chrome]
author: acelan
---

