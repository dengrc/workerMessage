# WorkerMessage

使用Promise为Worker，iframe，New tab Window 的 postMessage包装。 使postMessage变得容易；

### [demo](https://dengrc.github.io/workerMessage/demo/) 请查看 Console 输出

### install

```shell
npm install worker-request-message
```

## WebWorker

### index.html
```html
<script type="module">
    import WorkerMessage from "../index.js";

    const worker = new Worker("./worker.js");//,{type:'module'}

    const message = new WorkerMessage(worker);
    message.onRequestMessage = function (message, resolve, reject) {
        resolve(message + "; main response")
    }

    message.requestMessage("to worker").then((e) => {
        console.log(e)
    }).catch((e) => {
        console.error(e)
    })
</script>
```
### worker.js
```javascript
//WebWorker
importScripts("../worker.js")
const message = new WorkerMessage(self);

message.onRequestMessage = function (message, resolve, reject) {
    resolve(message + "; worker response")
}

message.requestMessage("to main").then((e) => {
    console.log(e)
}).catch((e) => {
    console.error(e)
})
```

## iframe

### index.html
```html
<iframe src="./inner.html" id="innerIframe"></iframe>
<script type="module">
    import WorkerMessage from "../index.js";

    innerIframe.addEventListener("load", (e) => {
        const message = new WorkerMessage(innerIframe.contentWindow);
        message.onRequestMessage = function (message, resolve, reject) {
            resolve(message + "; parent response")
        }

        message.requestMessage("to iframe").then((e) => {
            console.log(e)
        }).catch((e) => {
            console.error(e)
        })
    }, false)
</script>
```

### inner.html
```html
<script type="module">
    import WorkerMessage from "../iframe.js";

    const message = new WorkerMessage(self);
    message.onRequestMessage = function (message, resolve, reject) {
        resolve(message + "; iframe response")
    }

    message.requestMessage("to parent").then((e) => {
        console.log(e)
    }).catch((e) => {
        console.error(e)
    })
</script>
```

## API

### methods

| 方法 | 参数说明 | 返回值 |
| :--- | :--- | ----: |
|`constructor(self,targetOrigin)`|`target`: Window \| Worker 用于发送或接收消息的对象 worker、iframe.contentWindow 或 iframe 里的 window<br>`targetOrigin`?: string**target 使用 iframe.contentWindow 时， 以防止恶意第三方窃取密码。始终提供具体的信息targetOrigin**|
| `requestMessage(message)` | `message`:any | Promise&lt;any&gt; |
| `postMessage(message, transfer, targetOrigin)`| `message`:any 消息内容<br>`transfer`?: [Transferable](https://developer.mozilla.org/zh-CN/docs/Web/API/Transferable#content)<br>`targetOrigin`?:string 默认使用构造函数传入的 targetOrigin 值 |void|
|`destroy()`| 释放资源 |void|


### events

| 事件 | 参数说明 |
| :--- | :--- |
|`onRequestMessage(message,resolve,reject)`|`message`:any 消息内容<br>`resolve`:(message: any) => void 解决请求回调<br>`reject`:(message: any) => void 拒绝请求回调|
|`onMessage(message,e)`|`message`:any 消息内容 <br>`e`:MessageEvent 消息事件对象|