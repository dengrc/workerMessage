export default class WorkerMessage {
    /**
     * 实例对象实现方法
     * 接收到请求消息，期望得到响应
     * @param message 消息内容
     * @param resolve 解决请求回调
     * @param reject 拒绝请求回调
     */
    onRequestMessage(message: any, resolve: (message: any) => void, reject: (message: any) => void): void
    /**
     * 实例对象实现方法
     * 接收到普通消息
     * @param message 消息内容
     * @param e 消息事件对象
     */
    onMessage(message: any, e: MessageEvent): void
    /**
     * 结束消息监听
     */
    destroy(): void
    /**
     * 消息管理
     * @author 邓如春 <dengrc1992@gmail.com>
     * @see [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#Syntax)
     * @see [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage#Syntax)
     * @param {Window} target
     * @param {string} channelId
     * @param targetOrigin  target 使用 iframe.contentWindow 时， 以防止恶意第三方窃取密码。始终提供具体的信息targetOrigin
     */
    constructor(target: Window, channelId: string, targetOrigin?: string)
    /**
     * 发送请求消息，并等待响应
     * @param message 消息内容
     */
    requestMessage(message: any): Promise<any>
    /**
     * 发送普通消息
     * @param message 消息内容
     * @param transfer 
     */
    postMessage(message: any, transfer?: Transferable): void
}