const shareLocationKey = "share_location"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        shareLocation: false,
        avatarURL: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
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
        console.log(e)
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})