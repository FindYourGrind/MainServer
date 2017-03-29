<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="main-page">

    </div>
</template>

<script>
    import Vue from 'vue';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'mainPage',
        data () {
            return {}
        },
        methods: {
            toggleLeftSidenav() {
                let me = this;

                me.$refs.leftSidenav.toggle();
            },
            ...mapGetters({
                getUserId: 'userId',
                getUserName: 'userName'
            }),
            ...mapMutations({
                removeAccessToken: 'removeUserAccessToken',
                removeUserId: 'removeUserId'
            })
        }
    }
</script>

<style scoped>
  .main-page {
    width: 100%;
  }
</style>
