import { log } from "console";
import { UpdateNodeRequest, RegistrarClient } from "../src/";
import config from "./config.json";

async function updateNode(client: RegistrarClient, twinID: number, nodeID: number, update: UpdateNodeRequest) {
  const account = await client.nodes.updateNode(nodeID, twinID, update);
  log("================= Updating Account =================");
  log(account);
  log("================= Updating Account =================");
}

async function getNode(client: RegistrarClient, nodeID: number) {
  const account = await client.nodes.getNode(nodeID);
  log("================= Getting Account =================");
  log(account);
  log("================= Getting Account =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, privateKey: config.privateKey });
  const update: UpdateNodeRequest = {
    farm_id: 94,
    interfaces: [
      {
        name: "eth1",
        mac: "00:1A:2B:3C:4D:5F",
        ips: "10.0.0.2",
      },
    ],
    location: {
      city: "Rotterdam",
      country: "Netherlands",
      latitude: "51.9225",
      longitude: "4.47917",
    },
    resources: {
      cru: 8,
      hru: 2000000,
      mru: 16384,
      sru: 1024000,
    },
    secure_boot: false,
    serial_number: "SN-987654321",
    virtualized: false,
  };
  const twinID = 64;
  const nodeID = 47;
  await updateNode(client, twinID, nodeID, update);
  await getNode(client, nodeID);
}
main();
