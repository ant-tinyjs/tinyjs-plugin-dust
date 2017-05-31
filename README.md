# tinyjs-plugin-dust

> Dust is a quick and easy particle effects engine

## 查看demo

`demo/index.html`

## 引用方法

- 推荐作为依赖使用

  - `npm install tinyjs-plugin-dust --save`

- 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  - https://a.alipayobjects.com/g/tiny-plugin/tinyjs-plugin-dust/0.0.2/index.js
  - https://a.alipayobjects.com/g/tiny-plugin/tinyjs-plugin-dust/0.0.2/index.debug.js

## 起步
首先当然是要引入，推荐`NPM`方式，当然你也可以使用`CDN`或下载独立版本，先从几个例子入手吧！

##### 1、最简单的例子

引用 Tiny.js 源码
``` html
<script src="http://tinyjs.net/libs/tiny.debug.js"></script>
```
``` js
var Dust = require('tinyjs-plugin-dust');
// 或者
// import Dust from 'tinyjs-plugin-dust';

// 新建 APP
var app = new Tiny.Application({
  width: 320,
  height: 320
});
// 创建容器
var container = new Tiny.Container();
// 初始化
var dust = new Dust(x, y, function () {
    return new Tiny.Sprite.fromImage('https://zos.alipayobjects.com/rmsportal/KKKOcfaEECkqrXFOBYIa.png')
  }, container,
  {
    number: 50,
    gravity: 0.1,
    randomSpacing: true,
    minAngle: 0, maxAngle: 6.28,
    minSize: 12, maxSize: 24,
    minSpeed: 1, maxSpeed: 2,
    minScaleSpeed: 0.005, maxScaleSpeed: 0.01,
    minAlphaSpeed: 0.005, maxAlphaSpeed: 0.01,
    minRotationSpeed: 0.05, maxRotationSpeed: 0.1
  });

app.run(container);
app.onUpdate(function () {
  dust && dust.update();
});
```

## 依赖
- `Tiny.js`: [Link](http://tinyjs.net/#/docs/api)

## API文档

TODO
