<template>
    <h1>hello electron</h1>
    <p>page support by vue3 </p>
    <p>page support by vue3 </p>
    <p>page support by vue3 </p>
    <button @click="toggleTheme">toggle dark</button>
    <button @click="followSystem">follow system</button>
</template>

<script setup lang="ts">

const toggleTheme = async () => {
    const theme = await window.darkMode.toggle();

    console.log({ theme })
}

const followSystem = async () => {
    await window.darkMode.system();

    console.log('system')
}
</script>

<style lang="less">
h1 {
    color: red;
}
</style>