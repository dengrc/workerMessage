/**
 * @see ./base.js
 */
class MessageBase {
    constructor() {
        this.__messagePromiseMap = new Map();
    }

    __onMessage(e) {
        const {
            data
        } = e;
        if (data) {
            if (data.__requestID__) {
                const __responseID__ = data.__requestID__;
                return this.onRequestMessage && this.onRequestMessage(data.message, (message) => {
                    this.postMessage({
                        __responseID__,
                        success: true,
                        message
                    })
                }, (message) => {
                    this.postMessage({
                        __responseID__,
                        message
                    })
                })
            } else if (data.__responseID__) {
                const promise = this.__messagePromiseMap.get(data.__responseID__);
                promise && promise[data.success ? 0 : 1](data.message);
                return this.__messagePromiseMap.delete(data.__responseID__)
            }
        }
        this.onMessage(data, e)
    }
    /**
     * 发送普通消息
     * @param {any} message 消息内容
     * @param {Transferable} [transfer=undefined] 
     */
    postMessage(message, transfer) {
        this.__def.then((port) => {
            port.postMessage(message, transfer)
        })
    }
    /**
     * 发送请求消息，并等待响应
     * @param {any} message 消息内容
     */
    requestMessage(message) {
        const __requestID__ = Math.random().toString(36).substr(2);
        this.postMessage({
            __requestID__,
            message
        })
        return new Promise((resolve, reject) => {
            this.__messagePromiseMap.set(__requestID__, [resolve, reject])
        })
    }
    /**
     * 结束消息监听
     */
    destroy() {
        this.__def.then((prot) => {
            prot.close()
        })
    }
    /**
     * 实例对象实现方法
     * 接收到请求消息，期望得到响应
     * @param {any} message 消息内容
     * @param {resolveCallback} resolve 解决请求回调 
     * @param {rejectCallback} reject 拒绝请求回调
     */
    onRequestMessage(message, resolve, reject) {}
    /**
     * 实例对象实现方法
     * 接收到普通消息
     * @param {any} message 消息内容
     * @param {MessageEvent} e 消息事件对象
     */
    onMessage(message, e) {}
}

/**
 * This callback is displayed as a global member.
 * @callback resolveCallback
 * @param {any} message
 */

/**
 * This callback is displayed as a global member.
 * @callback rejectCallback
 * @param {any} message
 */
/**
 * @see ./iframe.js
 */
class WorkerMessage extends MessageBase {
    /**
     * 消息管理
     * @author 邓如春 <dengrc1992@gmail.com>
     * @see [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#Syntax)
     * @see [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage#Syntax)
     * @param {Window|Worker} target 用于发送或接收消息的对象 worker、iframe.contentWindow 或 iframe 里的 window
     * @param {string} [targetOrigin=*] target 使用 iframe.contentWindow 时， 以防止恶意第三方窃取密码。始终提供具体的信息targetOrigin
     */
    constructor(target, targetOrigin = "*") {
        super()
        this.__def = new Promise((resolve) => {
            const handler = (e) => {
                if (targetOrigin !== "" && targetOrigin !== "*" && e.origin !== targetOrigin) {
                    return
                }
                if (e.ports && e.ports.length) {
                    const port = e.ports[0];
                    port.onmessage = (e) => {
                        this.__onMessage(e)
                    };
                    resolve(port);
                    this.postMessage(e.data)
                }
            };
            target.addEventListener("message", handler, false)
        })


        this.destory = () => {
            this.__def.then((port) => {
                port.close()
            })
            target.removeEventListener("message", handler, false)
        }
    }
}