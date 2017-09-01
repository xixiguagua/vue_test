<template>
    <div>
        <head-top signin-up='home'>
            <span slot='log' class="head_logo" @click="reload">ele.me</span>
        </head-top>
        <nav class="city_nav">
            <div class="city_tip">
                <span>当前定位：</span>
                <span>定位不准，请选择</span>
            </div>
            <router-link :to="'/city' + guessCityid" class="guess_city">
                <span>{{guessCity}}</span>
                <svg class="arrow_right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </router-link>
        </nav>
        <section id="hot_city_container">
            <h4 class="city_title">热门城市</h4>
            <ul class="citylistul clear">
                <router-link tag="li" v-for="item in hotcity" :to="'/city' + item.id" :key="item.id">
                {{item.name}}
                </router-link>
            </ul>
        </section>
        <section class="group_city_container">
            <ul class="letter_classify">
                <li v-for="(value, key ,index) in sortgroupcity" :key="key" class="letter_classify_li">
                    <h4 class="city_title">{{key}}
                        <span v-if="index == 0">(按字母排序)</span>
                    </h4>
                    <ul class="groupcity_name_container citylistul clear">
                        <router-link tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="ellipsis">
                        {{item.name}}
                        </router-link>
                    </ul>
                </li>
            </ul>
    </div>
</template>

<script>
import headTop from '../../components/header/head'
import {cityGuess, hotcity, groupcity} from '../../service/getData'

export default {
    data(){
        return{
            guessCity: '',
            guessCityid: '',
            hotcity: [],
            groupcity: {}
        }
    },
    mounted(){
        cityGuess().then(res => {
            this.guessCity = res.name;
            this.guessCityid = res.id;
        })
        hotcity().then(res => {
            this.hotcity = res;
        })
        groupcity().then(res => {
            this.groupcity = res;
        })
    },
    components:{
        headTop
    },
    computed:{
        sortgruopcity(){
            let sortobj = {};
            for (let  i= 65; i <= 90; i++) {
                if(this.groupcity[String.fromCharCode(i)]) {
                    sortobj[String.fromCharCode(i)] = this.groupcity
                    [String.fromCharCode(i)];
                }
            }
            return sortobj
        }
    },
    methods:{
        reload(){
            window.location.reload();
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../style/mixin;
</style>
