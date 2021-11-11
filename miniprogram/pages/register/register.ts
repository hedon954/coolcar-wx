import { routing } from "../../utils/routing"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        redirectURL: '',
        genders: ['未知', '男', '女', '其他'],
        genderIndex: 0,
        licNo: '',
        name: '',
        birthday: '1990-01-01',
        checkState: 'UNSUBMITTED' as 'UNSUBMITTED' | 'PENDING' | 'SUCCESS' | 'FAILED',  /** UNSUBMITTED 递交申请，PENDING 审查中，SUCCESS 审查通过，FAILED 审查失败 */
        licImgURL: undefined as string | undefined,
    },

    onLoad(opt: Record<'redirect', string>) {
        const o: routing.RegisterOpts = opt
        if(o.redirect){
            this.setData({
                redirectURL: decodeURIComponent(o.redirect)
            })
        }
    },

    /**
     * 上传驾照
     */
    onUploadLic() {
        wx.chooseImage({
            success: res => {
                if(res.tempFilePaths.length > 0) {
                    this.setData({
                        licImgURL: res.tempFilePaths[0]
                    })
                    // TODO: uoload image
                    setTimeout(() => {
                        this.setData({
                            licNo: '1111',
                            name: 'hedon',
                            genderIndex: 1,
                            birthday: '1999-04-07'
                        })
                    }, 1000);
                }
                
            }
        })
    },

    /**
     * 修改性别
     */
    onGenderChange(res: any){
        this.setData({
            genderIndex: res.detail.value
        })
    },

    /**
     * 修改出生日期
     */
    onBirthdayChange(res: any) {
        this.setData( {
            birthday: res.detail.value
        })
    },

    /**
     * 递交审查
     */
    onSubmit() {
        this.setData({
            checkState: 'PENDING',
        })
        // 1 秒后，随机成功与失败
        setTimeout(() => {
            this.onLicVerified()
        }, 1000);
    },

    onLicVerified() {
        var rand = Math.random()
        this.setData({
            checkState: rand > 0.5 ? 'SUCCESS' : 'FAILED'
        })
        if(this.data.redirectURL) {
            // 跳转到开锁界面
            wx.redirectTo({
                url: this.data.redirectURL
            })
        }
    },

    /**
     * 重新递交审查
     */
    onReSubmit() {
        this.setData({
            checkState: 'UNSUBMITTED',
            licImgURL: ''
        })
    },
})