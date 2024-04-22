<template>
    <main>
        <suspense>
            <router-view></router-view>
        </suspense>
    </main>
</template>

<script lang="ts">
import 'solana-wallets-vue/styles.css'
import { Vue } from 'vue-class-component';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { initWallet } from 'solana-wallets-vue';
import { initWorkspace } from './composables';

const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
];
initWallet({ wallets, autoConnect: true });
initWorkspace();

export default class App extends Vue { }
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    width: 800px;
    margin: 24px auto;

    .title-wrapper {
        display: flex;
        justify-content: center;
    }

    button {
        height: 40px;
        min-width: 80px;
        padding: 0 8px;
        border-radius: 4px;
        margin: 10px 10px 10px 0;
        color: white;
        background: rgb(96, 96, 207);
        border: 1px solid grey;
    }

    .back-btn {
        color: black;
        background-color: white;
    }
}
</style>
