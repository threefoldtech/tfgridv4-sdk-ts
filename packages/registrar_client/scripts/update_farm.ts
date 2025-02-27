import { log } from "console";
import { RegistrarClient } from "../src/";

async function updateFarm(client: RegistrarClient, twinID: number, farmID: number, farmName: string) {
  const farm = await client.farms.updateFarm(farmID, twinID, farmName);
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
  const privateKey = "private_key";
  const client = new RegistrarClient({ baseURL: "https://registrar.grid.tf/v1/", privateKey: privateKey });
  const twinID = 64;
  const farmID = 94;
  const farmName = "test-farm";
  await updateFarm(client, twinID, farmID, farmName);
  await getFarm(client, farmID);
}

main();
