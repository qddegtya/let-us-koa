![let-us-koa](./preview/let-us-koa.png)

Just another koa-seed-project.

Preview
==========

![let-us-koa](./preview/let-us-koa.gif)

Why
======

搭建一个koa的脚手架并不困难，但就如其他"体力活"一样，

* 我们并不想重复劳动
* 其他脚手架生成出来的项目目录结构可能并不是我们想要的
* 一些基于Express和Koa类型的框架型项目集成了ORM等重量级组件，当然，这本身无可厚非，大家的定位不一样

What we need
====

我希望只通过一个最小化的"容器"去启动一个应用，它大概只需要以下几个功能就可以了，重要的是，它的目录结构应该是清晰的，可维护的:

* 自动根据模块级目录生成路由
* 模块可插拔
* 脚手架只需要router,template,debug就可以了

所以，Let-us-koa的原理非常简单，如果你想快速跑起来一个koa应用，你可以这么做:

Install
========

```
$ git clone https://github.com/qddegtya/let-us-koa
$ cd let-us-koa
$ npm install
```

Run!
=======

```
$ npm run start
```

新增一个模块
==========

在modules下面新建目录即可，目录名称就是模块加载器自动prefix的一级路由名称，比如我们这里的api和home

分别对应

```
/api
/home
```

**模块必须包含的文件**

```
app.conf.json // 模块配置文件
controllers.js // 控制器
```

app.conf.json
===========

```
{
  "routes": [
    // 路由规则
    // [HTTP方法]#[/your route]#[controller]
    "GET#/version#getApiVersion"
  ],
  "active": true // 模块是否激活
}
```

模块下的controllers
==================

```
'use strict'

// 只需要导出对应的方法即可
module.exports = {
  getApiVersion: function* () {
    this.body = {
      'version': 'v1'
    }
  }
}
```

全局配置
=============
```
{
  // 模块加载目录
  "modules": "modules",

  // 上传目录
  "upLoadDir": "public/uploads",

  // 渲染设置
  // let-us-koa 默认为你选择swig模板引擎
  "renderSettings": {
    "autoescape": true,
    "cache": "memory",
    "ext": "html"
  }
}
```


中间件
======

你可以在项目下创建一个middlewares目录，里面放置你自定义的中间件，let-us-koa没有为你在这块做自动加载和特殊处理，推荐把中间件加载写在middleware.js里


有何用
=======

一个"尽量最小化"的基于koa的容器，其实就可以跑起来一些内部站点，比如你想做一个内部的研发平台导航站点，俗称'portal'

![](./preview/portal.png)


So, Just try it.
