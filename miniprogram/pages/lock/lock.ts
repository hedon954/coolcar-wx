import { routing } from "../../utils/routing"

const shareLocationKey = "share_location"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        shareLocation: false,
        avatarURL: '',
        carID: '000'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(opt: Record<'car_id', string>) {
        // 获取 carID
        const o: routing.LockOpts = opt
        console.log('lock pages, carID: ' + o.car_id)
        const userInfo = getApp<IAppOption>().globalData.userInfo
        if(userInfo) {
            this.setData({
                avatarURL: userInfo.avatarUrl,
                shareLocation: wx.getStorageSync(shareLocationKey) || false
            })
        }
    },

    /**
     * 获取用户信息
     */
    onGetUserInfo(e: any) {
        const userInfo: WechatMiniprogram.UserInfo = e.detail.userInfo
        if(userInfo && userInfo.nickName !== '微信用户') {
            this.setData({
                shareLocation: true,
                avatarURL: userInfo.avatarUrl
            })
            getApp<IAppOption>().globalData.userInfo = userInfo
            wx.setStorageSync(shareLocationKey, true)
            wx.setStorageSync('userinfo', userInfo)
        }
    },  

    /**
     * 是否分享当前位置
     */
    onShareLocation(e: any) {
        this.setData({
            shareLocation: e.detail.value
        })
        wx.setStorageSync(shareLocationKey, this.data.shareLocation)
    },

    /**
     * 开锁汽车
     */
    onUnlockCarTap() {
        // 获取当前位置
        wx.getLocation({
            type: 'gcj02',
            success: loc => {
                // TODO: 发送当前位置信息给后端
                console.log('starting a trip', {
                    location: {
                        latitude: loc.latitude,
                        longitude: loc.longitude
                    },
                    avatarURL: this.data.shareLocation ? this.data.avatarURL : '',
                    carID: this.data.carID,
                })

                // 创建行程
                const tripID = 'trip456'

                wx.showLoading({
                    title: '开锁中',
                    mask: true
                })
                setTimeout(() => {
                    wx.redirectTo({
                        url: routing.driving({
                            trip_id: tripID
                        }),
                        complete: () => {
                            wx.hideLoading()
                        }
                    })
                }, 2000);
            },
            fail: () => {
                wx.showToast({
                    icon: "error",
                    title: "请授权位置信息"
                })
            }
        })
        
    }
})