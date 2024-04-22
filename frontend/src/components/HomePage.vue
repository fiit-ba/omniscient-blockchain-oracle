<template>
    <div class="title-wrapper">
        <h1>Home Page</h1>
    </div>
    <div class="actions-container">
        <wallet-multi-button></wallet-multi-button>
        <button v-if="!workspace.loading && !workspace.initialized" @click="initContract()">Initialize Contract</button>
        <button v-if="!workspace.loading && workspace.initialized" @click="redirect('/new')">New Subscription</button>
        <button v-if="!workspace.loading && workspace.initialized" @click="redirect('/all')">Active Subscriptions</button>
    </div>
    <div class="loading-text" v-if="workspace.loading">Loading, please stand by...</div>
</template>
  
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { WalletMultiButton } from 'solana-wallets-vue'
import { initContract, useWorkspace } from '@/composables';
import { reactive } from 'vue';

const router = useRouter();
const redirect = (path: string) => router.push({ path });
const workspace = reactive(useWorkspace());

</script>
  
<style scoped lang="scss">
.actions-container, .loading-text {
    display: flex;
    justify-content: center;
}
.loading-text {
    font-size: 20px;
}
</style>