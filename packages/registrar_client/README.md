# Registrar Client

This package provides a client for interacting with the TFGrid v4 Node Registrar.

## Getting Started

Set the `REGISTRAR_URL` in your environment variables to point to the TFGrid v4 Node Registrar.

```sh
export REGISTRAR_URL=https://your-registrar-url
```

## Usage

Here is an example of how to use the Registrar Client:

```typescript
const privateKey = "your_private_key";
const client = new RegistrarClient(privateKey);

const accountRequest: CreateAccountRequest = {
  // your create account request data
};
client.account
  .createAccount(accountRequest)
  .then(account => {
    console.log("Account created:", account);
  })
  .catch(error => {
    console.error("Failed to create account:", error);
  });
```
