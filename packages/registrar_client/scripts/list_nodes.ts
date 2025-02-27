import { RegistrarClient, NodesFilter } from "../src/";

async function listNodes(client: RegistrarClient, filter: NodesFilter) {
  const nodes = await client.nodes.listNodes(filter);
  console.log("================= Listing Nodes =================");
  console.log(nodes);
  console.log("================= Listing Nodes =================");
}

async function main() {
  const privateKey = "private_key";
  const client = new RegistrarClient({ baseURL: "https://registrar.grid.tf/v1/", privateKey: privateKey });
  const filter: NodesFilter = {
    farm_id: 70,
  };
  await listNodes(client, filter);
}

main();
