import { log } from "console";
import { RegistrarClient, UpdateAccountRequest } from "../src/";
import config from "./config.json";

async function updateAccount(client: RegistrarClient, twinID: number, update: UpdateAccountRequest) {
  const account = await client.accounts.updateAccount(twinID, update);
  log("================= Updating Account =================");
  log(account);
  log("================= Updating Account =================");
}

async function getAccount(client: RegistrarClient, twinID: number) {
  const account = await client.accounts.getAccountByTwinId(twinID);
  log("================= Getting Account =================");
  log(account);
  log("================= Getting Account =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, privateKey: config.privateKey });
  const update: UpdateAccountRequest = {
    relays: ["relay1", "relay2"],
    rmb_enc_key: "rmb_enc_key",
  };
  const twinID = 63;
  await updateAccount(client, twinID, update);
  await getAccount(client, twinID);
}

main();
