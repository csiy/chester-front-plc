import {set, toggle} from '../../../utils/vuex'

export default {
    setLogin: set('login'),
    toggleDrawer: toggle('drawer'),
    setActions: set('actions'),
}
