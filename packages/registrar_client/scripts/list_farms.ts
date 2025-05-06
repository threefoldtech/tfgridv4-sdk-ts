import { RegistrarClient, NodesFilter } from "../src/";
import config from "./config.json";

async function listFarms(client: RegistrarClient, filter: NodesFilter) {
  const nodes = await client.nodes.listNodes(filter);
  console.log("================= Listing Nodes =================");
  console.log(nodes);
  console.log("================= Listing Nodes =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, mnemonicOrSeed: config.mnemonicOrSeed });
  await listFarms(client, {});
}

main();
