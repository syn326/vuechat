<template>
    <div>
        <div class="bg"></div>
        <!--<div class="bg-shade"></div>-->
        <div class="content">
            <div class="title">My Info</div>
            <p class="user_id">id :{{this.getUserinfo.user_id}}</p>
            <p class="user_name"> name :  {{this.getUserinfo.user_name}} </p>
            <p class="user_email">email: {{this.getUserinfo.user_email}}</p>
        </div>
    </div>
</template>

<script>
    import Alert from '@/components/Alert'
    import {mapGetters} from 'vuex'
    import {setItem} from '@/plugin/sessionStorage-plugin'
    import {getItem} from '@/plugin/sessionStorage-plugin.js'

    export default {

        data() {
            return {

            }
        },
        created() {
            this.InitData()
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
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    $style: #000;
    .bg{
        top:0;
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
        .infostyle {
            width: 90%;
            height: 45px;
            border: none;
            border-bottom: 1px solid $style;
            font-size: 20px;
            color: $style;
            background: none;
        }
        .user_id {
            @extend .infostyle;
            position: absolute;
            top: 180px;
        }
        .user_name {
            @extend .infostyle;
            position: absolute;
            top: 240px;
        }
        .user_email {
            @extend .infostyle;
            position: absolute;
            top: 300px;
        }
        .login {
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
