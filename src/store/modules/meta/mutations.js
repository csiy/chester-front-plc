import {set} from '../../../utils/vuex'

export default {
    setMeta(state, meta) {
        state.title = meta.title;
        state.keywords = meta.keywords;
        state.description = meta.description;
    },
}
