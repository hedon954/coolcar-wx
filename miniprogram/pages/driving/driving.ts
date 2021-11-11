import {formatDuration} from '../../utils/formatDuration'
import {formartCharge} from '../../utils/formatCharge'
import { routing } from '../../utils/routing'

// 一秒一分
const centPerSec = 1

Page({

    timer: undefined as number | undefined,

    /**
     * 页面的初始数据
     */
    data: {
        charge: '0.00',
        durationFormatted: '00:00:00',
        location: {
            latitude: 32.92,
            longitude: 118.46
        },
        scale: 14,
    },


    onLoad(opt: Record<'trip_id', string>) {
        const o: routing.DrivingOpts = opt
        console.log('driving pages, tripID: ' + o.trip_id)
        this.setupLocationUpdator()
        this.setupTimer()
    },

    onUnload() {
        wx.stopLocationUpdate()
        this.stopTimer()
    },

    /**
     * 实时根据当前位置更新当前地图位置
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
    },

    /**
     * 计时计费
     */
    setupTimer() {
        let durationSec = 0
        let cents = 0
        this.timer = setInterval(() => {
            durationSec += 1
            cents += centPerSec
            this.setData({
                durationFormatted: formatDuration(durationSec),
                charge: formartCharge(cents)
            })
        }, 1000)
    },

    /**
     * 关闭计费
     */
    stopTimer() {
        if(this.timer) {
            clearInterval(this.timer)
        }
    }

})