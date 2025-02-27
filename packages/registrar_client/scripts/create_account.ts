import { log } from "console";
import { RegistrarClient } from "../src/";
import tweetnacl from "tweetnacl";
import base64 from "base64-js";

async function createAccount(client: RegistrarClient) {
  const account = await client.accounts.createAccount({});
  log("================= Creating Account =================");
  log(account);
  log("================= Creating Account =================");
}

async function main() {
  const keyPair = tweetnacl.sign.keyPair();
  const privateKey = base64.fromByteArray(keyPair.secretKey);
  const client = new RegistrarClient({ baseURL: "https://registrar.grid.tf/v1/", privateKey: privateKey });
  await createAccount(client);
}

main();
