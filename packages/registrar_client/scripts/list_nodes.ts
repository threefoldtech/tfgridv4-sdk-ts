import { RegistrarClient, NodesFilter } from "../src/";
import config from "./config.json";

async function listNodes(client: RegistrarClient, filter: NodesFilter) {
  const nodes = await client.nodes.listNodes(filter);
  console.log("================= Listing Nodes =================");
  console.log(nodes);
  console.log("================= Listing Nodes =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, privateKey: config.privateKey });
  const filter: NodesFilter = {
    farm_id: 70,
  };
  await listNodes(client, filter);
}

main();
