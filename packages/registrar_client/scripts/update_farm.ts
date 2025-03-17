import { log } from "console";
import { RegistrarClient } from "../src/";
import config from "./config.json";

async function updateFarm(client: RegistrarClient, twinID: number, farmID: number, farmName: string) {
  const farm = await client.farms.updateFarm(farmID, twinID, farmName, config.stellarAddress);
  log("================= Updating Farm =================");
  log(farm);
  log("================= Updating Farm =================");
}

async function getFarm(client: RegistrarClient, farmID: number) {
  const farm = await client.farms.getFarm(farmID);
  log("================= Getting Farm =================");
  log(farm);
  log("================= Getting Farm =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, mnemonicOrSeed: config.mnemonicOrSeed });
  const twinID = 143;
  const farmID = 46;
  const farmName = "testfarm";
  await updateFarm(client, twinID, farmID, farmName);
  await getFarm(client, farmID);
}

main();
