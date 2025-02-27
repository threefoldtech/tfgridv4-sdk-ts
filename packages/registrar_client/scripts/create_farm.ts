import { log } from "console";
import { Account, RegistrarClient } from "../src/";
import tweetnacl from "tweetnacl";
import base64 from "base64-js";

async function createAccount(client: RegistrarClient): Promise<Account> {
  const account = await client.accounts.createAccount({});
  log("================= Creating Account =================");
  log(account);
  log("================= Creating Account =================");
  return account!;
}

async function createFarm(client: RegistrarClient, twinID: number): Promise<number> {
  const res = await client.farms.createFarm(`test-${Date.now()}`, false, twinID);
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
  const keyPair = tweetnacl.sign.keyPair();
  const privateKey = base64.fromByteArray(keyPair.secretKey);
  const client = new RegistrarClient({ baseURL: "https://registrar.grid.tf/v1/", privateKey: privateKey });
  const account = await createAccount(client);
  const twinID = account.twin_id;
  const farmID = await createFarm(client, twinID);
  await getFarm(client, farmID);
}

main();
