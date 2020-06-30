import MessageBase from "./base.js"

class WorkerMessage extends MessageBase {
    /**
     * 消息管理
     * @author 邓如春 <dengrc1992@gmail.com>
     * @param {string} channelId
     * @param {string} [targetOrigin=*] target 使用 iframe.contentWindow 时， 以防止恶意第三方窃取密码。始终提供具体的信息targetOrigin
     */
    constructor(channelId, targetOrigin = "*") {
        super()
        const target = opener || parent;
        //Electron
        if (target.postMessage.length == 2) {
            const channel = new BroadcastChannel(channelId);
            const postMessage = channel.postMessage;
            channel.postMessage = function (object) {
                postMessage.call(channel, JSON.parse(JSON.stringify(object)))
            }
            channel.onmessage = (e) => {
                this.__onMessage(e)
            }
            this.__def = Promise.resolve(channel);
            return
        }
        const channel = new MessageChannel();
        channel.port1.onmessage = (e) => {
            this.__onMessage(e)
        }

        this.__def = Promise.resolve(channel.port1);
        target.postMessage(channelId, targetOrigin, [channel.port2]);
    }
}

export default WorkerMessage