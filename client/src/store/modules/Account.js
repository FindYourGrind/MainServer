const state = {
    userId: -1,
    userName: '',
    userEmail: ''
};

const getters = {
    userId: state => state.userId,
    userName: state => state.userName,
    userEmail: state => state.userEmail
};

const actions = {

};

const mutations = {
    userId (state, id) {
        state.userId = id;
    },

    userName (state, name) {
        state.userName = name;
    },

    userEmail (state, email) {
        state.userEmail = email;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}