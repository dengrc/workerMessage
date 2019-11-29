//WebWorker
importScripts("../index.inworker.js")
const message = new WorkerMessage(self);

message.onRequestMessage = function (message, resolve, reject) {
    resolve(message + "; worker response")
}

message.requestMessage("to main").then((e) => {
    console.log(e)
}).catch((e) => {
    console.error(e)
})