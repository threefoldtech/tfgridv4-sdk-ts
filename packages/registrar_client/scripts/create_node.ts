import { log } from "console";
import { Account, RegistrarClient, NodeRegistrationRequest } from "../src/";
import config from "./config.json";
import * as base64 from "base64-js";
import { derivePublicKey } from "./utils";

async function getAccount(client: RegistrarClient): Promise<Account> {
  const publicKey = await derivePublicKey(config.mnemonicOrSeed);
  const account = await client.accounts.getAccountByPublicKey(base64.fromByteArray(publicKey));
  log("================= Getting Account =================");
  log(account);
  log("================= Getting Account =================");
  return account!;
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
  const client = new RegistrarClient({ baseURL: config.baseUrl, mnemonicOrSeed: config.mnemonicOrSeed });
  const account = await getAccount(client);
  const twinID = account.twin_id;
  const node: NodeRegistrationRequest = {
    twin_id: twinID,
    farm_id: 46,
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
