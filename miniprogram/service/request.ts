import camelcaseKeys from "camelcase-keys"
import { auth } from "./proto_gen/auth/auth_pb"

export namespace Coolcar {

    const serverAddr = 'http://localhost:9527'

    const AUTH_ERR = 'AUTH_ERR'

    const authData = {
        token: '',
        expiryMs: 0,
    }

    export interface RequestOption<REQ, RES> {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE'
        path: string
        data: REQ
        respMarshaller: (r: object) => RES
    }

    export interface AuthOption{
        attachAuthHeader: boolean
        retryOnAuthError: boolean
    }

    /**
     * 登录，并保存 token 及其 expireIn
     */
    export async function login() {
        if(authData.token && authData.expiryMs >= Date.now()){
            console.log('has login')
            return
        }
        const wxResq = await wxLogin()
        const reqTimeMs = Date.now()
        const resq = await sendRequest<auth.v1.ILoginRequest, auth.v1.ILoginResponse>({
            method: 'POST',
            path: '/v1/auth/login',
            data: {
                code: wxResq.code,
            },
            respMarshaller: auth.v1.LoginResponse.fromObject,
        },{
            attachAuthHeader: false,
            retryOnAuthError: false
        })
        authData.token = resq.accessToken!
        authData.expiryMs = reqTimeMs + resq.expiresIn! * 1000
        console.log('login success, token: ' + authData.token)
        console.log('expiryMs: ' + authData.expiryMs)
        console.log('now: ' + Date.now())
    }


    /**
     * 发送请求，可重试
     * @param o 
     * @param a 
     */
    export async function sendRequestWithRetry<REQ, RES>(o: RequestOption<REQ, RES>, a?:AuthOption): Promise<RES> {
        const authOpt = a || {
            attachAuthHeader: true,
            retryOnAuthError: true
        }
        try {
            // 先登录
            await login()
            console.log('login ok')
            return sendRequest(o, authOpt)
        } catch(err) {
            // 1. 是 auth error 且未重试过，则请求失败
            if(err === AUTH_ERR && authOpt.retryOnAuthError) {
                console.log('重试')
                authData.token = '',
                authData.expiryMs = 0
                return sendRequestWithRetry(o, {
                    attachAuthHeader: authOpt.attachAuthHeader,
                    retryOnAuthError: false
                })
            } else {
                console.log('重试过')
                throw err
            }
        }
    }

    /**
     * 发送请求
     * @param o    请求体
     * @param a    权限数据
     */
    function sendRequest<REQ, RES>(o: RequestOption<REQ, RES>, a:AuthOption): Promise<RES> {
        
        return new Promise((resolve, reject) => {
            const header: Record<string, any> = {}
            
            // 需要加 token 且可以加的时候才加
            if(a.attachAuthHeader) {
                // 需要token 且 token 有效
                if( authData.token && authData.expiryMs >= Date.now()) {
                    header.authorization = 'Bearer ' + authData.token
                } else {
                    // 需要 token 但是 token 无效
                    reject(AUTH_ERR)
                    return
                }
            }

            console.log('header: ' + header['authorization'])
        
            // 发送请求
            wx.request({
                url: serverAddr + o.path,
                method: o.method,
                data: o.data,
                header,
                // 序列化结果
                success: res => {
                    console.log(res)
                    if(res.statusCode === 401) {
                        reject(AUTH_ERR)
                    } else if (res.statusCode >= 400){
                        reject(res)
                    } else {
                        resolve(o.respMarshaller(
                            camelcaseKeys(res.data as object, {
                                deep: true
                            })
                        ))
                    }
                },
                fail: reject
            })
        })
    }


    /**
     * 登录
     * 
     *  将 wx.login 封装成 Promise 的形态
     */
    function wxLogin(): Promise<WechatMiniprogram.LoginSuccessCallbackResult> {
        return new Promise((resolve, reject) => {
            wx.login({
                success: resolve,
                fail: reject
            })
        }) 
    }
}