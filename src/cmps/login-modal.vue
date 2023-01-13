<template>
    <section class="login-modal">
        <h1>Please log in or sign up to {{ action }}</h1>
        <div class="flex align-center justify-center">
            <button @click="$router.push('/login')">Log in</button>
            <button @click="$router.push('/signup')">Sign up</button>
        </div>
        <button class="guest-btn" @click="enterGuestMode()">Continue as Guest</button>
    </section>
</template>

<script>
export default {
    props: {
        action: {
            type: String
        }
    },
    methods:{
        enterGuestMode(){
            const guestUser = { _id: 'guest', username: 'guest', fullname: 'Guest', likedSongs: [], stations: [] }
            this.$store.commit({type:'setLoggedinUser', user:guestUser})
        }
    }
}
</script>
