import { log } from "console";
import { Account, RegistrarClient } from "../src/";
import config from "./config.json";

async function createAccount(client: RegistrarClient): Promise<Account> {
  const account = await client.accounts.createAccount({});
  log("================= Creating Account =================");
  log(account);
  log("================= Creating Account =================");
  return account!;
}

async function createFarm(client: RegistrarClient, twinID: number, stellarAddress: string): Promise<number> {
  const res = await client.farms.createFarm(`test${Date.now()}`, false, twinID, stellarAddress);
  log("================= Creating Farm =================");
  log(res);
  log("================= Creating Farm =================");
  return res!.farm_id;
}

async function getFarm(client: RegistrarClient, farmID: number) {
  const farm = await client.farms.getFarm(farmID);
  log("================= Getting Farm =================");
  log(farm);
  log("================= Getting Farm =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, privateKey: config.privateKey });
  const account = await createAccount(client);
  const twinID = account.twin_id;
  const farmID = await createFarm(client, twinID, config.stellarAddress);
  await getFarm(client, farmID);
}

main();
