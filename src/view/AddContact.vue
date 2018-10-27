<template>
    <div>
        <div class="bg"></div>
        <!--<div class="bg-shade"></div>-->
        <div class="content">
            <div class="title">Add Contact</div>
            <input class="user_id" type="text" v-model="user2_id" placeholder="user_id"/>
            <div class="submit" @click="add()">ADD</div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Alert from '@/components/Alert'
    import {setItem} from '@/plugin/sessionStorage-plugin'
    export default {
        data() {
            return {
                user1_id: '',
                user2_id: ''
            }
        },
        computed: {
            ...mapGetters([
                'getUserinfo',
                'getThemeColor'
            ])
        },
        methods: {
            async add() {
                let data = {
                    user1_id: this.getUserinfo.user_id,
                    user2_id: parseInt(this.user2_id)
                }
                const res = await this.$store.dispatch('addContact', data)
                console.log("res" + res.state)
                if (res.status === 'success') {
                    Alert({content: res.data.stateText}).then((data) => {
                        this.$router.push({name: 'Contact'})
                    })
                }else{
                    Alert({content: res.data.stateText})
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    $style: #000;
    .bg{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('../assets/img/bg.jpg') no-repeat fixed center center / 100% 100% content-box content-box;
        z-index: 999997;
    }
    /*.bg-shade{
      position: absolute;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: 999998;
      opacity: .25;
    }*/
    .content {
        z-index: 999999;
        background-size: 100% 100%;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        .title {
            position: absolute;
            top: 100px;
            font-size: 35px;
            font-weight: bold;
            color: $style;
        }
        .inputstyle {
            width: 90%;
            height: 45px;
            border: none;
            border-bottom: 1px solid $style;
            font-size: 20px;
            color: $style;
            background: none;
        }
        .user_id {
            @extend .inputstyle;
            position: absolute;
            top: 180px;
        }
        .user_password {
            @extend .inputstyle;
            position: absolute;
            top: 240px;
        }
        input::-webkit-input-placeholder {
            color: $style;
            font-size: 20px;
        }
        input::-moz-placeholder {   /* Mozilla Firefox 19+ */
            color: $style;
            font-size: 20px;
        }
        input:-moz-placeholder {    /* Mozilla Firefox 4 to 18 */
            color: $style;
            font-size: 20px;
        }
        input:-ms-input-placeholder {  /* Internet Explorer 10-11 */
            color: $style;
            font-size: 20px;
        }
        .submit {
            position: absolute;
            top: 330px;
            background: none;
            border: 1px solid $style;
            width: 80%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: $style;
            font-size: 20px;
            border-radius: 10px;
        }
        .bottom {
            position: absolute;
            top: 380px;
            width: 80%;
            height: 20px;
            font-size: 16px;
            color: $style;
            .register {
                float: right;
            }
        }
    }
</style>
