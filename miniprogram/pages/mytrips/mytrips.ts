import { routing } from "../../utils/routing"

interface Trip {
    id: string
    start: string
    end: string
    duration: string
    charge: string
    distance: string
    status: string
}

// pages/mytrips/mytrips.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tripsHeight: 0,
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
        trips: [] as Trip[],
    },

    onLoad() {
        const userInfo = getApp<IAppOption>().globalData.userInfo
        this.setData({
          avatarURL: userInfo?.avatarUrl || ''
        })
        this.populateTirps()
    },

    onReady() {
        this.getTripsHeight()
    },

    /**
     * 获取行程列表高度
     */
    getTripsHeight(){
        wx.createSelectorQuery().select('#heading').boundingClientRect(rect =>{
            this.setData({
                tripsHeight: wx.getSystemInfoSync().windowHeight - rect.height
            })
        }).exec()
    },

    /**
     * 获取行程
     */
    populateTirps() {
        const trips: Trip[] = []
        // TODO: get trips from backend
        for(let i=0; i<100; i++){
            trips.push({
                id: (10001 + i).toString(),
                start: '' + i,
                end: '' + i,
                duration: (10086 + i).toString() + " 秒",
                charge: (4 + i).toFixed(2).toString(),
                distance: (500.2 + i).toFixed(2).toString() + " 公里",
                status: (i % 2 === 0) ? '已完成' : '未完成',
            })
        }
        this.setData({
            trips: trips
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
            url: routing.register({
                redirectURL: ''
            })
        })
    }


    
})