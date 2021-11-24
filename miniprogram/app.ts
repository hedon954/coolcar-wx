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