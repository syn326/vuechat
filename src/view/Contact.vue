<template>
    <div>
        <drop-list :config="configData" ref="droplist1"></drop-list>
        <!--<drop-list :config="configData2" ref="droplist2"></drop-list>-->
        <div class="theme-set" v-show="themeSet">
            <div class="theme-bg" @click="themeSet=false"></div>
            <div class="blue" @click="changeTheme('#12B7F5')"></div>
            <div class="black" @click="changeTheme('#666')"></div>
            <div class="red" @click="changeTheme('#c00')"></div>
        </div>
        <div class="top" :style="'background:'+getThemeColor">
            <div class="head-pic">
                <!--<img :src="getUserinfo.headPic" alt="headpic" width="100%" height="100%"/>-->
                <p>{{getUserinfo.user_id}}</p>
            </div>
            <div class="title">contacts</div>
            <div class="right-icon" @click="showDropList1"></div>
        </div>

            <!--<div class="contacts-list" >-->
                <!--<div class="contact-item" @click="EnterRoom('1')" :style="'color:'+getThemeColor">-->
                    <!--<div class="left-icon">-->
                        <!--<img src="@/assets/img/heart-icon.png" alt="" width="100%" height="100%"/>-->
                    <!--</div>-->
                    <!--<span>contact</span>-->
                <!--</div>-->
            <!--</div>-->
            <div class="contacts-list" v-for="(contact,index) in contactList" :key="index" >
                <div class="contact-icon" @click="deleteContact(contact.contact_id)" >
                    <img src="@/assets/img/delete.png" alt="" width="100%" height="100%" />
                </div>
                <div class="contact-item"    @click="EnterChat(contact.contact_id)" :style="'color:'+getThemeColor">
                    <div class="left-icon" >
                        <img src="@/assets/img/heart-icon.png" alt="" width="100%" height="100%" />
                    </div>
                    <span v-if="getUserinfo.user_id == contact.user1_id">{{contact.user2_id}}</span>
                    <span v-else="getUserinfo.user_id == contact.user2_id">{{contact.user1_id}}</span>

                </div>
                <!--<div class="contact-item" v-if="isRead[index] == 0" v-if="isRead[index] == 1" v-bind:style="{background:red}" @click="EnterChat(contact.contact_id)" :style="'color:'+getThemeColor">-->
                    <!--<div class="left-icon" >-->
                        <!--<img src="@/assets/img/heart-icon.png" alt="" width="100%" height="100%" />-->
                    <!--</div>-->
                    <!--<span v-if="getUserinfo.user_id == contact.user1_id">{{contact.user2_id}}</span>-->
                    <!--<span v-else="getUserinfo.user_id == contact.user2_id">{{contact.user1_id}}</span>-->
                <!--</div>-->

            </div>
        <!--<div class="contacts-list">-->
            <!--<div class="contact-item" @click="EnterChat('1')" :style="'color:'+getThemeColor">-->
                <!--<div class="left-icon">-->
                    <!--<img src="@/assets/img/game-icon.png" alt="" width="100%" height="100%"/>-->
                <!--</div>-->
                <!--<span>游戏交友群</span>-->
            <!--</div>-->
        <!--</div>-->
            <!--<div class="room-item" @click="EnterRoom('room3')" :style="'color:'+getThemeColor">-->
                <!--<div class="left-icon">-->
                    <!--<img src="@/assets/img/chat-icon.png" alt="" width="100%" height="100%"/>-->
                <!--</div>-->
                <!--<span>闲聊交友群</span>-->
    </div>

</template>
<script type="text/javascript">
    import {mapGetters} from 'vuex'
    import {getItem} from '@/plugin/sessionStorage-plugin.js'
    import DropList from '@/components/DropList'
    import Alert from '@/components/Alert'

    export default{
        data() {
            return {
                contactList: [],
                themeSet: false,
                configData: {
                    position: {
                        top: '50px',
                        right: '10px'
                    },
                    width: '30%',
                    list: [
                        {text: 'MyInfo', action: this.getMyInfo},
                        {text: 'add contact', action: this.addContact},
                        {text: 'Change Theme', action: this.updateTheme},
                        {text: 'Logout', action: this.signOut}
                    ]
                },


            }
        },
        created(){
            this.initData();
        },
        mounted() {
        },
        computed: {
            ...mapGetters([
                'getUserinfo',
                'getThemeColor'
            ])
        },
        components: {
            DropList
        },
        methods: {
            async initData() {
                const res = await this.$store.dispatch('getContactList',{user_id: this.getUserinfo.user_id})
                this.contactList = res.data
                // this.$nextTick(() => {
                //     this.msgDOM.scrollTop = this.msgDOM.scrollHeight
                // })
                console.log("contactList:" + JSON.stringify(this.contactList))
                //console.log('is_read' + this.contactList[is_read])

            },
            EnterChat(contact_id) {
                this.$router.push({name: 'Chat', query: {contact_id: contact_id}})
            },
            showDropList1() {
                this.$refs.droplist1.show()
            },
            showDropList2() {
                this.$refs.droplist2.show()
            },
            getMyInfo() {
                console.log(321)
                this.$store.commit('getMyInfo')
                this.$router.push({name:'getMyInfo',query: {user_id: this.getUserinfo.user_id}})
            },
            addContact(){
                this.$router.push({name:'AddContact'})
            },
            async deleteContact(contact_id){
                const res = await this.$store.dispatch('deleteContact',{contact_id: contact_id})
                if(res.status === 'success') {
                    Alert({content: res.data.stateText})
                }else{
                    Alert({content: res.data.stateText})
                }
            },
            changeTheme(color) {
                this.$store.commit('setThemeColor', color)
            },
            updateTheme() {
                this.themeSet = true
            },
            signOut() {
                this.$router.replace({name: 'Login'})
            }
        },
        props: ['contact', 'index']
    }
</script>
<style lang="scss" scoped>
    $darkblue: #12B7F5;
    $gray: #F0F0F0;
    $white: #FFF;
    .top {
        height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: $darkblue;
        .head-pic {
            width: 30px;
            height: 30px;
            margin-left: 10px;
            img {
                border-radius: 50%;
            }
        }
        .title {
            font-size: 15px;
            color: $white;
        }
        .right-icon {
            width: 25px;
            height: 25px;
            margin-right: 15px;
            background: url('../assets/img/set-icon.png') no-repeat center / 100%;
        }
    }
    .contacts-list {
        .contact-icon{
            height: 25px;
            width: 25px;
            float: right;
        }
        .new-msg{
            background-color: red;
        }
        .checked-msg{
            background-color: white;
        }
        .contact-item {
            height: 50px;
            display: flex;
            align-items: center;
            font-size: 20px;
            color: $darkblue;
            border-bottom: 1px solid $gray;
            padding: 0 20px;
            .left-icon{
                width: 25px;
                height: 25px;
            }

            span{
                font-size: 15px;
                margin-left: 30px;
            }
        }
    }
    .theme-set {
        position: absolute;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100%;
        .theme-bg{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 999998;
            background: #000;
            opacity: 0;
        }
        .color{
            width: 3.5rem;
            height: 3.5rem;
            z-index: 9999999;
            border-radius: 5px;
            transition: width .2s, height .2s;
        }
        .color:hover{
            width: 5rem;
            height: 5rem;
        }
        .blue{
            @extend .color;
            background: #12B7F5;
        }
        .black{
            @extend .color;
            background: #666;
        }
        .red{
            @extend .color;
            background: #c00;
        }
    }
</style>
