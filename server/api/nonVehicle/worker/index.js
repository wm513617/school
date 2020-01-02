/*
 * @Author: litao
 * @Date: 2019-07-28 11:55:13
 * 该模块主要实对子进程的启动操作的封装
 * -----------------------------README-----------------------------
 * startWorker()   启动子进程
 */
const { spawn } = require('child_process')

const startWorker = model => {
  return new Promise((resolve, reject) => {
    try {
      const workerModule = path.resolve(__dirname, './worker.js')
      const worker = spawn('node', [workerModule], { stdio: [null, null, null, 'ipc'] })

      worker.on('message', result => {
        resolve(result)
      })

      worker.on('exit', code => {
        if (code !== 0) {
          resolve({ success: false })
        }
      })
      worker.send(model)
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = {
  startWorker
}
