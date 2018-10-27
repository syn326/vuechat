import Vue from 'vue'
import Vuex from 'vuex'
import url from '@/api/server.js'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // save theme
        themeColor: '',
        // store user info
        userInfo: {
            user_id: '',
            user_name: '',
            user_email: ''
        },
    },
    getters: {
        // set theme
        getThemeColor: state => {
            return state.themeColor
        },
        // get login user info.
        getUserinfo: state => {
            return state.userInfo
        },
    },
    mutations: {
        // set user info
        setUserinfo(state, userInfo) {
            state.userInfo.user_id = userInfo.user_id
            state.userInfo.user_name = userInfo.user_name,
            state.userInfo.user_email = userInfo.user_email
        },
        // set history msg
        setHistoryMsg(state, msgList) {
            state.msgInfo = msgList
        },
        // set contact list
        setContactList(state,contactList){
            state.contactInfo = contactList
        },
        // 设置主题颜色
        setThemeColor(state, color) {
            state.themeColor = color
        }
    },
    actions: {
        // register
        async register({commite}, data) {
            const res = await url.register(data)
            if (res.data.state === 0) {
                return {
                    status: 'fail',
                    data: res.data.data
                }
            }
            return {
                status: 'success',
                data: res.data.data
            }
        },
        // login
        async login({commite}, data) {
            const res = await url.login(data)
            if (res.data.state === 0) {
                return {
                    status: 'fail',
                    data: res.data.data
                }
            }
            return {
                status: 'success',
                data: res.data.data
            }
        },
        async addContact({commite},data){
            const res = await url.addcontact(data)
            if(res.data.state === 0){
                return {
                    status: 'fail',
                    data: res.data.data
                }
            }
            return {
                status: 'success',
                data: res.data.data
            }
        },
        //delete contact
        async deleteContact({commite},data){
            const res = await url.deletecontact(data)
            if(res.data.state === 0){
                return {
                    status: 'fail',
                    data: res.data.data
                }
            }
            return {
                status: 'success',
                data: res.data.data
            }
        },
        //get contact list
        async getContactList({commite},data){
            const res = await  url.getcontactlist(data)
            return {
                status: 'success',
                data: res.data.data.contactList
            }
        },
        // get history chat msg
        async getHistoryChatMsg({commite}, data) {
            const res = await url.gethistorychatmsg(data)
            return {
                status: 'success',
                data: res.data.data.msgList
            }
        },
        // save Msg
        async saveLeaveMsg({commite}, data) {
            const res = await	url.saveleavemsg(data)
            return {
                status: res.data.data.stateText
            }
        },
        // get msg board
        async getLeaveMsg({commite}) {
            const res = await url.getleavemsg()
            return {
                status: res.data.data.stateText,
                data: res.data.data.leaveMsg
            }
        }
    }
})
