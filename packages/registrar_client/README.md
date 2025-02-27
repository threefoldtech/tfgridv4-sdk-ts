# Registrar Client

This package provides a client for interacting with the TFGrid v4 Node Registrar.

## Prerequisites

- node 20.10.0 or higher
- npm 10.2.3 or higher

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

To initialize the Registrar Client, you need to provide the base url of registrar and your private key. Here is an example:

```typescript
const client = new RegistrarClient({ baseURl: "https://registrar.dev4.grid.tf/v1", privateKey: your_private_key });
```

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

before running tests make sure to set base url of the client in test file

then run with:

```bash
yarn test
```
