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

export default WorkerMessage