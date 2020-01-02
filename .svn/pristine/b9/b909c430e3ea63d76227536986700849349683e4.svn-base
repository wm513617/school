
const Struct = require('python-struct')
const Protobuf = require('protobufjs')
const net = require('net')
const path = require('path')
const config = require('../../config').backend

// 协议头结构信息
const BSCP_HEADER = {
  mark: 'BS', // BS
  version: '0', // 协议版本号，当前为0
  encode: '0', // 0-明文，1-密文
  length: 0 // 长度，指该指令结构后开始
}

// 协议包结构信息
const BSCP_PACKET_PLAIN = {
  mode: 0, // 1-请求，2-应答，11，12是主动注册协议
  error: 0, // 0表示成功，其余表示对应的错误值，异步未完成0x7531(3000)
  plainLength: 0, // 加密前明文大小
  sequence: 0, // 流水号,从请求端自增
  command: '' // 命令号
}

// 结构体字节格式化与字节长度
const BSCP_PACKET_PLAIN_FRM = 'hhiii'
const BSCP_PACKET_PLAIN_FRM_LENGTH = 16
const BSCP_HEADER_FRM = '2s1s1si'
const BSCP_HEADER_FRM_LENGTH = 8

const Timeout = 10
const host = config.tcpServer
const port = config.tcpPort
// let cmdBase = null
const baseDic = '../protobuf/'

/**
 * protobuf协议获取基协议
 * @param {string} proto  proto file path
 * @param {string} message proto message name
 * @returns  proto message
 */

const baseProto = (protoPath) => {
  if (typeof protoPath === 'string' && protoPath.indexOf('.') < 0) {
    protoPath = getProtoPath(protoPath)
  }
  const cmdBase = Protobuf.loadSync(protoPath)
  if (cmdBase === null) {
    throw Error('can not find commandbase.proto or CommandGeneric')
  }
  return cmdBase
}

/**
 * protobuf协议获取消息结构
 * @param proto {String}   proto file path
 * @param message {String}  proto message name
 * @returns  proto message
 */

const getProtoMsg = (proto, message) => {
  if (!(proto && message)) {
    throw Error('params must be passed')
  }
  try {
    return proto.lookup(message)
  } catch (error) {
    throw Error('can not find  ' + message + ' message in proto')
  }
}

/**
 * protobuf协议 object convert to bytes
 * @param message {String} protobuf message
 * @param payload {Object} message body
 * @return {Buffer} buffer
 */

const encode = (message, payload) => {
  try {
    if (!(message && payload)) {
      throw Error('params must be passed')
    }
    const errMessage = message.verify(payload)
    if (errMessage) {
      throw Error(errMessage)
    }
    const instance = message.create(payload)
    return message.encode(instance).finish()
  } catch (error) {
    throw Error(error)
  }
}

/**
 * protobuf协议 bytes convert to object
 * @param message {Class} message protobuf message
 * @param buff {Buffer} buff  message
 * @return {Object} object
 */

const decode = (message, buff) => {
  try {
    if (!(message && buff)) {
      throw Error('params must be passed')
    }
    const instance = message.decode(buff)
    return message.toObject(instance, {
      longs: String,
      enums: String,
      bytes: String
    })
  } catch (error) {
    throw Error(error)
  }
}

/**
 * 打包组装协议消息格式 (header + packet + protobuf)
 * @param body {Buffer} protobuf for playload
 * @param cmd {Number}  command literal
 * @return {Buffer} Buffer
 */

const pack = (body, cmd) => {
  BSCP_PACKET_PLAIN.command = cmd
  const bscpPacket = Struct.pack(BSCP_PACKET_PLAIN_FRM, BSCP_PACKET_PLAIN.mode, BSCP_PACKET_PLAIN.error, BSCP_PACKET_PLAIN.plainLength, BSCP_PACKET_PLAIN.sequence, BSCP_PACKET_PLAIN.command)
  BSCP_HEADER.length = body.length + bscpPacket.length
  const bscpHeader = Struct.pack(BSCP_HEADER_FRM, BSCP_HEADER.mark, BSCP_HEADER.version, BSCP_HEADER.encode, BSCP_HEADER.length)
  return Buffer.concat([bscpHeader, bscpPacket, body])
}

/**
 * 解包协议消息格式 (header + packet + protobuf)
 * @param res {Buffer}
 * @return {Object} object include response code & protobuf message
 */

const unpack = (res) => {
  if (!res) {
    throw Error('empty parma')
  }
  const packet = res.slice(BSCP_HEADER_FRM_LENGTH, BSCP_HEADER_FRM_LENGTH + BSCP_PACKET_PLAIN_FRM_LENGTH)
  const code = Struct.unpack(BSCP_PACKET_PLAIN_FRM, packet)[1]
  return {
    code,
    message: code === 0 ? res.slice(BSCP_HEADER_FRM_LENGTH + BSCP_PACKET_PLAIN_FRM_LENGTH) : '请求错误'
  }
}

/**
 * 创建tcp类型的net.socket连接，并发送bytes到目标地址。返回tcp服务器响应的的数据
 * @param paylod {Buffer} message protobuf byetes
 * @param cmd {Number} command literal
 * @return {Object} object include response code & protobuf message
 */

const tcp = (paylod, cmd) => {
  if (!(paylod && cmd)) {
    throw Error('tcp paramter is null or empty')
  }
  let buffer = Buffer.from('')
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ port, host })
      .on('connect', () => {
        socket.write(pack(paylod, cmd))
      })
      .on('data', (res) => {
        buffer = Buffer.concat([buffer, res], buffer.length + res.length)
      })
      .on('close', () => {
        !buffer.length ? resolve('') : resolve(unpack(buffer))
      })
      .on('error', (err) => {
        err = err || new Error('操作异常')
        reject(err)
      })
      .on('timeout', (err) => {
        err = err || new Error('连接超时')
        reject(err)
      })
    socket.setTimeout(Timeout * 1000)
  })
}

/**
 * 根据proto文件名获取文件路径
 * @param name {String} file name
 * @return {String} file path
 */

const getProtoPath = (name) => {
  return path.join(__dirname, baseDic + name + '.proto')
}

module.exports = {
  baseProto,
  getProtoMsg,
  encode,
  decode,
  pack,
  unpack,
  tcp
}
