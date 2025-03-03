import { log } from "console";
import { RegistrarClient } from "../src/";
import config from "./config.json";

async function createAccount(client: RegistrarClient) {
  const account = await client.accounts.createAccount({});
  log("================= Creating Account =================");
  log(account);
  log("================= Creating Account =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, privateKey: config.privateKey });
  await createAccount(client);
}

main();
