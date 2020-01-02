<template>
    <div class="dutyNotice">
        <div class="header">
            <Button type="ghost" @click="eliminate">清除</Button>
            <Button type="ghost" @click="save">保存</Button>
        </div>
        <div class="notice-con">
            <div class="title">
                请输入值班公告：
            </div>
            <Input v-model="textCon" @on-change='textChange' :maxlength='1000' type="textarea" :rows='15' placeholder="请输入公告内容" />
            <div class="number-text">
                输入字数：{{number}}/1000字
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            textCon: '',
            number: 0,
        }
    },
    created() {
        this.getNotice().then(res => {
            this.textCon = res.data.notice
            this.textChange()
        })
    },
    methods: {
        ...mapActions(['getNotice', 'setNotice', 'deletedNotice']),
        eliminate() {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>是否清空值班公告？</p>',
            onOk: () => {
              this.deleteNotice()
            }
          })
        },
        deleteNotice() {
          this.deletedNotice().then(() => {
              this.textCon = ''
              this.textChange()
              this.successMsg('清除成功！')
          }).catch(() => {
              this.errorMsg('清除失败')
          })
        },
        save() {
            this.setNotice({ notice: this.textCon }).then(res => {
                this.successMsg('保存成功！')
            }).catch((err) => {
                console.log(err)
                this.errorMsg('保存失败')
            })
        },
        textChange() {
            this.number = this.textCon.length
        }
    }
}
</script>

<style scoped>
.dutyNotice{
    width: 100%;
    height: 100%;
    background: #1b3153;
}
button{
    margin-right: 8px;
}
.header{
    width: 100%;
    padding: 12px 24px;
}
.title{
    padding: 5px 0;
}
.notice-con{
    width: 600px;
    padding: 0 24px;
}
.number-text{
    text-align: right;
    padding: 5px 0;
}
</style>
