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

To initialize the Registrar Client, you need to provide the base url of registrar and your mnemonics or 64 character hex seed

To generate 64 character hex seed:

```bash
openssl rand -hex 32
```

Here is an example:

```typescript
const client = new RegistrarClient({ baseURl: "https://registrar.dev4.grid.tf/v1", privateKey: your_private_key });
```

To be able to create a farm you need to have a Stellar wallet and provide your Stellar address. For more details on how to create a Stellar wallet and generate a Stellar address, please refer to the [Stellar Account Viewer](https://www.stellar.org/account-viewer/#!/) or the [Stellar Documentation](https://developers.stellar.org/docs/tutorials/create-account/).

## Usage

Here is an example of how to use the Registrar Client:

```typescript
const client = new RegistrarClient({ baseUrl: URl, privateKey: your_private_key });

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
