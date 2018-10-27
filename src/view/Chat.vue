<template>
    <div class="contain">
        <div class="top" :style="'background:'+getThemeColor">
            <div class="left-icon" @click="goBack()"></div>
            <span class="title">{{getUserinfo.user_id}}</span>
            <div class="right-icon"></div>
        </div>
        <div class="msg-content">
            <div class="loop-msg" v-for="(msg,index) in MsgList" :key="index">
                <other-msg :msg="msg" :index="index" v-if="msg.user_id!=getUserinfo.user_id&&msg.status!=='userstate'"></other-msg>
                <my-msg :msg="msg" v-else-if="msg.user_id==getUserinfo.user_id&&msg.status!=='userstate'"></my-msg>
                <div class="userstate" v-else-if="msg.status==='userstate'">
                    <div v-msg_content="msg.msg_content"></div>
                </div>
            </div>
        </div>
        <div class="bottom-input">
            <textarea col="2" v-model="InputMsg"></textarea>
            <div v-show="!InputMsg" class="btn-default">SEND</div>
            <div v-show="InputMsg" class="btn-active" @click="submit">SEND</div>
        </div>
        <!--<div class="extra-fun">-->
            <!--<div class="load-pic">-->
                <!--&lt;!&ndash;<input type="file" @change="upload"/>&ndash;&gt;-->
                <!--<img src="../assets/img/pic-icon.png" alt="pic-icon" width="70%" height="70%"/>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script type="text/javascript">
    import {mapGetters} from 'vuex'
    import io from 'socket.io-client'
    import {getItem} from '@/plugin/sessionStorage-plugin.js'
    import OtherMsg from '@/components/Msg/OtherMsg'
    import MyMsg from '@/components/Msg/MyMsg'
    export default{
        data() {
            return {
                MsgList: [],
                socket: null,
                InputMsg: '',
                contact_id: '',
                user_id: '',
                msgDOM: {}
            }
        },
        created() {
            this.InitData()
        },
        mounted() {
            this.msgDOM = document.querySelector('.msg-content')
             this.socket = io('http://123.206.62.224:3000')

            // 进入房间
            const infoObj = {
                status: 'userstate',
                user_id: this.getUserinfo.user_id,
                contact_id: this.contact_id
            }
            this.socket.emit('join-chat', infoObj)
            this.socket.on('join-chat', (joinInfo) => {
                this.MsgList.push(joinInfo)
                this.$nextTick(() => {
                    this.msgDOM.scrollTop = this.msgDOM.scrollHeight
                })
                console.log("MsgList" + MsgList)
            })
            // 聊天
            this.socket.on('chat-msg', (msg) => {
                console.log(msg)
                this.MsgList.push(msg)
                this.$nextTick(() => {
                    this.msgDOM.scrollTop = this.msgDOM.scrollHeight
                })
            })
            // 离开房间
            this.socket.on('leave-chat', (leaveInfo) => {
                this.MsgList.push(leaveInfo)
                this.$nextTick(() => {
                    this.msgDOM.scrollTop = this.msgDOM.scrollHeight
                })
            })
        },
        computed: {
            ...mapGetters([
                'getUserinfo',
                'getThemeColor'
            ])
        },
        methods: {
            async InitData() {
                this.$store.commit('setUserinfo', getItem('userInfo'))
                this.contact_id = this.$route.query.contact_id
                // 获取聊天信息
                const res = await this.$store.dispatch('getHistoryChatMsg', {contact_id: this.contact_id})
                this.MsgList = res.data
                console.log(this.MsgList)
                this.$nextTick(() => {
                    this.msgDOM.scrollTop = this.msgDOM.scrollHeight
                })
            },
            goBack() {
                // 离开房间
                const infoObj = {
                    status: 'userstate',
                    user_id: this.getUserinfo.user_id,
                    contact_id: this.contact_id
                }
                this.socket.emit('leave-chat', infoObj)
                this.$router.go(-1)
            },
            submit() {
                const MsgObj = {
                    contact_id: this.contact_id,
                    // status: 'usermsg',
                    user_id: this.getUserinfo.user_id,
                    msg_content: this.InputMsg
                }
                this.socket.emit('chat-msg', MsgObj)
                this.InputMsg = ''
            },
        },
        components: {
            OtherMsg,
            MyMsg
        },
        props: ['msg', 'index']

    }
</script>
<style lang="scss" scoped>
    $style: #12B7F5;
    $bg: #F6F6F6;
    $white: #FFF;
    .contain {
        background: $bg;
        width: 100%;
        height: 100%;
        .top {
            height: 45px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: $style;
            .left-icon {
                width: 25px;
                height: 25px;
                background: url("../assets/img/back.png") no-repeat center / 100%;
            }
            .title {
                font-size: 15px;
                color: $white;
            }
            .right-icon {
                width: 35px;
                height: 35px;
            }
        }
        .msg-content {
            height: calc(100% - 90px);
            overflow-y: scroll;
            margin-bottom: 20px;
            .loop-msg {
                .userstate {
                    width: 100%;
                    margin-bottom: 20px;
                    div {
                        width: 35%;
                        height: 20px;
                        border-radius: 10px;
                        text-align: center;
                        font-size: 14px;
                        margin: 0 auto;
                        background: #ccc;
                        color: #fff;
                    }
                }
            }
        }
        .bottom-input {
            position: fixed;
            width: 100%;
            bottom: 0;
            display: flex;
            align-items: center;
            textarea {
                width: 80%;
                height: 25px;
                line-height: 25px;
                font-size: 15px;
                border: 1px solid #bebebe;
            }
            .btn {
                width: 18%;
                height: 30px;
                line-height: 30px;
                text-align: center;
                border-radius: 5px;
            }
            .btn-default {
                @extend .btn;
                color: #FFF;
                background: #CCC;
            }
            .btn-active {
                @extend .btn;
                background: $style;
                color: $white;
            }
        }
        .extra-fun {
            position: absolute;
            bottom: 0;
            height: 30px;
            display: flex;
            align-items: center;
            .load-pic {
                position: relative;
                left: 10px;
                width: 30px;
                input{
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }
        }
    }
</style>
