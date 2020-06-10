<template>
    <v-container fill-height fluid grid-list-xl>
        <v-layout justify-center wrap>
            <v-flex xs12 md8>
                <MaterialCard color="light-green darken-4" text="个人资料">
                    <v-form ref="form" v-model="valid">
                        <v-container py-0>
                            <v-layout wrap>
                                <v-flex xs12 md12>
                                    <v-avatar class="mx-auto d-block" size="130">
                                        <v-hover v-slot:default="{ hover }">
                                            <v-img :src="photo" >
                                                <v-expand-transition>
                                                    <div style="position:relative;width: 100%;height: 100%;background: #9E9E9E33"
                                                         v-if="hover"
                                                         class="d-flex transition-fast-in-fast-out align-center justify-center">
                                                        <v-icon color="white">mdi-camera</v-icon>
                                                        <input ref="photo" @change="imageChange" type="file"
                                                               accept="image/png,image/jpg, image/jpeg, image/bmp"
                                                               style="height: 100%;width: 100%;opacity:0;position: absolute;cursor: pointer;">
                                                    </div>
                                                </v-expand-transition>
                                            </v-img>
                                        </v-hover>
                                    </v-avatar>
                                </v-flex>
                                <v-flex xs12 md8>
                                    <v-text-field label="角色" :value="role" disabled/>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-text-field class="purple-input" label="姓名" v-model.trim="userInfo.name" :rules="[rules.name]"/>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-text-field label="手机" :value="user.phone" class="purple-input" disabled/>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-select required v-model.trim="userInfo.sex" :items="sexes" label="性别"/>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-menu
                                            ref="menu"
                                            v-model="menu"
                                            :close-on-content-click="false"
                                            :return-value.sync="userInfo.birthday"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model.trim="userInfo.birthday"
                                                    label="生日"
                                                    prepend-icon="mdi-calendar-account-outline"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker locale="zh-cn" v-model="userInfo.birthday" no-title scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="menu = false">取消</v-btn>
                                            <v-btn text color="primary" @click="$refs.menu.save(userInfo.birthday)">确定
                                            </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 text-xs-right>
                                    <v-btn class="mx-0 font-weight-light" :loading="loading" color="light-green darken-1" @click="changeUserInfo">修改资料</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </MaterialCard>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapMutations, mapState} from "vuex";
    import MaterialCard from "../../components/base/MaterialCard";
    import Rules from "../../rules/rules";
    import FileApi from "../../api/file/FileApi";
    import UserApi from "../../api/sys/UserApi";
    import moment from 'moment';

    export default {
        name: "Info",
        components: {MaterialCard},
        mounted() {
            this.userInfo.name = this.user.name;
            this.userInfo.photo = this.user.photo;
            this.userInfo.sex = this.user.sex;
            if(this.user.birthday){
                this.userInfo.birthday = moment(this.user.birthday).format("YYYY-MM-DD")
            }
        },
        data() {
            return {
                valid: true,
                rules: {...Rules},
                sexes: ['男', '女'],
                menu: false,
                loading: false,
                userInfo: {
                    name: null,
                    photo: null,
                    sex: null,
                    birthday: null,
                }
            }
        },
        computed: {
            ...mapState('user', ['user','roles']),
            roleMap(){
                let map = {};
                this.roles.forEach(v=>{
                    map[v.name] = v.remark;
                });
                return map;
            },
            role(){
                return this.user.roles.map(v=>this.roleMap[v]).join(",")
            },
            photo(){
                if(this.userInfo.photo){
                    return this.userInfo.photo;
                }
                return require('../../assets/images/default.png');
            }
        },
        methods: {
            ...mapMutations('user', ['setUserInfo']),
            imageChange(file){
                let reader = new FileReader();
                let pos = file.target.files[0].name.lastIndexOf(".");
                let type = file.target.files[0].name.substring(pos + 1);
                if (type.toLowerCase() !== "png" && type.toLowerCase() !== 'jpg' && type.toLowerCase() !== 'jpeg' && type.toLowerCase() !== 'bmp') {
                    this.$message.warning("格式错误，请上传'png、jpg、jpeg、bmp'格式文件");
                    return;
                }
                reader.onloadend = e =>{
                    this.userInfo.photo = e.target.result;
                }
                reader.readAsDataURL(file.target.files[0]);
            },
            changeUserInfo(){
                if(this.$refs.form.validate()){
                    if(!this.loading){
                        this.loading = true;
                        UserApi.updateUserInfo(this.userInfo).then((v)=>{
                            this.setUserInfo(v.data);
                            this.$message.success('修改成功');
                        }).finally(()=>{
                            this.loading = false;
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>