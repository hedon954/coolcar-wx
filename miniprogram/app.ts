import camelcaseKeys from "camelcase-keys"
import { IAppOption } from "./appoption"
import { auth } from "./service/proto_gen/auth/auth_pb"

const userInfoKey = 'userinfo'

// app.ts
App<IAppOption>({
  globalData: {
    userInfo: undefined as WechatMiniprogram.UserInfo | undefined
  },
  
  onLaunch() {

    //登录
    wx.login( {
      success: res => {
        console.log(res.code)
        wx.request({
          url: "http://localhost:9527/v1/auth/login",
          method: "POST",
          data: {
            code: res.code
          } as auth.v1.LoginRequest,
          success: console.log,
          fail: console.error
        })
      }
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