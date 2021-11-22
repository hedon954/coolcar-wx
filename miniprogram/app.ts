import camelcaseKeys from "camelcase-keys"
import { IAppOption } from "./appoption"
import { coolcar } from "./service/proto_gen/trip_pb"

const userInfoKey = 'userinfo'

// app.ts
App<IAppOption>({
  globalData: {
    userInfo: undefined as WechatMiniprogram.UserInfo | undefined
  },
  
  onLaunch() {

    wx.request({
      url: 'http://localhost:8080/trip/trip123',
      method: 'GET',
      success: res => {
        const getTripRes = coolcar.GetTripResponse.fromObject(camelcaseKeys(res.data as object, {
          deep: true,
        }))
        console.log(getTripRes)
        console.log(coolcar.TripStatus[getTripRes.trip?.staus!])
      },
      fail: console.error
    })

    const userInfo = wx.getStorageSync(userInfoKey) || undefined
    if(!userInfo) {
      // 获取用户信息
      wx.getUserInfo({
        success: (res:any) => {
          const userInfo = res.userInfo
          if(userInfo && userInfo.nickName !== '微信用户'){
            wx.setStorageSync(userInfoKey, res.userInfo)
          }
        }
      })
    }
    this.globalData.userInfo = userInfo
  },

})