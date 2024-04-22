# Omniscient: The Universal Blockchain Oracle

If you want to use this code, please cite our article describing this solution:

**IEEE style** 

K. Košťál, I. Ďurica and M. Ries, "Omniscient: The Universal Blockchain Oracle," 2023 IEEE International Conference on Blockchain (Blockchain), Danzhou, China, 2023, pp. 113-120.

## Structure of repository

The embedded implementation and testing solution has the following tree structure:

- /frontend - web application implementation, configs,                                                           
  - /public - placeholder files, 
  - /src - application setup files and logic, other folders,
    - /assets - images,
    - /components - component files for individual pages,
    - /composables - files for global utility functions,  

- /oracle-network - oracle network implementation,                                                              
  - /oracle-node - oracle node implementation folder, configs, 
    - /src - oracle node implementation files,
  - /oracle-server - oracle server implementation folder, configs, 
    - /src - oracle server implementation files,   

- /smart-contract    - oracle smart contract implementation, configs, 
  -  /migrations          - deployment script, 
  - /programs - contract implementation folder,  
    - /oracle-smart-contract - source code folder, configs,  
      - /src - smart contract source codes,  
  - /tests - unit test files.
 
## Technical documentation

### Requirements
**General requirements:**
- rust - https://www.rust-lang.org/tools/install
- node.js \& npm - https://nodejs.org/en
- yarn - https://classic.yarnpkg.com/lang/en/docs/install/\#windows-stable
- solana - https://docs.solana.com/cli/install-solana-cli-tools
- anchor - https://www.anchor-lang.com/docs/installation
- phantom - https://phantom.app/download


**Running Solana programs locally requires a UNIX-based operating system, if you wish to use Windows, you will require the following:**
- wsl - https://learn.microsoft.com/en-us/windows/wsl/install
- vscode - https://code.visualstudio.com/download
- wsl for vscode - https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl

### Setup
Notes:
- All folder paths mentioned will be relative to the root directory
- Make sure all dependencies listed under General requirements are installed

#### Solana configuration
- **(WSL ONLY)** Open a new instance of vscode as administrator and connect to your wsl instance via the vscode extension (icon should be visible in the bottom left corner of the vscode client)
- **(WSL ONLY)** Open a terminal inside of your vscode instance (your local solana validator will not launch inside of a regular wsl terminal)
- **(NON-WSL ONLY)** Open any terminal of your choice
- Enter:
  ```shell
  solana config set --url localhost

  # this will generate a .json file containing the keypair to your solana wallet saved as an array of integers (first 32
  # integers represent the private key, last 32 new integers represent the public key)
  solana-keygen new

  solana-test-validator
  ```
- Open "/smart-contract" folder in terminal
- **(WSL ONLY)** Enter:
  ```shell
  wsl
  anchor build
  anchor deploy
  solana address -k target/deploy/solana\_twitter-keypair.json 
  ```

- Copy the id from the terminal
- Open "Anchor.toml" file in your favourite editor (e.g. nvim)
- Change the value of "oracle\_smart\_contract" to the string you copied earlier
- Open "/programs/oracle-smart-contract/src/lib.rs"
- Change the input inside of the "declare\_id!! macro to the string you copied earlier
- Enter:
  ```shell
  anchor build
  anchor deploy
  ```

- Solana initialisation is complete and your contract is deployed!

#### Web app initialisation
- Open the web browser which has your phantom wallet extension installed
- Open the phantom wallet extension window
- Create a new phantom wallet account
- Enable testnet mode inside of your phantom wallet
- Switch the solana network of your phantom wallet to "Solana testnet"
- Copy the address of your phantom wallet
- Open a terminal window
- **(WSL ONLY)** Enter:
  ```shell
  wsl
  solana airdrop 100 \{your wallet address\}
  ```
- Open "/frontend" in a terminal
- Enter:
  ```shell
  npm install
  npm run serve
  ```
- Navigate to "http://localhost:8080/#/" in your browser (make sure your phantom wallet extension is installed in the same browser)
- Press the initialise button - this will trigger a total of 4 transactions, make sure to confirm each transaction, this may take a while
   - note: the phantom wallet chrome extension recently received an update however the wallet adapter used by the web application is still configured to work with the previous version, various issues and errors may arise while using the wallet
- Copy the state address from the console
- The web application setup is complete, you can now create subscriptions
- Note that if you refresh the page, you will have to initialise it again from the home page

#### Oracle network initialisation
- Open "/oracle-network/oracle-server" in a terminal
- Enter:
  ```shell
  npm install
  ```
- Open "/oracle-network/oracle-server/src/index.ts" change the value of stateAddress to the address you copied from the console at the end of the web app initialisation 
- Open "/smart-contract/{Users.config}/solana/id.json" and copy the contents of the file
  - note that the name of this directory in curl brackets may be different for you
- Open "/oracle-network/id.json", delete the contents of the file and paste the copied contents of the other id.json file
- Open "/oracle-network/oracle-server" in a terminal
- Enter:
  ```shell
  npm run build
  npm run serve
  ```
- Open "/oracle-network/oracle-node" in a terminal 
- Enter:
  ```shell
  npm install
  npm run build
  npm run serve
  ```

- Your oracle network should now be up and running, if you have any existing subscriptions and the web application has been initialised properly, you will be able to see the contents of API responses in the oracle server terminal

### Implementation details
#### Oracle smart contract
All application logic can be found inside of "/smart-contract/programs/oracle-smart-contract/src"

**"lib.rs"** contains all instructions. Instructions are effectively just methods that the outside world can use to interact with the contract. They are passed a Context object which contains the accounts that the instructions is supposed to read or write to. Since Solana programs are stateless, these accounts are how we store data. Most relevant application state is stored in our State account.

**"state.rs"** contains the details of the state account. This is where the proof of stake logic is located, among other things. The select\_leader and generate\_seed functions are responsible for the proof of stake mechanism. The seed used is taken from a solana system variable containing recent slot hashes.

**"context.rs"** contains the implementations for individual context objects for our instructions which dictate what accounts must be supplied to an instruction when it is called. When creating a new account, we must annotate it with "init" and specify an exact size. We must also provide a system\_program attribute.

#### Web application
All application logic besides certain configurations can be found in "/frontend/src/components/" and "/frontend/src/composables".

**"useWorkspace.ts"** is where we define a connection to our smart contract which can then be used by our components. It also contains references to other useful variables.

**"/frontend/src/components/"** contains individual component files, all of which are fairly straightforward

#### Oracle network
All application logic besides certain configurations can be found in "/oracle-network/oracle-node/src/" and "/oracle-network/oracle-server/src/".

The oracle server in this case is a socket server and each oracle node is an individual socket. Both of these have a connection to our smart contract which they use to fetch data. In the case of the oracle server, it also reports data. Both sides have emit handlers for various messages which they use to communicate amongh each other.

Typical program flow goes as follows: 
1. The server is initiated.
2. At least one socket (oracle) connects.
3. A new round starts.
4. All oracle fetch subscriptions and then call the endpoint for each subscription.
5. Each oracle reports all collected data.
6. The oracle server sends reported data to the leader who saves all of it.
7. The leader generates a hash for each report JSON.
8. Hashes are stored in a hash map and a record is kept of which hash was seen the most times.
9. The most popular hash is chosen as the final report and submitted to the server.
10. The server broadcasts the report to each oracle.
11. Socket generate a hash of their own collected report and the chosen report and compare them. If the hashes match, the oracle votes in favor of the report, otherwise it votes against it.
12. Upon receiving votes from all participants, the server checks if at least two thirds voted in favor of the report. 
13. If the report received enough votes, data is reported to individual subscription accounts.
14. Regardless of the outcome, the end of the round is reported to the smart contract, along with information of whether the report was accepted or not.
15. A new round begins.
