const install = (Vue) => {
    const Message = {
        success(message) {
            return Vue.prototype.$dialog.message.success(message, {position: 'top',timeout:1000});
        },
        error(message) {
            return Vue.prototype.$dialog.message.error(message, {position: 'top',timeout:1000});
        },
        warning(message) {
            return Vue.prototype.$dialog.message.warning(message, {position: 'top',timeout:1000});
        },
    };
    Vue.prototype.$message = Message;
};

export default install;
