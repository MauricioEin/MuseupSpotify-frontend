<template>
    <section class="login-modal">
        <h1>Please log in or sign up to start {{ action }}</h1>
        <div class="flex align-center justify-center">
            <button @click="$router.push('/login')">Login</button>
            <button @click="$router.push('/signup')">Signup</button>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        action: {
            type: String
        }
    }
}
</script>
