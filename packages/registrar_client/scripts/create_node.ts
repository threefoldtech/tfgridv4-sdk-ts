import { log } from "console";
import { Account, RegistrarClient, NodeRegistrationRequest } from "../src/";
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

async function createNode(client: RegistrarClient, node: NodeRegistrationRequest): Promise<number> {
  const res = await client.nodes.registerNode(node);
  log("================= Creating Node =================");
  log(res);
  log("================= Creating Node =================");
  return res!.node_id;
}

async function getNode(client: RegistrarClient, nodeID: number) {
  const node = await client.nodes.getNode(nodeID);
  log("================= Getting Node =================");
  log(node);
  log("================= Getting Node =================");
}

async function main() {
  const client = new RegistrarClient({ baseURL: config.baseUrl, privateKey: config.privateKey });
  const account = await createAccount(client);
  const twinID = account.twin_id;
  const farmID = await createFarm(client, twinID, config.stellarAddress);
  const node: NodeRegistrationRequest = {
    twin_id: twinID,
    farm_id: farmID,
    interfaces: [
      {
        name: "eth0",
        mac: "00:1A:2B:3C:4D:5E",
        ips: "10.0.0.1",
      },
    ],
    location: {
      city: "Amsterdam",
      country: "Netherlands",
      latitude: "52.3676",
      longitude: "4.9041",
    },
    resources: {
      cru: 4,
      hru: 1000000,
      mru: 8192,
      sru: 512000,
    },
    secure_boot: true,
    serial_number: "SN-123456789",
    virtualized: true,
  };
  const nodeID = await createNode(client, node);
  await getNode(client, nodeID);
}

main();
