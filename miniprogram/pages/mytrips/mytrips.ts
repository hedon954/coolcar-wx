// pages/mytrips/mytrips.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarURL: '',
        indicatorDots: true,
        autoPlay: false,
        interval: 3000,
        duration: 200,
        circular: true,
        multiItemCount: 1,
        prevMargin: '',
        nextMargin: '',
        vertical: false,
        current: 0,
        promotionItems: [
            {
                img: 'https://img4.mukewang.com/616fd58b000188b117920764.jpg',
                promotionID: 0,
            },
            {
                img: 'https://img4.mukewang.com/618cf9680001026517920764.jpg',
                promotionID: 1,
            },
            {
                img: 'https://img3.mukewang.com/6189d3670001587e17920766.jpg',
                promotionID: 2,
            },
            {
                img: 'https://img2.mukewang.com/618cf98400018c6617920764.jpg',
                promotionID: 3,
            },{
                img: 'https://img3.mukewang.com/61888765000124af17920764.jpg',
                promotionID: 4,
            }
        ],
    },

    onLoad() {
        const userInfo = getApp<IAppOption>().globalData.userInfo
        this.setData({
          avatarURL: userInfo?.avatarUrl || ''
        })
    },

    /**
     * 点击轮播中的图片
     */
    onPromotionItemTap(e: any) {
        const promotionID = e.currentTarget.dataset.promotionId
        if(promotionID !== undefined) {
            // claim this promotion
            wx.showToast({
                title: promotionID + '',
                icon: 'success',
            })
        }
    },

    /**
     * 获取用户头像
     */
    onGetUserInfoTap(e: any) {
        const userInfo: WechatMiniprogram.UserInfo = e.detail.userInfo
        if(userInfo && userInfo.nickName !== '微信用户') {
            this.setData({
                avatarURL: userInfo.avatarUrl
            })
            getApp<IAppOption>().globalData.userInfo = userInfo
            wx.setStorageSync('userinfo', userInfo)
        }
    },


    /**
     * 驾驶资格认证
     */
    onRegisterTap(){
        wx.navigateTo({
            url: '/pages/register/register'
        })
    }


    
})