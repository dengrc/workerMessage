import MessageBase from "./base.js"

class WorkerMessage extends MessageBase {
    /**
     * 消息管理
     * @author 邓如春 <dengrc1992@gmail.com>
     * @see [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#Syntax)
     * @see [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage#Syntax)
     * @param {string} channelId
     * @param {string} [targetOrigin=*] target 使用 iframe.contentWindow 时， 以防止恶意第三方窃取密码。始终提供具体的信息targetOrigin
     */
    constructor(channelId, targetOrigin = "*") {
        super()
        // const channel = new MessageChannel();
        // let init = performance.now();
        // this.__def = new Promise((resolve) => {
        //     channel.port1.onmessage = (e) => {
        //         resolve(channel.port1)
        //         if (e.data !== init)
        //             this.__onMessage(e)
        //     }
        // })

        const _this = this;
        let initResolve

        this.__def = new Promise((resolve) => {
            initResolve = resolve
        })

        function handler(e) {
            if (e.data === channelId) {
                if (e.source && e.source.postMessage) {
                    const channel = new MessageChannel();
                    const target = e.source
                    const init = performance.now();
                    channel.port1.onmessage = (e) => {
                        if (initResolve) {
                            initResolve(channel.port1);
                            initResolve = null;
                        } else {
                            _this.__def = new Promise((resolve) => {
                                resolve(channel.port1)
                            })
                        }
                        if (e.data !== init)
                            _this.__onMessage(e)
                    }
                    target instanceof Worker ? target.postMessage(init, [channel.port2]) : target.postMessage(init, targetOrigin, [channel.port2])
                }
            }
        }

        window.addEventListener("message", handler, false)

        this.__destroy = () => {
            window.removeEventListener("message", handler, false)
        }
    }

    destroy() {
        super.destroy()
        this.__destroy();
    }
}

export default WorkerMessage