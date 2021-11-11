export namespace routing {

    // driving 驾驶页
    export interface DrivingOpts{
        trip_id: string,

    }
    export function driving(o: DrivingOpts) {
        return `/pages/driving/driving?trip_id=${o.trip_id}`
    }


    // register 注册页
    export interface RegisterOpts{
        redirect?: string
    }
    export interface RegisterParams{
        redirectURL: string
    }
    export function register(o: RegisterParams) {
        var url = '/pages/register/register'
        if(o.redirectURL) {
            url = `${url}?redirect=${encodeURIComponent(o.redirectURL)}`
        }
        return url
    }

    // lock 开锁页
    export interface LockOpts {
        car_id: string
    }
    export function lock(o: LockOpts) {
        return `/pages/lock/lock?car_id=${o.car_id}`
    }

    // mytrips 我的行程页
    export function mytrips(){
        return `/pages/mytrips/mytrips`
    }
}