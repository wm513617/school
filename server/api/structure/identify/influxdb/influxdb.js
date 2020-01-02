/*
 * @Description: 视频结构化存储到 influxdb 的 schema 设计
 * @Author: wanglei
 * @Date: 2019-07-16 13:59:20
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-06 20:48:46
 */
'use strict'

const postal = require('postal')
const Influx = require('influx')
const InfluxDatabaseName = 'bs-struct'
const DefaultRetentionPolicy = 'dataSaveTime'
const influxdb = new Influx.InfluxDB({
  database: InfluxDatabaseName,
  host: process.env.influxdbUri,
  port: process.env.influxdbPort,
  schema: [
    {
      measurement: 'pedestrains', // 行人
      fields: {
        // 数据表的字段，定义类型，FLOAT/INTEGER/STRING/BOOLEAN
        guid: Influx.FieldType.STRING,
        structServerId: Influx.FieldType.STRING, // 结构化服务器的内部唯一标识
        structServerIp: Influx.FieldType.STRING, // 结构化服务器 ip
        channelName: Influx.FieldType.STRING, // 通道名称
        resourceId: Influx.FieldType.STRING, // 资源id
        snapshotTime: Influx.FieldType.INTEGER,
        captureTime: Influx.FieldType.INTEGER,
        bodyRect: Influx.FieldType.STRING,
        bigImageUrl: Influx.FieldType.STRING,
        bigImageHeight: Influx.FieldType.INTEGER,
        bigImageWidth: Influx.FieldType.INTEGER,
        smallImageUrl: Influx.FieldType.STRING,
        bigImageUrlSpare: Influx.FieldType.STRING,
        smallImageUrlSpare: Influx.FieldType.STRING,
        taskId: Influx.FieldType.INTEGER,
        score: Influx.FieldType.INTEGER,
        babyCode: Influx.FieldType.STRING,
        bagCode: Influx.FieldType.STRING,
        barrowCode: Influx.FieldType.STRING,
        bottomTypeCode: Influx.FieldType.STRING,
        bottomColorCode: Influx.FieldType.STRING,
        glassesCode: Influx.FieldType.STRING,
        hatCode: Influx.FieldType.STRING,
        hairCode: Influx.FieldType.STRING,
        knapsackCode: Influx.FieldType.STRING,
        maskCode: Influx.FieldType.STRING,
        orientationCode: Influx.FieldType.STRING,
        trolleyCaseCode: Influx.FieldType.STRING,
        umbrellaCode: Influx.FieldType.STRING,
        upperTextureCode: Influx.FieldType.STRING,
        upperTypeCode: Influx.FieldType.STRING
      }, // tag 也是里面的字段，是自带索引光环。查询速度杠杠的。
      tags: ['type', 'videoChannel', 'ageCode', 'sexCode', 'upperColorCode']
    },
    {
      measurement: 'vehicles', // 机动车 包含轿车、面包车、卡车、大客车、三轮车
      fields: {
        guid: Influx.FieldType.STRING,
        structServerId: Influx.FieldType.STRING, // 结构化服务器的内部唯一标识
        structServerIp: Influx.FieldType.STRING,
        channelName: Influx.FieldType.STRING, // 通道名称
        resourceId: Influx.FieldType.STRING, // 资源id
        snapshotTime: Influx.FieldType.INTEGER,
        captureTime: Influx.FieldType.INTEGER,
        bodyRect: Influx.FieldType.STRING,
        bigImageUrl: Influx.FieldType.STRING,
        bigImageHeight: Influx.FieldType.INTEGER,
        bigImageWidth: Influx.FieldType.INTEGER,
        smallImageUrl: Influx.FieldType.STRING,
        bigImageUrlSpare: Influx.FieldType.STRING,
        smallImageUrlSpare: Influx.FieldType.STRING,
        taskId: Influx.FieldType.INTEGER,
        score: Influx.FieldType.INTEGER,
        plateTypeCode: Influx.FieldType.STRING,
        plateColorCode: Influx.FieldType.STRING,
        callCode: Influx.FieldType.STRING,
        mistakeCode: Influx.FieldType.STRING,
        coDriverBeltCode: Influx.FieldType.STRING,
        coDriverPersonCode: Influx.FieldType.STRING,
        crashCode: Influx.FieldType.STRING,
        dangerCode: Influx.FieldType.STRING,
        dropCode: Influx.FieldType.STRING,
        mainDriverBeltCode: Influx.FieldType.STRING,
        paperCode: Influx.FieldType.STRING,
        rackCode: Influx.FieldType.STRING,
        slagCode: Influx.FieldType.STRING,
        spareTireCode: Influx.FieldType.STRING,
        sunCode: Influx.FieldType.STRING,
        sunroofCode: Influx.FieldType.STRING,
        tagNum: Influx.FieldType.STRING,
        mannedCode: Influx.FieldType.STRING,
        convertibleCode: Influx.FieldType.STRING,
        carFamilyName: Influx.FieldType.STRING,
        carBrandName: Influx.FieldType.STRING,
        carStyleName: Influx.FieldType.STRING,
        plateLicence: Influx.FieldType.STRING
      },
      tags: ['type', 'videoChannel', 'colorCode', 'carKindCode']
    },
    {
      measurement: 'nonVehicles', // 非机动车 包含摩托车、自行车
      fields: {
        guid: Influx.FieldType.STRING,
        structServerId: Influx.FieldType.STRING, // 结构化服务器的内部唯一标识
        structServerIp: Influx.FieldType.STRING,
        channelName: Influx.FieldType.STRING, // 通道名称
        resourceId: Influx.FieldType.STRING, // 资源id
        snapshotTime: Influx.FieldType.INTEGER,
        captureTime: Influx.FieldType.INTEGER,
        bodyRect: Influx.FieldType.STRING,
        bigImageUrl: Influx.FieldType.STRING,
        bigImageHeight: Influx.FieldType.INTEGER,
        bigImageWidth: Influx.FieldType.INTEGER,
        smallImageUrl: Influx.FieldType.STRING,
        bigImageUrlSpare: Influx.FieldType.STRING,
        smallImageUrlSpare: Influx.FieldType.STRING,
        taskId: Influx.FieldType.INTEGER,
        score: Influx.FieldType.INTEGER,
        babyCode: Influx.FieldType.STRING,
        bagCode: Influx.FieldType.STRING,
        barrowCode: Influx.FieldType.STRING,
        bottomTypeCode: Influx.FieldType.STRING,
        bottomColorCode: Influx.FieldType.STRING,
        glassesCode: Influx.FieldType.STRING,
        hatCode: Influx.FieldType.STRING,
        hairCode: Influx.FieldType.STRING,
        knapsackCode: Influx.FieldType.STRING,
        maskCode: Influx.FieldType.STRING,
        orientationCode: Influx.FieldType.STRING,
        trolleyCaseCode: Influx.FieldType.STRING,
        umbrellaCode: Influx.FieldType.STRING,
        upperTextureCode: Influx.FieldType.STRING,
        upperTypeCode: Influx.FieldType.STRING
      },
      tags: [
        'type',
        'isPedestrain', // 骑车人
        'videoChannel',
        'ageCode',
        'sexCode',
        'upperColorCode'
      ]
    },
    {
      measurement: 'defenseAlarms', // 布控报警推送的数据
      fields: {
        structServerId: Influx.FieldType.STRING, // 结构化服务器的内部唯一标识
        structServerIp: Influx.FieldType.STRING,
        objectId: Influx.FieldType.STRING,
        guid: Influx.FieldType.STRING,
        type: Influx.FieldType.INTEGER,
        defenseTaskId: Influx.FieldType.STRING, // 布控任务 ip-id 例 192.168.22.70-12
        channelName: Influx.FieldType.STRING, // 通道名称
        resourceId: Influx.FieldType.STRING, // 资源id
        bodyRect: Influx.FieldType.STRING, // 行人在图中的坐标位置
        carRect: Influx.FieldType.STRING, // 车辆在图中的坐标位置
        captureTime: Influx.FieldType.INTEGER, // 目标被识别的时间，最佳出现时间
        outTimestamp: Influx.FieldType.INTEGER, // 目标离开的时间
        bigImageUrl: Influx.FieldType.STRING,
        smallImageUrl: Influx.FieldType.STRING,
        bigImageUrlSpare: Influx.FieldType.STRING,
        smallImageUrlSpare: Influx.FieldType.STRING,
        dealWith: Influx.FieldType.INTEGER, // 是否已处理
        ageCode: Influx.FieldType.INTEGER,
        babyCode: Influx.FieldType.INTEGER,
        bagCode: Influx.FieldType.INTEGER,
        barrowCode: Influx.FieldType.INTEGER,
        bottomColorCode: Influx.FieldType.INTEGER,
        bottomTypeCode: Influx.FieldType.INTEGER,
        glassesCode: Influx.FieldType.INTEGER,
        hairCode: Influx.FieldType.INTEGER,
        hatCode: Influx.FieldType.INTEGER,
        knapsackCode: Influx.FieldType.INTEGER,
        maskCode: Influx.FieldType.INTEGER,
        orientationCode: Influx.FieldType.INTEGER,
        sexCode: Influx.FieldType.INTEGER,
        trolleyCaseCode: Influx.FieldType.INTEGER,
        umbrellaCode: Influx.FieldType.INTEGER,
        upperColorCode: Influx.FieldType.INTEGER,
        upperTextureCode: Influx.FieldType.INTEGER,
        upperTypeCode: Influx.FieldType.INTEGER,
        isPedestrain: Influx.FieldType.INTEGER, // 是否骑车
        plateLicence: Influx.FieldType.STRING,
        plateTypeCode: Influx.FieldType.INTEGER,
        plateColorCode: Influx.FieldType.INTEGER,
        plateFlagCode: Influx.FieldType.INTEGER,
        brandName: Influx.FieldType.STRING,
        carKindCode: Influx.FieldType.INTEGER,
        mistakeCode: Influx.FieldType.INTEGER,
        colorCode: Influx.FieldType.INTEGER,
        crashCode: Influx.FieldType.INTEGER,
        callCode: Influx.FieldType.INTEGER,
        rackCode: Influx.FieldType.INTEGER,
        spareTireCode: Influx.FieldType.INTEGER,
        sunroofCode: Influx.FieldType.INTEGER,
        dangerCode: Influx.FieldType.INTEGER,
        mainDriverBeltCode: Influx.FieldType.INTEGER,
        coDriverBeltCode: Influx.FieldType.INTEGER,
        slagCode: Influx.FieldType.INTEGER,
        tagCode: Influx.FieldType.INTEGER,
        paperCode: Influx.FieldType.INTEGER,
        sunCode: Influx.FieldType.INTEGER,
        dropCode: Influx.FieldType.INTEGER,
        mannedCode: Influx.FieldType.INTEGER,
        convertibleCode: Influx.FieldType.INTEGER
      },
      tags: ['videoChannel', 'taskName']
    }
  ]
})

postal.subscribe({
  channel: 'videoStructure',
  topic: 'param.saveTime',
  callback: function (data, envelope) {
    influxdb.alterRetentionPolicy(DefaultRetentionPolicy, {
      database: InfluxDatabaseName,
      isDefault: true,
      duration: `${data}d SHARD DURATION 1d`,
      replication: 1
    })
  }
})

influxdb
  .createDatabase(InfluxDatabaseName)
  .then(() => {
    influxdb.createRetentionPolicy(DefaultRetentionPolicy, {
      database: InfluxDatabaseName,
      isDefault: true,
      duration: '30d',
      replication: 1
    })
  })
  .then(() => {
    // 创建连续查询，加快数据统计查询速度
    // 行人流量 TOP10 连续查询，每小时统计一次
    influxdb.createContinuousQuery(
      'ped_flow_top10_1h',
      'SELECT count(captureTime) INTO "pedFlowTop10" FROM "pedestrains" GROUP BY time(1h), videoChannel',
      InfluxDatabaseName
    )
    // 机动车流量 TOP10 连续查询，每小时统计一次
    influxdb.createContinuousQuery(
      'veh_flow_top10_1h',
      'SELECT count(captureTime) INTO "vehFlowTop10" FROM "vehicles" GROUP BY time(1h), videoChannel',
      InfluxDatabaseName
    )
    // 非机动车流量 TOP10 连续查询，每小时统计一次
    influxdb.createContinuousQuery(
      'nonVeh_flow_top10_1h',
      'SELECT count(captureTime) INTO "nonVehFlowTop10" FROM "nonVehicles" GROUP BY time(1h), videoChannel',
      InfluxDatabaseName
    )
    // 布控报警时段数量统计 连续查询，每小时统计一次
    influxdb.createContinuousQuery(
      'defenseAlarm_1h',
      'SELECT count(captureTime) INTO "defenseAlarmTimeSlot" FROM "defenseAlarms" GROUP BY time(1h)',
      InfluxDatabaseName
    )
  })
  .catch(error => {
    console.log(`创建结构化数据出错 - ${error.message}`)
  })

exports.influxdb = influxdb
