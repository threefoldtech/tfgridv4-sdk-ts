# Registrar Client

This package provides a client for interacting with the TFGrid v4 Node Registrar.

## Getting Started

To initialize the Registrar Client, you need to provide the base url of registrar and your private key. Here is an example:

```typescript
const client = new RegistrarClient({baseURl:"https://registrar.dev4.grid.tf/v1" , privateKey: your_private_key});
```

## Usage

Here is an example of how to use the Registrar Client:

```typescript
const client = new RegistrarClient({baseUrl: URl, privateKey: your_private_key});

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
