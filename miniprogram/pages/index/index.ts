// index.ts

import { routing } from "../../utils/routing"

// 获取应用实例
const app = getApp<IAppOption>()

const defaultAvatar = '/resources/car.png'
const initialLat = 23.099994
const initialLng = 114.324520

Page({
  isPageShowing: false,
  data: {
    avatarURL: '',
    setting: {
      skew: 0,
      rotate: 0,
      showLocation: true,
      showScale: true,
      subKey: '',
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false,
    },
    location: {
      latitude: initialLat,
      longitude: initialLng,
    },
    scale: 16,
    markers: [
      {
        iconPath: defaultAvatar,
        id: 0,
        latitude: 23.099994,
        longitude: 113.394520,
        width: 50,
        height: 50
      },
      {
        iconPath: defaultAvatar,
        id: 0,
        latitude: 23.099994,
        longitude: 112.324520,
        width: 50,
        height: 50
      }
    ],
  },

  onLoad(){
    const userInfo = app.globalData.userInfo
    this.setData({
      avatarURL: userInfo?.avatarUrl || ''
    })
  },

  onShow() {
    this.isPageShowing = true
    if(this.data.avatarURL === '') {
      const userInfo = app.globalData.userInfo
      this.setData({
        avatarURL: userInfo?.avatarUrl || ''
      })
    }
  },

  onHide() {
    this.isPageShowing = false
  },

  /**
   * 获取当前位置
   */
  onMyLocationTap () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          }
        })
      },
      fail: () => {
        wx.showToast({
          title: '请前往设置页授权地理位置',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  /**
   * 扫码租车
   */
  onScanTap() {
    wx.scanCode({
      success: res => {
        // TODO: get car id from scan result
        const carID = 'car123'
        const redirectURL = routing.lock({
          car_id: carID
        })
        wx.navigateTo({
          url: routing.register({
            redirectURL: redirectURL
          })
        })
      },
      fail: error => {
        console.log(error)
      }
    })
  },

  /**
   * 移动汽车
   */
  moveCars() {
    // 拿到 map 对象
    const map = wx.createMapContext("map")
    let dest = {
      latitude: 23.099994,
      longitude: 114.324520,
    }

    // 调用 map 的 api 来修改汽车位置
    // 效率更高
    const moveCar = () => {

      dest.latitude += 0.1,
      dest.longitude += 0.1,

      map.translateMarker({
        destination: {
          latitude: dest.latitude,
          longitude: dest.longitude,        
        },
        markerId: 0,
        autoRotate: false,
        rotate: 0,
        animationEnd: () => {
          if(this.isPageShowing) {
            moveCar()
          }
        },
      })
    }
    moveCar()
  },

  /**
   * 我的行程
   */
  onMyTripsTap() {
    wx.navigateTo({
      url: routing.mytrips(),
    })
  },

})
