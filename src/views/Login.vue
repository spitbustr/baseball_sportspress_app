<template>
    <div class="text-center">
        <h1>Grosse page de login</h1>
        <div class="mt-3">
            <div>
                <label for="username">Username</label><br>
                <input id="username" v-model="payload.username" />
            </div>
            <div class="mt-3">
                <label for="password">Password</label><br>
                <input id="password" type="password" v-model="payload.password">
            </div>
            <button @click="login()" class="mt-3">LOGIN</button>
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
            }
        }
    },
    methods: {
        async login() {
            const result = await UserService.loginUser(this.payload)
            if (result.data.id && result.status === 200) {
                this.$store.dispatch("user/setUser", result.data)
                this.$store.dispatch("user/setLoggedIn", true)
                this.$router.push({ name: 'home' })
            }
        }
    }

}
</script>