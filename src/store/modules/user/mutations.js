import {set} from '../../../utils/vuex'

export default {
    initUser(state, init) {
        if(!init.user.photo){
            init.user.photo = require('../../../assets/images/default.png');
        }
        state.user = init.user;
        state.roles = init.roles;
        state.menus = init.menus;
    },
    setRoles(state,roles){
        state.roles = roles;
    },
    setMenus(state,menus){
        state.menus = menus;
    },
    setUserInfo(state,user){
        if(!user.photo){
            user.photo = require('../../../assets/images/default.png');
        }
        state.user = user;
    },
    clearUser(state){
        state.user = {};
    }
}
