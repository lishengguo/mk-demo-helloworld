# 下载代码并运行
```
git clone https://github.com/lishengguo/mk-demo-helloworld.git
cd mk-demo-helloworld/helloWorld
npm install
npm start
```

# 下载安装包(windows x64)
<a href="https://github.com/lishengguo/mk-demo-helloworld/raw/master/release.exe">release.exe</a>

# 命令行创建hello world网站

## 1、安装mk-tools命令行工具

```
$ npm i -g mk-tools
```

## 2、创建空website

```
$ mk website helloWorld
$ cd helloWorld
```

## 3、在website创建一个app

```
$ mk app apps/firstApp
```

## 4、编译
- 编译会生成index.js,mock.js,apps.less 文件
```
$ mk compile website
```

## 5、修改website配置

```
//打开config.js，修改_options.startAppName的值
_options.startAppName = 'firstApp' //启动app名，需要根据实际情况配置
```

## 6、启动website

```
$ npm start
```

