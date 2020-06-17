import MessageBase from "./base.js"

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
        const channel = new MessageChannel();
        let init = performance.now();
        this.__def = new Promise((resolve) => {
            channel.port1.onmessage = (e) => {
                resolve(channel.port1)
                if (e.data !== init)
                    this.__onMessage(e)
            }
        })

        target instanceof Worker ? target.postMessage(init, [channel.port2]) : target.postMessage(init, targetOrigin, [channel.port2])
    }
}

export default WorkerMessage