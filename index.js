import MessageBase from "./base.js"

class WorkerMessage extends MessageBase {
    /**
     * 消息管理
     * @author 邓如春 <dengrc1992@gmail.com>
     * @param {string} channelId     
     * @see [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#Syntax)
     * @see [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage#Syntax)
     * @param {string} target
     * @param {string} channelId
     * @param {string} [targetOrigin=*] target 使用 iframe.contentWindow 时， 以防止恶意第三方窃取密码。始终提供具体的信息targetOrigin
     */
    constructor(target, channelId, targetOrigin = "*") {
        super()
        const _this = this;
        let initResolve;

        this.__def = new Promise((resolve) => {
            initResolve = resolve
        })

        function handler(e) {
            if (targetOrigin && targetOrigin != "*" && e.origin && e.origin != targetOrigin) {
                return
            }
            if (e.data === channelId && e.ports && e.ports.length) {
                const port = e.ports[0];
                if (initResolve) {
                    initResolve(port);
                    initResolve = null;
                } else {
                    _this.__def = Promise.resolve(port)
                }
                port.onmessage = (e) => {
                    _this.__onMessage(e)
                }
            }
        }

        !target && (target = window)

        target.addEventListener("message", handler, false)

        this.__destroy = () => {
            target.removeEventListener("message", handler, false)
        }
        //Electron
        if (/Electron/.test(navigator.appVersion)) {
            const channel = new BroadcastChannel(channelId);
            const postMessage = channel.postMessage;
            channel.postMessage = function (object) {
                postMessage.call(channel, JSON.parse(JSON.stringify(object)))
            }
            channel.onmessage = (e) => {
                if (initResolve) {
                    initResolve(channel);
                    initResolve = null;
                }
                _this.__onMessage(e)
            }
        }
    }

    destroy() {
        super.destroy()
        this.__destroy();
    }
}

export default WorkerMessage