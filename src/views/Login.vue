<template>
    <h1>Grosse  page de login</h1>
    <div>
        <div>
            <label for="username">Username</label>
            <input id="username" v-model="payload.username"/>
        </div>
        <div>
            <label for="password">Password</label>
            <input id="password" v-model="payload.password">
        </div>
        <button @click="login()">LOGIN</button>
    </div>
</template>
<script>
import UserService from '@/services/UserService'

export default {
    data() {
        return {
            payload: {
                username: "adminuser",
                password: "LBAO4ever!",
            }
        }
    },
    methods: {
        async login() {
            const result = await UserService.loginUser(this.payload)
            if(result.data.id && result.status === 200) {
                this.$store.dispatch("user/setUser",result.data)
                this.$store.dispatch("user/setLoggedIn",true)
                this.$router.push({ name: 'home' })
            }
        }
    }

}
</script>