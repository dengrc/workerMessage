export default class MessageBase {
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