# Registrar Client

This package provides a client for interacting with the TFGrid v4 Node Registrar.

## Prerequisites

- node 20.10.0 or higher

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/threefoldtech/tfgridv4-sdk-ts
   cd tfgridv4-sdk-ts
   ```

2. **Navigate to the Package Directory**

   ```bash
   cd packages/registrar_client
   ```

3. **Install Dependencies**

   ```bash
   yarn install
   ```

4. **Build the Package**

   ```bash
   yarn build
   ```

## Getting Started

To initialize the Registrar Client, you need to provide the base URL of the registrar and either your mnemonic phrase or a 64-character hex seed. You also need to specify the keypair type.

The supported keypair types are:

- `ed25519`
- `sr25519` (default)

Here's how to initialize the client:

```typescript
const client = new RegistrarClient({
  baseUrl: "https://registrar.dev4.grid.tf/v1",
  mnemonicOrSeed: "your_mnemonic_or_seed",
  keypairType: "sr25519", // Optional, defaults to "sr25519"
});
```

To generate 64 character hex seed:

```bash
openssl rand -hex 32
```

Here is an example:

```typescript
const client = new RegistrarClient({
  baseURl: "https://registrar.dev4.grid.tf/v1",
  mnemonicOrSeed: "your_mnemonic_or_seed",
  keypairType: "ed21559"
});
```

To be able to create a farm you need to have a Stellar wallet and provide your Stellar address. For more details on how to create a Stellar wallet and generate a Stellar address, please refer to the [Stellar Account Viewer](https://www.stellar.org/account-viewer/#!/) or the [Stellar Documentation](https://developers.stellar.org/docs/tutorials/create-account/).

## Usage

Here is an example of how to use the Registrar Client:

```typescript
const client = new RegistrarClient({ baseUrl: URl, mnemonicOrSeed: your_mnemonic_or_seed, keypairType: "ed21559" });

// Example: Create an account
const accountRequest: CreateAccountRequest = {
  // your create account request data
};

const account = await client.account.createAccount(accountRequest);

// Example: Get account details
const twinID = account.twin_id;
const accountDetails = await client.account.getAccountByTwinId(twinID);

// Example: Update account information
const updateAccountRequest: UpdateAccountRequest = {
  // your update account request data
};

const updatedAccount = await client.account.updateAccount(twinID, updateAccountRequest);
```

more example script can be found [here](./scripts/)

## Tests

- Before running the tests set your base url in `tests/config.json`

then run with:

```bash
yarn test
```
