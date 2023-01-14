<template>
    <section v-if="action" class="login-modal">
        <h1>Please log in or sign up to {{ action }}</h1>
        <div class="flex align-center justify-center">
            <button @click="$router.push('/login')">Log in</button>
            <button @click="$router.push('/signup')">Sign up</button>
        </div>
        <button class="guest-btn" @click="enterGuestMode()">Continue as Guest</button>
    </section>

    <section v-else class="login-modal">
        <h3>Dear iOS user</h3>
        <p>
            In order to guarantee the best listening experience, we recommend using our player's desktop version.
        </p>
        <button class="guest-btn" @click="onWarned()">Got it</button>
    </section>
</template>

<script>
export default {
    props: {
        action: {
            type: String
        }
    },
    methods: {
        enterGuestMode() {
            const guestUser = { _id: 'guest', username: 'guest', fullname: 'Guest', likedSongs: [], stations: [] }
            this.$store.commit({ type: 'setLoggedinUser', user: guestUser })
        },
        onWarned() {
            this.$store.commit({ type: 'isIosWarned' })
        }
    }
}
</script>
