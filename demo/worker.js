//WebWorker
importScripts("../worker.js")
const message = new WorkerMessage();

message.onRequestMessage = function (message, resolve, reject) {
    resolve(message + "; worker response")
}

message.onMessage = function (message) {
    resolve(message)
}

message.postMessage("main")

message.requestMessage("to main").then((e) => {
    console.log(e)
}).catch((e) => {
    console.error(e)
})