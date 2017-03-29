import Vue from 'vue';

const state = {
    userId: undefined,
    userName: undefined,
    userEmail: undefined,
    userAccessToken: undefined,
};

const getters = {
    userId: state => state.userId,
    userName: state => state.userName,
    userEmail: state => state.userEmail,
    userAccessToken: state => state.userAccessToken,
    isLogged: state => {
        return !!state.userId && !!state.userAccessToken;
    }
};

const actions = {

};

const mutations = {
    userId (state, id) {
        state.userId = id;

        localStorage.setItem('userId', id);
    },

    userName (state, name) {
        state.userName = name;
    },

    userEmail (state, email) {
        state.userEmail = email;
    },

    userAccessToken (state, token) {
        state.userAccessToken = token;

        localStorage.setItem('accessToken', token);
        Vue.http.headers.common['Authorization'] = token;
    },

    removeUserAccessToken (state) {
        state.userAccessToken = undefined;

        localStorage.removeItem('accessToken');
        Vue.http.headers.common['Authorization'] = '';
    },

    removeUserId (state) {
        state.userId = undefined;

        localStorage.removeItem('userId');
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
