/*
 * @Description: 视频结构化相关枚举值
 * @Author: yubeixin copy
 */
'use strict'

// 年龄
const AgeCodeEnum = {
  CHILD: 1, // 儿童
  YOUTH: 2, // 青年
  MIDDLEAGE: 3, // 中年
  OLDAGE: 4, // 老年
  YOUNG: 5 // 少年
}

const AgeCodeNameEnum = {
  [AgeCodeEnum.CHILD]: '儿童',
  [AgeCodeEnum.YOUTH]: '青年',
  [AgeCodeEnum.MIDDLEAGE]: '中年',
  [AgeCodeEnum.OLDAGE]: '老年',
  [AgeCodeEnum.YOUNG]: '少年'
}

// 抱小孩
const BabyCodeEnum = {
  BABY: 1, // 抱小孩
  NOTBABY: 2, // 未抱小孩
  BACKBABY: 3 // 背小孩
}

const BabyCodeNameEnum = {
  [BabyCodeEnum.BABY]: '抱小孩',
  [BabyCodeEnum.NOTBABY]: '未抱小孩',
  [BabyCodeEnum.BACKBABY]: '背小孩'
}

// 拎东西
const BagCodeEnum = {
  BAG: 1, // 未拎东西
  NOTBAG: 2 // 拎东西
}

const BagNameEnum = {
  [BagCodeEnum.BAG]: '未拎东西',
  [BagCodeEnum.NOTBAG]: '拎东西'
}

// 下装颜色
const BottomColorCodeEnum = {
  GRAY: 1, // 灰
  WHITE: 2, // 白
  RED: 3, // 红
  GREEN: 4, // 绿
  BLUE: 5, // 蓝
  YELLOW: 6, // 黄
  BLACK: 7, // 黑
  PURPLE: 8, // 紫
  DARKGRAY: 9 // 深灰
}

const BottomColorNameEnum = {
  [BottomColorCodeEnum.GRAY]: '灰',
  [BottomColorCodeEnum.WHITE]: '白',
  [BottomColorCodeEnum.RED]: '红',
  [BottomColorCodeEnum.GREEN]: '绿',
  [BottomColorCodeEnum.BLUE]: '蓝',
  [BottomColorCodeEnum.YELLOW]: '黄',
  [BottomColorCodeEnum.BLACK]: '黑',
  [BottomColorCodeEnum.PURPLE]: '紫',
  [BottomColorCodeEnum.DARKGRAY]: '深灰'
}

// 下装款式
const BottomTypeCodeEnum = {
  PANTS: 1, // 长裤
  SHORTS: 2, // 短裤
  CAPRIPANTS: 3, // 七分裤
  SKIRT: 4 // 裙子
}

const BottomTypeNameEnum = {
  [BottomTypeCodeEnum.PANTS]: '长裤',
  [BottomTypeCodeEnum.SHORTS]: '短裤',
  [BottomTypeCodeEnum.CAPRIPANTS]: '七分裤',
  [BottomTypeCodeEnum.SKIRT]: '裙子'
}

// 发型
const HairCodeEnum = {
  LONGHAIR: 1, // 长发
  SHORTHAIR: 2, // 短发
  PONYTAIL: 3, // 马尾
  OBSCURED: 4, // 被遮挡
  BUNHAIR: 5 // 盘发
}

const HairNameEnum = {
  [HairCodeEnum.LONGHAIR]: '长发',
  [HairCodeEnum.SHORTHAIR]: '短发',
  [HairCodeEnum.PONYTAIL]: '马尾',
  [HairCodeEnum.OBSCURED]: '被遮挡',
  [HairCodeEnum.BUNHAIR]: '盘发'
}

// 帽子
const HatCodeEnum = {
  NOTHAT: 1, // 未戴帽子
  HAT: 2, // 戴帽子
  HELMET: 3, // 戴头盔
  COATHAT: 4, // 连衣帽
  SCARF: 5 // 头巾
}

const HatNameEnum = {
  [HatCodeEnum.NOTHAT]: '未戴帽子',
  [HatCodeEnum.HAT]: '戴帽子',
  [HatCodeEnum.HELMET]: '戴头盔',
  [HatCodeEnum.COATHAT]: '连衣帽',
  [HatCodeEnum.SCARF]: '头巾'
}

// 背包
const KnapsackCodeEnum = {
  NOTKNAPSACK: 1, // 未背包
  KNAPSACK: 2, // 双肩包
  UNCONFIRMED: 3 // 未确定
}

const KnapsackNameEnum = {
  [KnapsackCodeEnum.NOTKNAPSACK]: '未背包',
  [KnapsackCodeEnum.KNAPSACK]: '双肩包',
  [KnapsackCodeEnum.UNCONFIRMED]: '未确定'
}

// 朝向
const OrientationCodeEnum = {
  FRONT: 1, // 前
  AFTER: 2, // 后
  SIDE: 3, // 侧
  LEFT: 4, // 左
  RIGHT: 5 // 右
}

const OrientationNameEnum = {
  [OrientationCodeEnum.FRONT]: '前',
  [OrientationCodeEnum.AFTER]: '后',
  [OrientationCodeEnum.SIDE]: '侧',
  [OrientationCodeEnum.LEFT]: '左',
  [OrientationCodeEnum.RIGHT]: '右'
}

// 性别
const SexCodeEnum = {
  MAN: 1, // 男
  WOMAN: 2 // 女
}

const SexNameEnum = {
  [SexCodeEnum.MAN]: '男',
  [SexCodeEnum.WOMAN]: '女'
}

// 打伞
const UmbrellaCodeEnum = {
  NOTUMBRELLA: 1, // 未打伞
  UMBRELLA: 2 // 打伞
}

const UmbrellaNameEnum = {
  [UmbrellaCodeEnum.NOTUMBRELLA]: '未打伞',
  [UmbrellaCodeEnum.UMBRELLA]: '打伞'
}

// 上装颜色
const UpperColorCodeEnum = {
  GRAY: 1, // 灰
  WHITE: 2, // 白
  RED: 3, // 红
  GREEN: 4, // 绿
  BLUE: 5, // 蓝
  YELLOW: 6, // 黄
  BLACK: 7, // 黑
  PURPLE: 8, // 紫
  DARKGRAY: 9 // 深灰
}

const UpperColorNameEnum = {
  [UpperColorCodeEnum.GRAY]: '灰',
  [UpperColorCodeEnum.WHITE]: '白',
  [UpperColorCodeEnum.RED]: '红',
  [UpperColorCodeEnum.GREEN]: '绿',
  [UpperColorCodeEnum.BLUE]: '蓝',
  [UpperColorCodeEnum.YELLOW]: '黄',
  [UpperColorCodeEnum.BLACK]: '黑',
  [UpperColorCodeEnum.PURPLE]: '紫',
  [UpperColorCodeEnum.DARKGRAY]: '深灰'
}

// 下装款式
const UpperTypeCodeEnum = {
  LONGSHIRT: 1, // 长袖
  SHORTSHIRT: 2, // 短袖
  DOWNJACKET: 3, // 羽绒服
  COAT: 4, // 普通外套
  NOTCOAT: 5 // 无外套
}

const UpperTypeNameEnum = {
  [UpperTypeCodeEnum.LONGSHIRT]: '长袖',
  [UpperTypeCodeEnum.SHORTSHIRT]: '短袖',
  [UpperTypeCodeEnum.DOWNJACKET]: '羽绒服',
  [UpperTypeCodeEnum.COAT]: '普通外套',
  [UpperTypeCodeEnum.NOTCOAT]: '无外套'
}

// 上装纹理
const UpperTextureCodeEnum = {
  LATTICE: 1,
  PATTERN: 2,
  STRIPE: 3,
  SOLIDCOLOR: 4
}

const UpperTextureNameEnum = {
  [UpperTextureCodeEnum.LATTICE]: '格子',
  [UpperTextureCodeEnum.PATTERN]: '花纹',
  [UpperTextureCodeEnum.STRIPE]: '条纹',
  [UpperTextureCodeEnum.SOLIDCOLOR]: '纯色'
}

// 识别类型
const TypeCodeEnum = {
  UNDEFINED: -1, // 未定义的类型
  UNKNOWN: 0, // 未知类型
  PEDESTRIAN: 1, // 行人
  BIKE: 2, // 自行车
  MOTORCYCLE: 3, // 摩托车
  CAR: 4, // 轿车
  TRICYCLE: 5, // 三轮车
  BUS: 6, // 大客车
  VAN: 7, // 面包车
  TRUCK: 8 // 卡车
}

const TypeNameEnum = {
  [TypeCodeEnum.UNDEFINED]: '未定义的类型',
  [TypeCodeEnum.UNKNOWN]: '未知类型',
  [TypeCodeEnum.PEDESTRIAN]: '行人',
  [TypeCodeEnum.BIKE]: '自行车',
  [TypeCodeEnum.MOTORCYCLE]: '摩托车',
  [TypeCodeEnum.CAR]: '轿车',
  [TypeCodeEnum.TRICYCLE]: '三轮车',
  [TypeCodeEnum.BUS]: '大客车',
  [TypeCodeEnum.VAN]: '面包车',
  [TypeCodeEnum.TRUCK]: '卡车'
}

// 号牌类型
// 没有 5 25
const PlateTypeCodeEnum = {
  YELLOWCARD: 1, // 黄牌（大型汽车）
  BLUECARD: 2, // 蓝牌（小型汽车）
  EMBASSY: 3, // 使馆
  CONSULATE: 4, // 领馆
  FOREIGN: 6, // 外籍
  TWOORTHREEMOTOMOTORCYCLE: 7, // 两、三轮摩托车
  LIGHTMOTORCYCLE: 8, // 轻便摩托车
  EMBASSYMOTORCYCLE: 9, // 使馆摩托车
  CONSULATEMOTORCYCLE: 10, // 领馆摩托车
  OVERSEASMOTORCYCLE: 11, // 境外摩托车
  FOREIGNMOTORCYCLE: 12, // 外籍摩托车
  AGRICULTUREMOTORCYCLE: 13, // 农用摩托车
  TRACTOR: 14, // 拖拉机号牌
  TRAILER: 15, // 挂车
  COACHCAR: 16, // 教练汽车
  COACHMOTORCYCLE: 17, // 教练摩托车
  EXPERIMENTCAR: 18, // 实验汽车
  EXPERIMENTMOTORCYCLE: 19, // 实验摩托车
  TEMPORARYENTRYCAR: 20, // 临时入境汽车
  TEMPORARYENTRYMOTORCYCLE: 21, // 临时入境摩托车
  TEMPORARYTRAVEL: 22, // 临时行驶车
  POLICECAR: 23, // 警车
  POLICEMOTORCYCLE: 24, // 警用摩托车
  HONGKONG: 26, // 港籍
  AUSTRALIAN: 27, // 澳籍
  ARMEDPOLICE: 31, // 武警
  MILITARYCAR: 32, // 军车
  SMALLNEWENERGY: 34, // 小型新能源车牌
  BIGNEWENERGY: 35, // 大型新能源车牌
  UNCONFIRMED: 99 // 无法确定
}

const PlateTypeNameEnum = {
  [PlateTypeCodeEnum.YELLOWCARD]: '黄牌（大型汽车）',
  [PlateTypeCodeEnum.BLUECARD]: '蓝牌（小型汽车）',
  [PlateTypeCodeEnum.EMBASSY]: '使馆',
  [PlateTypeCodeEnum.CONSULATE]: '领馆',
  [PlateTypeCodeEnum.FOREIGN]: '外籍',
  [PlateTypeCodeEnum.TWOORTHREEMOTOMOTORCYCLE]: '两、三轮摩托车',
  [PlateTypeCodeEnum.LIGHTMOTORCYCLE]: '轻便摩托车',
  [PlateTypeCodeEnum.EMBASSYMOTORCYCLE]: '使馆摩托车',
  [PlateTypeCodeEnum.CONSULATEMOTORCYCLE]: '领馆摩托车',
  [PlateTypeCodeEnum.OVERSEASMOTORCYCLE]: '境外摩托车',
  [PlateTypeCodeEnum.FOREIGNMOTORCYCLE]: '外籍摩托车',
  [PlateTypeCodeEnum.AGRICULTUREMOTORCYCLE]: '农用摩托车',
  [PlateTypeCodeEnum.TRACTOR]: '拖拉机号牌',
  [PlateTypeCodeEnum.TRAILER]: '挂车',
  [PlateTypeCodeEnum.COACHCAR]: '教练汽车',
  [PlateTypeCodeEnum.COACHMOTORCYCLE]: '教练摩托车',
  [PlateTypeCodeEnum.EXPERIMENTCAR]: '实验汽车',
  [PlateTypeCodeEnum.EXPERIMENTMOTORCYCLE]: '实验摩托车',
  [PlateTypeCodeEnum.TEMPORARYENTRYCAR]: '临时入境汽车',
  [PlateTypeCodeEnum.TEMPORARYENTRYMOTORCYCLE]: '临时入境摩托车',
  [PlateTypeCodeEnum.TEMPORARYTRAVEL]: '临时行驶车',
  [PlateTypeCodeEnum.POLICECAR]: '警车',
  [PlateTypeCodeEnum.POLICEMOTORCYCLE]: '警用摩托车',
  [PlateTypeCodeEnum.HONGKONG]: '港籍',
  [PlateTypeCodeEnum.AUSTRALIAN]: '澳籍',
  [PlateTypeCodeEnum.ARMEDPOLICE]: '武警',
  [PlateTypeCodeEnum.MILITARYCAR]: '军车',
  [PlateTypeCodeEnum.SMALLNEWENERGY]: '小型新能源车牌',
  [PlateTypeCodeEnum.BIGNEWENERGY]: '大型新能源车牌',
  [PlateTypeCodeEnum.UNCONFIRMED]: '无法确定'
}

// 车牌颜色
const PlateColorCodeEnum = {
  YELLOW: 1, // 黄
  BLUE: 2, // 蓝
  BLACK: 3, // 黑
  WHITE: 4, // 白
  GREEN: 5, // 绿
  YELLOWGREEN: 6, // 黄绿
  GRADIENTGREEN: 7 // 渐变绿
}

const PlateColorNameEnum = {
  [PlateColorCodeEnum.YELLOW]: '黄',
  [PlateColorCodeEnum.BLUE]: '蓝',
  [PlateColorCodeEnum.BLACK]: '黑',
  [PlateColorCodeEnum.WHITE]: '白',
  [PlateColorCodeEnum.GREEN]: '绿',
  [PlateColorCodeEnum.YELLOWGREEN]: '黄绿',
  [PlateColorCodeEnum.GRADIENTGREEN]: '渐变绿'
}

// 车牌识别类型
const PlateFlagCodeEnum = {
  EMPTYCARD: 0, // 空牌
  SINGLECARD: 1, // 单牌
  DOUBBLECARD: 2, // 双牌
  NEWENERGYCARD: 3, // 新能源
  FALSEDETECTED: 4, // 误检
  TOOSMALLCARD: 5, // 车牌太小
  NODETECTED: 6, // 未检测到车牌
  FULLOBSCURED: 7 // 号牌完全遮挡
}

const PlateFlagNameEnum = {
  [PlateFlagCodeEnum.EMPTYCARD]: '空牌',
  [PlateFlagCodeEnum.SINGLECARD]: '单牌',
  [PlateFlagCodeEnum.DOUBBLECARD]: '双牌',
  [PlateFlagCodeEnum.NEWENERGYCARD]: '新能源',
  [PlateFlagCodeEnum.FALSEDETECTED]: '误检',
  [PlateFlagCodeEnum.TOOSMALLCARD]: '车牌太小',
  [PlateFlagCodeEnum.NODETECTED]: '未检测到车牌',
  [PlateFlagCodeEnum.FULLOBSCURED]: '号牌完全遮挡'
}

// 车辆类型
const CarKindCodeEnum = {
  OTHER: 0, // 其他
  CAR: 1, // 轿车
  SUV: 2, // 越野车
  BUSINESSCAR: 3, // 商务车
  SMALLTRUCK: 4, // 小型货车
  BIGTRUCK: 5, // 大型货车
  LIGHTBUS: 6, // 轻客
  SMALLBUS: 7, // 小型客车
  BIGBUS: 8, // 大型客车
  TRICYCLE: 9, // 三轮车
  MICROVAN: 10, // 微面
  PICKUPTRUCKS: 11, // 皮卡车
  TRAILER: 12, // 挂车
  CONCRETEMIXERTRUCK: 13, // 混凝土搅拌车
  TANKER: 14, // 罐车
  CRANE: 15, // 随车吊
  FIRETRUCK: 16, // 消防车
  MUCKTRUCK: 17, // 渣土车
  CARRIERCAR: 18, // 押运车
  ENGREPAIRCAR: 19, // 工程抢修车
  AMBULANCE: 20, // 救援车
  FENCETRUCK: 21 // 栏板卡车
}

const CarKindNameEnum = {
  [CarKindCodeEnum.OTHER]: '其他',
  [CarKindCodeEnum.CAR]: '轿车',
  [CarKindCodeEnum.SUV]: '越野车',
  [CarKindCodeEnum.BUSINESSCAR]: '商务车',
  [CarKindCodeEnum.SMALLTRUCK]: '小型货车',
  [CarKindCodeEnum.BIGTRUCK]: '大型货车',
  [CarKindCodeEnum.LIGHTBUS]: '轻客',
  [CarKindCodeEnum.SMALLBUS]: '小型客车',
  [CarKindCodeEnum.BIGBUS]: '大型客车',
  [CarKindCodeEnum.TRICYCLE]: '三轮车',
  [CarKindCodeEnum.MICROVAN]: '微面',
  [CarKindCodeEnum.PICKUPTRUCKS]: '皮卡车',
  [CarKindCodeEnum.TRAILER]: '挂车',
  [CarKindCodeEnum.CONCRETEMIXERTRUCK]: '混凝土搅拌车',
  [CarKindCodeEnum.TANKER]: '罐车',
  [CarKindCodeEnum.CRANE]: '随车吊',
  [CarKindCodeEnum.FIRETRUCK]: '消防车',
  [CarKindCodeEnum.MUCKTRUCK]: '渣土车',
  [CarKindCodeEnum.CARRIERCAR]: '押运车',
  [CarKindCodeEnum.ENGREPAIRCAR]: '工程抢修车',
  [CarKindCodeEnum.AMBULANCE]: '救援车',
  [CarKindCodeEnum.FENCETRUCK]: '栏板卡车'
}

// 车辆颜色
const CarColorCodeEnum = {
  BLACK: 1, // 黑色
  BLUE: 2, // 蓝色
  BROWN: 3, // 棕色
  GREEN: 4, // 绿色
  SILVER: 5, // 银色
  WHITE: 6, // 白色
  RED: 7, // 红色
  YELLOW: 8, // 黄色
  PINK: 9, // 粉色
  PURPLE: 10, // 紫色
  CYANBLUE: 11, // 青色
  GRAY: 12, // 灰色
  GOLD: 13, // 金色
  ORANGE: 14 // 橙色
}

const CarColorNameEnum = {
  [CarColorCodeEnum.BLACK]: '黑色',
  [CarColorCodeEnum.BLUE]: '蓝色',
  [CarColorCodeEnum.BROWN]: '棕色',
  [CarColorCodeEnum.GREEN]: '绿色',
  [CarColorCodeEnum.SILVER]: '银色',
  [CarColorCodeEnum.WHITE]: '白色',
  [CarColorCodeEnum.RED]: '红色',
  [CarColorCodeEnum.YELLOW]: '黄色',
  [CarColorCodeEnum.PINK]: '粉色',
  [CarColorCodeEnum.PURPLE]: '紫色',
  [CarColorCodeEnum.CYANBLUE]: '青色',
  [CarColorCodeEnum.GRAY]: '灰色',
  [CarColorCodeEnum.GOLD]: '金色',
  [CarColorCodeEnum.ORANGE]: '橙色'
}

// 车头/车尾
const CarStyleCodeEnum = {
  CARHEAD: 0,
  CARFOOT: 1
}

const CarStyleNameEnum = {
  [CarStyleCodeEnum.CARHEAD]: '车头',
  [CarStyleCodeEnum.CARFOOT]: '车尾'
}

// 渣土车| 打电话 | 主安全带 | 副安全带 | 危化品 | 撞损
const YesOrNoCodeEnum = {
  YES: 1, // 是 true
  NO: 2, // 否 false
  NOTKNOW: 9
}

const YesOrNoNameEnum = {
  [YesOrNoCodeEnum.YES]: '是',
  [YesOrNoCodeEnum.NO]: '否',
  [YesOrNoCodeEnum.NOTKNOW]: '未识别'
}

// 口罩 | 眼镜 | 拉杆箱 | 手推车 | 副驾乘客 | 备胎 | 天窗 | 纸巾盒  | 吊坠 | 行李架 | 遮阳板 | 载人 | 带篷
const NormalCodeEnum = {
  NOTKNOW: 9,
  HAVENOT: 1,
  HAVE: 2
}

const NormalNameEnum = {
  [NormalCodeEnum.HAVENOT]: '无',
  [NormalCodeEnum.HAVE]: '有',
  [NormalCodeEnum.NOTKNOW]: '未识别'
}

// 年检标
const TagCodeEnum = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8
}
const TagNameEnum = {
  [TagCodeEnum.ONE]: '1个',
  [TagCodeEnum.TWO]: '2个',
  [TagCodeEnum.THREE]: '3个',
  [TagCodeEnum.FOUR]: '4个',
  [TagCodeEnum.FIVE]: '5个',
  [TagCodeEnum.SIX]: '6个',
  [TagCodeEnum.SEVEN]: '7个',
  [TagCodeEnum.EIGHT]: '8个'
}
const PedestrainCodeEnum = { // 骑车人
  KNOW: 1,
  UNKNOW: 0
}
const PedestrainNameEnum = {
  [PedestrainCodeEnum.KNOW]: '有',
  [PedestrainCodeEnum.UNKNOW]: '无'
}

export default {
  AgeCodeEnum, // 年龄
  AgeCodeNameEnum,
  BabyCodeEnum, // 抱小孩
  BabyCodeNameEnum,
  BagCodeEnum, // 拎东西
  BagNameEnum,
  BottomColorCodeEnum, // 下装颜色
  BottomColorNameEnum,
  BottomTypeCodeEnum, // 下装款式
  BottomTypeNameEnum,
  HairCodeEnum, // 发型
  HairNameEnum,
  HatCodeEnum, // 帽子
  HatNameEnum,
  KnapsackCodeEnum, // 背包
  KnapsackNameEnum,
  OrientationCodeEnum, // 朝向
  OrientationNameEnum,
  SexCodeEnum, // 性别
  SexNameEnum,
  UmbrellaCodeEnum, // 打伞
  UmbrellaNameEnum,
  UpperColorCodeEnum, // 上装颜色
  UpperColorNameEnum,
  UpperTypeCodeEnum, // 下装款式
  UpperTypeNameEnum,
  TypeCodeEnum, // 识别类型
  TypeNameEnum,
  PlateTypeCodeEnum, // 号牌类型
  PlateTypeNameEnum,
  PlateColorCodeEnum, // 车牌颜色
  PlateColorNameEnum,
  PlateFlagCodeEnum, // 车牌识别类型
  PlateFlagNameEnum,
  CarKindCodeEnum, // 车辆类型
  CarKindNameEnum,
  CarColorCodeEnum, // 车辆颜色
  CarColorNameEnum,
  CarStyleCodeEnum, // 车头车尾
  CarStyleNameEnum,
  YesOrNoCodeEnum, // 渣土车| 打电话 | 主安全带 | 副安全带 | 危化品 | 撞损
  YesOrNoNameEnum,
  NormalCodeEnum, // 口罩 | 眼镜 | 拉杆箱 | 手推车 | 副驾乘客 | 备胎 | 天窗 | 纸巾盒  | 吊坠 | 行李架 | 遮阳板 | 载人 | 带篷
  NormalNameEnum,
  UpperTextureCodeEnum, // 上装纹理
  UpperTextureNameEnum,
  TagCodeEnum, // 年检标
  TagNameEnum,
  PedestrainCodeEnum, // 骑车人
  PedestrainNameEnum
}
