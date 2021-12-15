## 安装
```shell
npm install spider-optimize-svg -g

#或

npm install spider-optimize-svg --save-dev
```
## 运行
```shell
spider-svg ./svg -i appid -k appkey
# 使用了百度翻译，请注册后获取
```
## 功能
1. 将目录下的中文文件名/特殊符号文件名/非驼峰形式的文件名一致修改为驼峰英文命名
2. 生成js引入导出文件
3. 组件名称为 {驼峰}Icon
4. 文件名称为 {驼峰}.svg

##Tips
百度翻译限流，文件多的话时间较久

### 原始目录 ./svg下的结构
```shell
├── 中文
│   └── 错误.svg
├── 列表
│   └── 错误.svg
└── 菜单_12 -.svg

2 directories, 2 files

```

### 优化后的目录结构
```shell
├── Chinese
│   ├── Error.svg
│   └── index.js
├── List
│   ├── Error.svg
│   └── index.js
├── Menu12.svg
└── index.js

```
生成的引用文件
```js
// index.js

import Menu12Icon from './Menu12.svg';

export {
    Menu12Icon
}
```