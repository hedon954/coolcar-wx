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

interface MainItem {
    id: string,
    navId: string,
    navScrollId: string, 
    data: Trip
}

interface NavItem {
    id: string,
    mainId: string,
    label: string
}

interface MainItemQueryResult {
    id: string,
    top: number,
    dataset: {
        navId: string
        navScrollId: string
    }
}

// pages/mytrips/mytrips.ts
Page({

    scrollStates: {
        mainItems: [] as MainItemQueryResult[]
    },

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
        mainItems: [] as MainItem[],
        mainScroll: '',
        navItems: [] as NavItem[],
        swiperDuration: 500,
        navCount: 0,
        navSelect: '',
        navScroll: '',
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
            const height = wx.getSystemInfoSync().windowHeight - rect.height
            this.setData({
                tripsHeight: height,
                navCount: Math.round(height / 50)
            })
        }).exec()
    },

    /**
     * 获取行程
     */
    populateTirps() {
        const mainItems: MainItem[] = []
        const navItems: NavItem[] = []
        let preNav = ''
        // TODO: get trips from backend
        for(let i=0; i<100; i++){
            const mainId = 'main-' + i
            const navId = 'nav-' + i
            const tripId = (10001 + i).toString()
            if(!preNav) {
                preNav = navId
            }
            mainItems.push({
                id: mainId ,
                navId: navId,
                navScrollId: preNav,
                data: {
                    id: tripId,
                    start: '' + i,
                    end: '' + i,
                    duration: (10086 + i).toString() + " 秒",
                    charge: (4 + i).toFixed(2).toString(),
                    distance: (500.2 + i).toFixed(2).toString() + " 公里",
                    status: (i % 2 === 0) ? '已完成' : '未完成',
                }
            })
            navItems.push({
                id: navId,
                mainId: mainId, 
                label: tripId,
            })
            preNav = navId
        }
        var navSel = ''
        if(navItems.length > 0) {
            navSel = navItems[0].id
        }
        this.setData({
            mainItems: mainItems,
            navItems: navItems,
            navSelect: navSel
        }, () => {
            // 存下所有 mainItem 的高度
            this.prepareScrollStates()
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
    },


    /**
     * 点击 navItem，右边的列表对应移动
     */
    onNavItemTap(e: any){
        const mainId: string = e.currentTarget?.dataset?.mainId
        const navId: string = e.currentTarget?.id
        if(mainId && navId){
            this.setData({
                mainScroll: mainId,
                navSelect: navId
            })
        }
    },

    /**
     * 存下所有 mainItem 的高度
     */
    prepareScrollStates() {
        wx.createSelectorQuery().selectAll(".main-item")
            .fields({
                id: true,
                dataset: true,
                rect: true
            }).exec( res => {
                this.scrollStates.mainItems = res[0]
            })
    },


    /**
     * 滚动行程列表
     *  1. 左边同步选择
     *  2. 左边同步滚动
     */
    onMainScroll(e: any) {
        const top:number = e.currentTarget?.offsetTop + e.detail?.scrollTop
        if(top === undefined){
            return
        }
        const selItem = this.scrollStates.mainItems.find(v => v.top >= top)
        if(!selItem) {
            return
        }
        this.setData({
            navSelect: selItem.dataset.navId,
            navScroll: selItem.dataset.navScrollId
        })
    },

})