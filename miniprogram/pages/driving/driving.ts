// pages/driving/driving.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        charge: 12.34,
        duration: '01:23:12',
        location: {
            latitude: 32.92,
            longitude: 118.46
        },
        scale: 14,
    },


    onLoad() {
        this.setupLocationUpdator()
    },

    onUnload() {
        wx.startLocationUpdate()
    },

    /**
     * 更新当前地图位置
     */
    setupLocationUpdator() {
        wx.startLocationUpdate({
            fail: console.error
        })
        // 修改位置
        wx.onLocationChange(loc => {
            this.setData({
                location: {
                    latitude: loc.latitude,
                    longitude: loc.longitude
                }
            })
        })
    }
    
})