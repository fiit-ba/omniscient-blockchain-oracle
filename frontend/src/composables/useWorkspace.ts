import { computed, ComputedRef, ref, Ref } from 'vue';
import { AnchorWallet, useAnchorWallet, useWallet } from 'solana-wallets-vue';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Provider, Program, Idl } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import idl from '../../../../oracle-smart-contract/target/idl/oracle_smart_contract.json';

let workspace: Workspace;
const programId = new PublicKey(idl.metadata.address)

export const useWorkspace = (): Workspace => workspace;

export const initWorkspace = () => {
    const { connected } = useWallet();
    const wallet = useAnchorWallet();
    const connection = new Connection('http://127.0.0.1:8899');
    //const provider = computed((): Provider => ({ connection, publicKey: wallet.value?.publicKey }));
    const provider = computed(() => new anchor.AnchorProvider(connection, wallet.value as AnchorWallet, {}));
    const program = computed(() => new Program(idl as Idl, programId, provider.value));
    const stateKeypair = anchor.web3.Keypair.generate();
    const state = stateKeypair.publicKey;
    const loading = ref(false);
    const initialized = ref(false);

    workspace = {
        connected,
        wallet,
        connection,
        provider,
        program,
        stateKeypair,
        state,
        loading,
        initialized
    }
}

export const initContract = async () => {
    workspace.loading.value = true;
    await workspace.program.value.methods.initialize().accounts({
        state: workspace.state,
        payer: workspace.wallet.value?.publicKey,
        recentSlothashes: new PublicKey('SysvarS1otHashes111111111111111111111111111')
    })
    .signers([workspace.stateKeypair])
    .rpc();

    workspace.initialized.value = true;
    workspace.loading.value = false;
    console.log('app initialized');
    console.log(`State address: ${workspace.state.toString()}`);
    
    
    for(let i = 0; i < 3; i++) {
        const keypair = anchor.web3.Keypair.generate();

        await workspace.program.value.methods.addOracle().accounts({
            oracle: keypair.publicKey,
            state: workspace.state,
            payer: workspace.wallet.value?.publicKey,
            recentSlothashes: new PublicKey('SysvarS1otHashes111111111111111111111111111')
        })
        .signers([keypair])
        .rpc();
    }
    console.log('oracles added');
    

    const stateAccount = await workspace.program.value.account.state.fetch(workspace.state);
    console.log(workspace.state.toString());
    console.log(stateAccount);
    const subscriptions = await workspace.program.value.account.subscription.all();
    console.log(subscriptions);
}

export interface Workspace {
    connected: Ref<boolean>;
    wallet: Ref<AnchorWallet | undefined>;
    connection: Connection;
    provider: ComputedRef<Provider>;
    program: ComputedRef<Program<Idl>>;
    stateKeypair: Keypair;
    state: PublicKey;
    loading: Ref<boolean>;
    initialized: Ref<boolean>;
}

export interface SubscriptionInput {
    duration: anchor.BN;
    options: string;
}
