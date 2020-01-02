/*
 * @Author: hansen.liuhao
 * @Date: 2019-03-14 09:23:44
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-07 08:59:33
 */

module.exports = class NetWorker {
  constructor (socket, handler) {
    this.socket = socket
    this._state = 'HEADER'
    this._process = false
    this._bufferBytes = 0
    this._payloadLength = 0
    this.queue = []
    this._bufferHeader = {}
    this.handler = handler
  }
  init () {
    this.socket.on('data', data => {
      this._bufferBytes += data.length
      this.queue.push(data)
      this._process = true
      this._onData()
    })
  }
  _hasEnough (size) {
    if (this._bufferBytes >= size) {
      return true
    }
    this._process = false
    return false
  }
  _readBytes (size) {
    let result
    this._bufferBytes -= size
    if (size === this.queue[0].length) {
      return this.queue.shift()
    }
    if (size < this.queue[0].length) {
      result = this.queue[0].slice(0, size)
      this.queue[0] = this.queue[0].slice(size)
      return result
    }
    result = Buffer.allocUnsafe(size)
    let offset = 0
    let length
    while (size > 0) {
      length = this.queue[0].length
      if (size >= length) {
        this.queue[0].copy(result, offset)
        offset += length
        this.queue.shift()
      } else {
        this.queue[0].copy(result, offset, 0, size)
        this.queue[0] = this.queue[0].slice(size)
      }
      size -= length
    }
    return result
  }
  _getHeader () {
    if (this._hasEnough(28)) {
      const header = this._readBytes(28)
      if (header.readUInt32LE(0) === 0xbf9d1fdb) {
        this._payloadLength = header.readUInt32LE(8)
        this._bufferHeader.sequence = header.readUInt32LE(12)
        this._bufferHeader.length = this._payloadLength
        this._bufferHeader.format = header.readUInt8(27)
        this._state = 'PAYLOAD'
      }
    }
  }
  _getPayload () {
    if (this._hasEnough(this._payloadLength)) {
      let received = this._readBytes(this._payloadLength)
      this.handler(received, JSON.parse(JSON.stringify(this._bufferHeader)))
      this._bufferHeader = {}
      this._state = 'HEADER'
    }
  }
  _onData () {
    while (this._process) {
      switch (this._state) {
        case 'HEADER':
          this._getHeader()
          break
        case 'PAYLOAD':
          this._getPayload()
          break
      }
    }
  }
}
