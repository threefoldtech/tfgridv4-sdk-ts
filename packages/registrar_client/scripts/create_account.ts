import { log } from "console";
import { RegistrarClient } from "../src/";
import config from "./config.json";
import { KeypairType } from "@polkadot/util-crypto/types";

async function createAccount(client: RegistrarClient) {
  const account = await client.accounts.createAccount({});
  log("================= Creating Account =================");
  log(account);
  log("================= Creating Account =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, mnemonicOrSeed: config.mnemonicOrSeed, keypairType: config.keypairType as KeypairType });
  await createAccount(client);
}

main();
