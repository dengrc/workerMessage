export default class WorkerMessage {
    /**
     * 实例对象实现方法
     * 接收到请求消息，期望得到响应
     * @param message 消息内容
     * @param resolve 解决请求回调
     * @param reject 拒绝请求回调
     */
    onRequestMessage(message: any, resolve: (message: any) => void, reject: (message: any) => void)
    /**
     * 实例对象实现方法
     * 接收到普通消息
     * @param message 消息内容
     * @param e 消息事件对象
     */
    onMessage(message: any, e: MessageEvent)
    /**
     * 结束消息监听
     */
    destroy()
    /**
     * 消息管理
     * @author 邓如春 <dengrc1992@gmail.com>
     * @see [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#Syntax)
     * @see [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage#Syntax)
     * @param target 用于发送或接收消息的对象 worker、iframe.contentWindow 或 iframe 里的 window
     * @param origin  target 使用 iframe.contentWindow 时， 以防止恶意第三方窃取密码。始终提供具体的信息targetOrigin
     */
    constructor(target: Window | Worker, origin?: string)
    /**
     * 发送请求消息，并等待响应
     * @param message 消息内容
     */
    requestMessage(message: any)
    /**
     * 发送普通消息
     * @param message 消息内容
     * @param transfer 
     * @param targetOrigin 默认使用构造函数传入的 origin 值
     */
    postMessage(message: any, transfer?: Transferable, targetOrigin?: string)
}