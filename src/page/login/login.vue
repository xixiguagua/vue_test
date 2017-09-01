<template>
    <div class="loginContainer">
        <head-top :head-title="loginWay?'登錄':'密碼登錄'" goBack="true">
        </head-top>
        <form class="loginForm" v-if="loginWay">
            <section class="input_container phone_number">
                <input type="text" placeholder="賬號密碼" name="phone" maxlength="11" v-model="phoneNumber">
                <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">獲取驗證碼</button>
                <button @click.prevent v-show="computedTime">已發送({computedTime}s)</button>
            </section>
            <section class="input_container">
                <input type="text" name="mobilecode" placeholder="驗證碼" maxlength="6" v-model="mobileCode">
            </section>
        </form>
        <form class="loginForm" v-else>
            <section class="input_container">
                <input type="password" v-if="!showPassword" placeholder="密碼" v-model="passWord">
                <input v-else type="text" placeholder="密碼" v-model="passWord">
                <div class="button_switch" :class="{change_to_text:showPassword}">
                    <div class="circle_button" :class="{trans_to_right:showPassword}" @click="changePassWordType"></div>
                    <span>abc</span>
                    <span>...</span>
                </div>
            </section>
            <section class="input_container captcha_code_container">
                <input type="text" placeholder="驗證碼" maxlength="4" v-model="codeNumber">
                <div class="img_change_img">
                    <img :src="captchaCodeImg" v-show="captchaCodeImg">
                    <div class="change_img" @click="getCaptchaCode">
                        <p>看不清</p>
                        <p>換一種</p>
                    </div>
                </div>
            </section>
        </form>
        <p class="login_tips">
            溫馨提示
        </p>
        <p class="login_tips">
            註冊過的
        </p>
        <div class="login_container" @click="mobileLofin">登录</div>
        <router-link to="/forget" class="to_forget" v-if="!loginWay">重置密码</router-link>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
import headTop from '../../components/header'
import alertTip from'../../components/alertTip'
import {localapi, proapi, imgBaseUrl} from 'src/config/env'
import {mapState, mapMutations} from vuex
import {mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin} from '../../service/getData'

export default {
    data(){
        return {
            loginWay: false,
            showPassword: false,
            phoneNumber: null,
            mobileCode: null,
            validate_token: null,
            computedTime: 0,
            userInfo: null,
            userAccount: null,
            passWord: null,
            captchCodeImg: null,
            codeNumber: null,
            showAlert: false,
            alertText: null
        }
    },
    created(){
        this.getcaptchaCode();
    },
    components: {
        headTop,
        alertTip
    },
    computed: {
        rightPhoneNumber: function() {
            return /^1\d{10}$/gi.test(this.phoneNumber)
        }
    },
    methods: {
        ...mapMutations([
            'RECODE_USERINFO'
        ]),
        changeLoginWay(){
            this.loginWay = !this.loginWay;
        },
        changePassWordType(){
            this.showPassword = !this.showPassword;
        },
        async getCaptchaCode(){
            let res = await getcaptchas();
            this.captchCodeImg = res.code;
        },
        async getVerifyCode(){
            if (this.rightPhoneNumber) {
                this.computedTime = 30;
                this.timer = setInterval(() =>{
                    this.computedTime --;
                    if (this.computedTime == 0) {
                        clearInterval(this.timer)
                    }
                },1000)
                let exsis = await checkExsis(this.phoneNumber, 'monbile');
                if (exsis.message) {
                    this.showAlert = true;
                    this.alertText = exsis.message;
                    return
                } else if(!exsis.is_exists) {
                    this.showAlert = true;
                    this.alertText = "手机号尚未绑定";
                    return
                }
                let res = await mobileCode(this.phoneNumber);
                if (res.message) {
                    this.showAlert = true;
                    this.alertText = res.message;
                    return
                }
                this.validate_token = res.validate_token;
            }
        },
        async mobileLogin(){
            if(this.loginWay) {
                if(!this.rightPhoneNumber) {
                    this.showAlert = true;
                    this.alertText = '手机号不正确';
                    return
                } else if(!(/^\d{6}$/gi.test(this.mobileCode))) {
                    this.showAlert = true;
                    this.alertText = "短信验证码错误";
                    return
                }
            } else {
                if(!this.userAccount) {
                    this.showAlert = true;
                    this.alertText = '请输入用户名';
                    return
                } else if(!this.passWord) {
                    this.showAlert = true;
                    this.alertText = '请输入密码';
                    return
                } else if(!this.codeNumber) {
                    this.showAlert = true;
                    this.alertText = '请输入验证码';
                    return
                }
                this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
            }
            if (!this.userInfo.user_id) {
                this.showAlert = true;
                this.alertText = this.userInfo.message;
                if(!this.loginWay) this.getcaptchaCode();
            } else {
                this.RECORD_USERINFO(this.userInfo);
                this.$router.go(-1);
            }
        },
        closeTip(){
            this.showAlert = false;
        }
    }
}
</script>
