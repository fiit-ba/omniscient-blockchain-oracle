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
