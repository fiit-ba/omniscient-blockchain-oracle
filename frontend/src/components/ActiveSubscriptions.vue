<template>
    <div class="title-wrapper">
        <h1>Active Subscriptions</h1>
    </div>

    <div class="content-wrapper">
        <table>
            <tr>
                <th>#</th>
                <th>URL</th>
                <th>Address</th>
                <th>Remaining duration (rounds)</th>
            </tr>
            <tr v-for="(item, index) in data" :key="index" class="subscription-info-wrapper">
                <td> {{ index + 1 }} </td>
                <td> {{ item.url }} </td>
                <td> {{ item.address }} </td>
                <td> {{ item.duration }}</td>
            </tr>
        </table>

        <div class="actions-wrapper">
            <button class="back-btn" @click="toHome()">Return</button>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import { useWorkspace } from '@/composables';
import { reactive, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toHome = () => router.push({ path: '/' });
const workspace = reactive(useWorkspace());

const subscriptions = await workspace.program.account.subscription.all();
console.log(subscriptions);

const filtered: RowData[] = subscriptions
    .filter(sub => sub.account.client.toString() === workspace.wallet?.publicKey.toString())
    .map(sub => ({ 
        url: ref(JSON.parse(sub.account.options).url),
        duration: ref(sub.account.expiration.toNumber()),
        address: ref(sub.publicKey.toString())
    }));

const data = reactive(filtered);

interface RowData {
    url: Ref<string>;
    address: Ref<string>;
    duration: Ref<number>;
}
</script>
    
<style scoped lang="scss">
.content-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;

    table {
        border-collapse: collapse;

        td, th {
            border: 1px solid grey;
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even) {
            background-color: #ebebeb;
        }
    }

}
</style>
    