<template>
    <div class="title-wrapper">
        <h1>New Subscription</h1>
    </div>

    <div v-if="loading" class="loading-text">
        <h1>Loading, please wait...</h1>
    </div>
    <div v-else-if="workspace.connected" class="form-wrapper">
        <label for="length">Duration</label>
        <input class="form-field" id="duration" type="number" min="1" placeholder="Enter subscription duration (total number of rounds)..." v-model="duration">
        
        <label for="url">URL</label>
        <input class="form-field" id="url" placeholder="Enter API URL..." v-model="url">

        <label for="options">Options JSON</label>
        <textarea class="form-field" id="options" placeholder="Enter API options as JSON..." v-model="options"></textarea>

        <span class="error-message" v-if="hasError">{{ errorMsg }}</span>

        <div class="actions-wrapper">
            <button class="back-btn" @click="toHome()">Cancel</button>
            <button @click="onSubmit()">Submit</button>
        </div>
    </div>
    <div v-else class="wallet-error">
        <h1>ERROR: Wallet not connected!</h1>
    </div>

</template>
    
<script setup lang="ts">

import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { SubscriptionInput, useWorkspace } from '@/composables';
import * as anchor from '@project-serum/anchor';

const workspace = reactive(useWorkspace());
const router = useRouter();
const duration = ref<number>();
const url = ref<string>();
const options = ref<string>();
const hasError = ref<boolean>(false);
const loading = ref<boolean>(false);
const errorMsg = ref<string>();

const toHome = () => router.push({ path: '/' });
const onSubmit = async () => {
    hasError.value = false;
    errorMsg.value = undefined;
    
    if (!url.value) {
        errorMsg.value = "Please add a valid API URL";
    }
    if (url.value && url.value.length > 100) {
        errorMsg.value = "API URL must not exceed 100 characters";
    }
    if (!duration.value || typeof duration.value !== "number" || duration.value <= 0) {
        errorMsg.value = "Subscription lenght must be a non-negative number";
    }
    if (errorMsg.value) {
        hasError.value = true;
        return;
    }

    let inputOptions = {};

    try {
        if(options.value && options.value.length > 800) {
            errorMsg.value = "Options length must not exceed 800 characters";
            hasError.value = true;
            return;
        }

        inputOptions = options.value ? JSON.parse(options.value) : {};
        inputOptions = { params: inputOptions, url: url.value }
    } catch (err) { 
        errorMsg.value = "JSON format invalid";
        hasError.value = true;
        return;
    }

    const keypair = anchor.web3.Keypair.generate();
    const input: SubscriptionInput = {
        duration: new anchor.BN(duration.value as number),
        options: JSON.stringify(inputOptions)
    }

    loading.value = true;
    
    await workspace.program.methods.addSubscription(input).accounts({
        subscription: keypair.publicKey,
        state: workspace.state,
        client: workspace.wallet?.publicKey
    })
    .signers([keypair])
    .rpc();

    loading.value = false;
    console.log(input);
    toHome();
}

</script>
    
<style scoped lang="scss">
.form-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
    width: 500px;

    label {
        font-weight: bolder;
        font-size: 12px;
        margin-bottom: 4px;
    }

    .form-field {
        border-radius: 4px;
        margin-bottom: 24px;
        border: 1px solid grey;
    }

    input {
        height: 40px;
        padding: 0 8px;
    }
    textarea {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        min-height: 120px;
        padding: 8px;
    }
    textarea::placeholder {
        font-family: Avenir, Helvetica, Arial, sans-serif;
    }

    .error-message {
        color: red;
        font-weight: bolder;
        font-size: 16px;
        margin-bottom: 12px;
    }

    .loading-text {
        width: 100%;
        display: flex;
        justify-content: center;
        font-size: 20px;
        margin-bottom: 12px;
    }

    .actions-wrapper {
        display: flex;
        flex-direction: row;

        button {
            height: 24px;
            color: white;
            background: rgb(46, 46, 180);
        }
    }
}

.wallet-error {
    display: flex;
    justify-content: center;
    color: red;
}

</style>
    