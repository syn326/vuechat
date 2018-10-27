/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login'
import Register from '@/view/Register'
import Home from '@/view/Home'
import Contact from '@/view/Contact'
import Chat from '@/view/Chat'
import AddContact from '@/view/AddContact'
import MsgBoardIndex from '@/view/MsgBoardIndex'
import MsgBoard from '@/view/MsgBoard'
import MsgCreate from '@/view/MsgCreate'
import getMyInfo from '@/view/getMyInfo'

Router.prototype.goBack = function () {
    this.isBack = true
    window.history.go(-1)
}
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/Register',
            name: 'Register',
            component: Register
        },
        {
            path: '/Home',
            component: Home,
            children: [{
                path: '',
                name: 'Contact',
                component: Contact
            }],
        },
        {
            path: '/Chat',
            name: 'Chat',
            component: Chat
        },
        {
            path: '/AddContact',
            name: 'AddContact',
            component: AddContact
        },
        {
            path: '/MsgBoardIndex',
            component: MsgBoardIndex,
            children: [{
                path: '',
                name: 'MsgBoard',
                component: MsgBoard
            },
                {
                    path: 'MsgCreate',
                    name: 'MsgCreate',
                    component: MsgCreate
                }]
        },
        {
            path: '/getMyInfo',
            name: 'getMyInfo',
            component: getMyInfo
        }
    ]
})
