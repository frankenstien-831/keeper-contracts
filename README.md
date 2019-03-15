[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

# keeper-contracts

> 💧 Integration of TCRs, CPM and Ocean Tokens in Solidity
> [oceanprotocol.com](https://oceanprotocol.com)

| Dockerhub | TravisCI | Ascribe | Greenkeeper |
|-----------|----------|---------|-------------|
|[![Docker Build Status](https://img.shields.io/docker/build/oceanprotocol/keeper-contracts.svg)](https://hub.docker.com/r/oceanprotocol/keeper-contracts/)|[![Build Status](https://api.travis-ci.com/oceanprotocol/keeper-contracts.svg?branch=master)](https://travis-ci.com/oceanprotocol/keeper-contracts)|[![js ascribe](https://img.shields.io/badge/js-ascribe-39BA91.svg)](https://github.com/ascribe/javascript)|[![Greenkeeper badge](https://badges.greenkeeper.io/oceanprotocol/keeper-contracts.svg)](https://greenkeeper.io/)|

---

**🐲🦑 THERE BE DRAGONS AND SQUIDS. This is in alpha state and you can expect running into problems. If you run into them, please open up [a new issue](https://github.com/oceanprotocol/keeper-contracts/issues). 🦑🐲**

---


## Table of Contents

  - [Get Started](#get-started)
     - [Docker](#docker)
     - [Local development](#local-development)
     - [Testnet deployment](#testnet-deployment)
        - [Nile Testnet](#nile-testnet)
        - [Kovan Testnet](#kovan-testnet)
  - [Libraries](#libraries)
  - [Testing](#testing)
     - [Code Linting](#code-linting)
  - [Documentation](#documentation)
  - [New Version / New Release](#new-version-new-release)
  - [Contributing](#contributing)
  - [Prior Art](#prior-art)
  - [License](#license)

---

## Get Started

For local development you can either use Docker, or setup the development environment on your machine.

### Docker

The most simple way to get started is with Docker:

```bash
git clone git@github.com:oceanprotocol/keeper-contracts.git
cd keeper-contracts/

docker build -t oceanprotocol/keeper-contracts:0.1 .
docker run -d -p 8545:8545 oceanprotocol/keeper-contracts:0.1
```

or simply pull it from docker hub:

```bash
docker pull oceanprotocol/keeper-contracts
docker run -d -p 8545:8545 oceanprotocol/keeper-contracts
```

Which will expose the Ethereum RPC client with all contracts loaded under localhost:8545, which you can add to your `truffle.js`:

```js
module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*',
            gas: 6000000
        },
    }
}
```

### Local development

As a pre-requisite, you need:

- Node.js >=6, <=v10.13.0
- npm

Clone the project and install all dependencies:

```bash
git clone git@github.com:oceanprotocol/keeper-contracts.git
cd keeper-contracts/

# install dependencies
npm i

# install RPC client globally
npm install -g ganache-cli
```

Compile the solidity contracts:

```bash
npm run compile
```

In a new terminal, launch an Ethereum RPC client, e.g. [ganache-cli](https://github.com/trufflesuite/ganache-cli):

```bash
ganache-cli
```

Switch back to your other terminal and deploy the contracts:

```bash
npm run deploy

# for redeployment run this instead
npm run clean
npm run compile
npm run deploy
```

Upgrade contract [**optional**]:
```bash
npm run upgrade <DEPLOYED_CONTRACT>:<NEW_CONTRACT>
```

### Testnet deployment

#### Nile Testnet

Follow the steps for local deployment. Make sure that the address [`0x90eE7A30339D05E07d9c6e65747132933ff6e624`](https://submarine.dev-ocean.com/address/0x90ee7a30339d05e07d9c6e65747132933ff6e624) is having enough (~1) Ether.

```bash
export NMEMORIC=<your nile nmemoric>
npm run deploy:nile
```

The transaction should show up on the account: [`0x90eE7A30339D05E07d9c6e65747132933ff6e624`](https://submarine.dev-ocean.com/address/0x90ee7a30339d05e07d9c6e65747132933ff6e624/transactions)

The contract addresses deployed on Ocean Nile testnet:

| Contract                          | Version | Address                                      |
|-----------------------------------|---------|----------------------------------------------|
| AccessSecretStoreCondition        | v0.8.6  | `0x5Ba6ce2dA741765C0BE7F36020c2cf45Fe114cB1` |
| AgreementStoreManager             | v0.8.6  | `0xF1F163863ca92d0137B8422efb69e18bd8A2702B` |
| ConditionStoreManager             | v0.8.6  | `0x76623019b1aa68DC81d3209B668Beff5BAd6c8a5` |
| DIDRegistry                       | v0.8.6  | `0x20C8735F6a9b73a9B1410967df2D4C64bb89Df85` |
| DIDRegistryLibrary                | v0.8.6  | `0x5369f93E88eEC2928A7b1F48f91c0C750672BDaA` |
| Dispenser                         | v0.8.6  | `0xB916bbe2b564513bfDf0Ef75131AaD91d9Ef4E68` |
| EpochLibrary                      | v0.8.6  | `0xcb33e0a2cC89BD1fcE0e62057F3aaA30C0FC8A66` |
| EscrowAccessSecretStoreTemplate   | v0.8.6  | `0x05659b10Ae28ad96e443fD6310C082FA6596b37f` |
| EscrowReward                      | v0.8.6  | `0xc5c416e5ad029c706EA5D24cC2c138e80B8Aac74` |
| HashLockCondition                 | v0.8.6  | `0x41fc8CeBF70DAe91D67Fc542b4004F3A0c5A3F2a` |
| LockRewardCondition               | v0.8.6  | `0xED1834062d22C0D9e65adbEbA525f548719662dc` |
| OceanToken                        | v0.8.6  | `0xcDae1AFa8025BE03Bc56D112eB4da3277913563d` |
| SignCondition                     | v0.8.6  | `0xdA24A09f281076277590bC951693bB96eB240B86` |
| TemplateStoreManager              | v0.8.6  | `0x2a407A7659dE806FcC06b2C205e7a44D05379C58` |

#### Kovan Testnet

Follow the steps for local deployment. Make sure that the address [`0x2c0d5f47374b130ee398f4c34dbe8168824a8616`](https://kovan.etherscan.io/address/0x2c0d5f47374b130ee398f4c34dbe8168824a8616) is having enough (~1) Ether.

If you managed to deploy the contracts locally do:

```bash
export INFURA_TOKEN=<your infura token>
export NMEMORIC=<your kovan nmemoric>
npm run deploy:kovan
```

The transaction should show up on: [`0x2c0d5f47374b130ee398f4c34dbe8168824a8616`](https://kovan.etherscan.io/address/0x2c0d5f47374b130ee398f4c34dbe8168824a8616)

The contract addresses deployed on Kovan testnet:

| Contract                          | Version | Address                                      |
|-----------------------------------|---------|----------------------------------------------|
| AccessSecretStoreCondition        | v0.8.2  | `0xd7140Ca488f5087DF6F172eAFd2a2420fFE84008` |
| AgreementStoreManager             | v0.8.2  | `0xf909232DEac4eb59Bc138c8FBad2d3c8829C6377` |
| ConditionStoreManager             | v0.8.2  | `0xFa2a1E50F833712157dB3B9DB807a1110377CE66` |
| DIDRegistry                       | v0.8.2  | `0xeCbc667D2B41D00aBE75971417f543944b366899` |
| DIDRegistryLibrary                | v0.8.2  | `0x75f0B57f8F00DC065A0A50F91E0f1C0906A70531` |
| Dispenser                         | v0.8.2  | `0x76e3AD95E50961cf12ff77f838Bc308ed230E158` |
| EpochLibrary                      | v0.8.2  | `0x4E6Ffa03E6D679d4184c722780Bf824a7106eb99` |
| EscrowAccessSecretStoreTemplate   | v0.8.2  | `0x8aB702615Dc15B8B2a245fFa44BC8C52362E9aC7` |
| EscrowReward                      | v0.8.2  | `0x2dfB36f7CEf6F9f6880f45243808391b910Eae62` |
| HashLockCondition                 | v0.8.2  | `0x62175921Ad954cdA82AD394790bb6aE6f4483BC7` |
| LockRewardCondition               | v0.8.2  | `0xfb303ffDb137c9D0d4d5d938C3a5092c5525c3cd` |
| OceanToken                        | v0.8.2  | `0xA6458BEfb6e22BAe44A0AE240489A8D3d9a7E4a4` |
| SignCondition                     | v0.8.2  | `0x475B8eaf1BcE1Fe234fD901F5eAc967463170CF7` |
| TemplateStoreManager              | v0.8.2  | `0x725CEb464378C97a983794F0BB9666Bd2619c61d` |

## Libraries

To facilitate the integration of the Ocean Keeper Smart Contracts, Python and Javascript libraries are ready to be integrated. Those libraries include the Smart Contract ABI's.
Using these libraries helps to avoid compiling the Smart Contracts and copying the ABI's manually to your project. In that way the integration is cleaner and easier.
The libraries provided currently are:

* JavaScript npm package - As part of the [@oceanprotocol npm organization](https://www.npmjs.com/settings/oceanprotocol/packages), the [npm keeper-contracts package](https://www.npmjs.com/package/@oceanprotocol/keeper-contracts) provides the ABI's to be imported from your JavaScript code.
* Python Pypi package - The [Pypi keeper-contracts package](https://pypi.org/project/keeper-contracts/) provides the same ABI's to be used from Python.
* Java Maven package - It's possible to generate the maven stubs to interact with the smart contracts. It's necessary to have locally web3j and run the `scripts/maven.sh` script

## Testing

Run tests with `npm run test`, e.g.:

```bash
npm run test -- test/unit/agreements/AgreementStoreManager.Test.js
```

### Code Linting

Linting is setup for JavaScript with [ESLint](https://eslint.org) & Solidity with [Ethlint](https://github.com/duaraghav8/Ethlint).

Code style is enforced through the CI test process, builds will fail if there're any linting errors.

## Documentation

* [Main Documentation](doc/)
* [Keeper-contracts Diagram](doc/files/Keeper-Contracts.png)
* [Packaging of libraries](doc/packaging.md)
* [Upgrading contracts](doc/upgrades.md)

## New Version / New Release

See [RELEASE_PROCESS.md](RELEASE_PROCESS.md)

## Contributing

See the page titled "[Ways to Contribute](https://docs.oceanprotocol.com/concepts/contributing/)" in the Ocean Protocol documentation.

## Prior Art

This project builds on top of the work done in open source projects:
- [zeppelinos/zos](https://github.com/zeppelinos/zos)
- [OpenZeppelin/openzeppelin-eth](https://github.com/OpenZeppelin/openzeppelin-eth)

## License

```
Copyright 2018 Ocean Protocol Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
