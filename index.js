class WorkerMessage {
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
    /**
     * 结束消息监听
     */
    destroy() {}
    /**
     * 消息管理
     * @author 邓如春 <dengrc1992@gmail.com>
     * @see [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#Syntax)
     * @see [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage#Syntax)
     * @param {Window|Worker} target 用于发送或接收消息的对象 worker、iframe.contentWindow 或 iframe 里的 window
     * @param {string} [origin=*] target 使用 iframe.contentWindow 时， 以防止恶意第三方窃取密码。始终提供具体的信息targetOrigin
     */
    constructor(target, origin = "*") {
        let resolvePromise;
        const promiseMap = this.__messagePromiseMap = new Map();
        const timer = setTimeout(() => {
            this.postMessage({
                type: "loaded"
            })
        }, 50);
        const messageHandler = (e) => {
            if (origin !== "" && origin !== "*" && e.origin !== origin) {
                return
            }
            const data = e.data;
            if (data) {
                if (data.type === "loaded") {
                    return resolvePromise(1);
                }
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
                }
                if (data && data.__responseID__) {
                    const promise = promiseMap.get(data.__responseID__);
                    promise && promise[data.success ? 0 : 1](data.message);
                    return promiseMap.delete(data.__responseID__)
                }
            }

            this.onMessage && this.onMessage(data, e);
        };
        this.__isWorker = (typeof Worker !== "undefined" && target instanceof Worker) || (typeof WorkerGlobalScope !== "undefined" && target instanceof WorkerGlobalScope);
        if (this.__isWorker) {
            origin = ""
            this.__receiver = target;
            this.__broadcast = target;
        } else {
            const inIframe = window === target
            this.__receiver = inIframe ? target : target.parent;
            this.__broadcast = inIframe ? target.parent : target;
        }

        this.__origin = origin;
        this.__messagePromise = new Promise((resolve, reject) => {
            resolvePromise = resolve
        });
        this.destroy = function () {
            this.__receiver && this.__receiver.removeEventListener("message", messageHandler, false);
            clearTimeout(timer)
        }
        this.__receiver.addEventListener("message", messageHandler, false);
    }
    /**
     * 发送请求消息，并等待响应
     * @param {any} message 消息内容
     */
    requestMessage(message) {
        const __requestID__ = Math.random().toString(36).substr(2);
        this.__messagePromise.then(() => {
            this.postMessage({
                __requestID__,
                message
            })
        })
        return new Promise((resolve, reject) => {
            this.__messagePromiseMap.set(__requestID__, [resolve, reject])
        })
    }
    /**
     * 发送普通消息
     * @param {any} message 消息内容
     * @param {Transferable} [transfer=undefined] 
     * @param {string} [targetOrigin=this.__origin] 默认使用构造函数传入的 origin 值
     */
    postMessage(message, transfer, targetOrigin = this.__origin) {
        if (this.__isWorker) {
            this.__broadcast.postMessage(message, transfer)
            return
        }

        this.__broadcast.postMessage(message, targetOrigin, transfer)
    }
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

export default WorkerMessage