<template>
    <div class="container my-5">
        <div class="d-flex justify-content-center">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        Connexion
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" id="username" class="form-control" v-model="payload.username" />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input id="password" class="form-control" type="password" v-model="payload.password">
                        </div>
                    </div>

                    <div class="card-footer text-muted">
                        <button @click="login()" class="btn btn-primary">Connexion</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="error" class="text-center mt-3 error">
            L'authentification a échoué.
        </div>
    </div>

</template>
<script>
import UserService from '@/services/UserService'

export default {
    data() {
        return {
            payload: {
                username: "",
                password: "",
            },
            error: false,
        }
    },
    methods: {
        async login() {
            await UserService.loginUser(this.payload)
                .then(result => {
                    if(result?.data?.id && result?.status === 200) {
                        this.$store.dispatch("user/setUser",result.data)
                        this.$store.dispatch("user/setLoggedIn",true)
                        this.$router.push({ name: 'home' })
                    }
                    else {
                        this.error = true
                    }
                })
        }
    },
    watch: {
        payload: {
            handler(value) {
                this.error = false
            },
            deep: true,
            immediate: true,
        },
    }

}
</script>
<style lang="scss" scoped>
    .error {
        color: red;
    }
</style>