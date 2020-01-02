/**
 * 非机动车管理Schema
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NonVehicleSchema = new Schema({
  /* 非机动车图片 */
  image: {
    type: String
  },
  /* 非机动车二维码图片 */
  codeImage: {
    type: String
  },
  /* 是否为本人购买  0:否 1:是 */
  isOneSelf: {
    type: Number,
    default: 0,
    set: v => {
      if (typeof v !== 'number') {
        return (v === '否' && 0) || (v === '是' && 1)
      }
      return v
    }
  },
  /* 是否有发票 0:无 1:有 */
  isInvoice: {
    type: Number,
    default: 0,
    set: v => {
      if (typeof v !== 'number') {
        return (v === '无' && 0) || (v === '有' && 1)
      }
      return v
    }
  },
  /* 购买时间 */
  buyTime: {
    type: String
  },
  /* 拍照类型 0:临时  1:正式 */
  numberPlateType: {
    type: Number,
    default: 0,
    set: v => {
      if (typeof v !== 'number') {
        return (v === '临时' && 0) || (v === '正式' && 1)
      }
      return v
    }
  },
  /* 牌照号码 */
  numberPlate: {
    type: String
  },
  /* 校内车辆编号 */
  schoolCardNo: {
    type: String
  },
  /* 品牌 */
  brand: {
    type: String
  },
  /* 有效期 */
  periodOfValidity: {
    type: String
  },
  /* 颜色 */
  color: {
    type: String
  },
  /* 状态 0:正常 1:异常 */
  state: {
    type: Number,
    default: 0
  }
})

/**
 * 职工Schema
 */
const teacherSchema = new Schema({
  /* 教工号 */
  indentityNo: {
    type: String
  }
})

/**
 * 学生Schema
 */
const studentSchema = new Schema({
  /* 学工号 */
  indentityNo: {
    type: String
  },
  /* 学生类型0:非留学生  1:学生 */
  studentType: {
    type: Number,
    default: 0,
    set: v => {
      if (typeof v !== 'number') {
        return (v === '非留学生' && 0) || (v === '留学生' && 1)
      }
      return v
    }
  },
  /* 入学时间 */
  registerTime: {
    type: Date
  }
})

/**
 * 外聘Shcema
 */
const outTeacherSchema = new Schema({
  /* 教工号 */
  indentityNo: {
    type: String
  },
  /* 身份证号 */
  cardNo: {
    type: String
  }
})

/**
 * 家属Schema
 */
const familySchema = new Schema({
  /* 身份证号 */
  indentityNo: {
    type: String
  },
  /* 家属类型0:家属 1:委员会 */
  personType: {
    type: Number,
    default: 0,
    set: v => {
      if (typeof v !== 'number') {
        return (v === '家属' && 0) || (v === '居委会' && 1)
      }
      return v
    }
  }
})

/**
 * 其他Schema
 */
const otherSchema = new Schema({
  /* 身份证号 */
  indentityNo: {
    type: String
  }
})

const UserNonVehicleSchema = new Schema(
  {
    /* 组织机构编号 */
    orgId: {
      type: Schema.Types.ObjectId
    },
    /* 身份类型 0:职工 1:学生 2:外教 3:家属 4:其他 */
    identityType: {
      type: Number,
      default: 0,
      set: v => {
        if (typeof v !== 'number') {
          return (
            (v === '职工' && 0) ||
            (v === '学生' && 1) ||
            (v === '外聘' && 2) ||
            (v === '家属' && 3) ||
            (v === '其他' && 4)
          )
        }
        return v
      }
    },
    /* 姓名 */
    name: {
      type: String
    },
    /* 性别 0：男 1:女 */
    sex: {
      type: Number,
      default: 0,
      set: v => {
        if (typeof v !== 'number') {
          return (v === '男' && 0) || (v === '女' && 1)
        }
        return v
      }
    },
    /* 联系电话 */
    tel: {
      type: String
    },
    /* 家庭住址 */
    address: {
      type: String
    },
    /* 年龄 */
    age: {
      type: Number
    },
    /* 创建日期 */
    createTime: {
      type: Number,
      default: () => Math.round(new Date() / 1000)
    },
    /* 非机动车信息 */
    nonVehiclesInfos: NonVehicleSchema,
    /* 备注 */
    remark: {
      type: String
    },
    /* 身份信息 */
    indentityInfo:
      (this.identityType === 0 && teacherSchema) ||
      (this.identityType === 1 && studentSchema) ||
      (this.identityType === 2 && outTeacherSchema) ||
      (this.identityType === 3 && familySchema) ||
      (this.identityType === 4 && otherSchema)
  },
  { timestamps: true }
)

mongoose.model('userNonVehicles', UserNonVehicleSchema)
