import { describe, test, expect } from "@jest/globals";
import { NodeRegistrationRequest, UptimeReportRequest, NodesFilter } from "../../src/types/node";
import { RegistrarClient } from "../../src/client/client";
import config from "../config.json";
import{Keypair} from "@stellar/stellar-base";
import { generateMnemonic } from "bip39";

describe("test node module", () => {
  const mnemonic = generateMnemonic();

  const client = new RegistrarClient({ baseURL: config.baseUrl, mnemonicOrSeed: mnemonic });

  let twinID = 1;
  let nodeID = 1;
  let farmID = 1;
  const dummyNode: Partial<NodeRegistrationRequest> = {
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

  test("create node", async () => {
    const account = await client.accounts.createAccount({});
    expect(account).not.toBeNull();
    twinID = account!.twin_id;
    const stellarAddress = Keypair.random().publicKey();
    const farm = await client.farms.createFarm(`test${Date.now()}`, false, twinID, stellarAddress);
    expect(farm).not.toBeNull();
    farmID = farm!.farm_id;

    dummyNode.twin_id = twinID;
    dummyNode.farm_id = farmID;
    const res = await client.nodes.registerNode(dummyNode as NodeRegistrationRequest);
    expect(res).not.toBeNull();

    nodeID = res!.node_id;
  });

  test.skip("create node with duplicate twin id", async () => {
    dummyNode.twin_id = twinID;
    expect(client.nodes.registerNode(dummyNode as NodeRegistrationRequest)).rejects.toThrowError(
      "Failed to register node: 409 Conflict",
    );
  });
  test("create node with non-existed twin id", async () => {
    dummyNode.twin_id = 9999999999999;
    await expect(client.nodes.registerNode(dummyNode as NodeRegistrationRequest)).rejects.toThrowError(
      "Failed to register node: 404 Not Found",
    );
  });

  test("create node with non-existed farm id", async () => {
    dummyNode.twin_id = twinID;
    dummyNode.farm_id = 9999999999999;
    await expect(client.nodes.registerNode(dummyNode as NodeRegistrationRequest)).rejects.toThrowError(
      "Failed to register node: 500 Internal Server Error",
    );
  });

  test("create node with invalid twin id", async () => {
    dummyNode.twin_id = 0;
    dummyNode.farm_id = farmID;
    await expect(client.nodes.registerNode(dummyNode as NodeRegistrationRequest)).rejects.toThrowError(
      "Invalid node: twinId",
    );
  });

  test("create node with invalid farm id", async () => {
    dummyNode.twin_id = twinID;
    dummyNode.farm_id = 0;
    await expect(client.nodes.registerNode(dummyNode as NodeRegistrationRequest)).rejects.toThrowError(
      "Invalid node: farmId",
    );
  });

  test("create node with invalid location", async () => {
    dummyNode.twin_id = twinID;
    dummyNode.farm_id = farmID;
    dummyNode.location = {
      city: "Amsterdam",
      country: "Netherlands",
      latitude: "",
      longitude: "",
    };
    await expect(client.nodes.registerNode(dummyNode as NodeRegistrationRequest)).rejects.toThrowError(
      "Invalid location: latitude",
    );
  });

  test("list nodes without filters", async () => {
    const nodes = await client.nodes.listNodes({});
    expect(nodes).not.toBeNull();
    expect(nodes?.length).toBeGreaterThan(0);
  });

  test("list nodes with filter farm id", async () => {
    const filter: NodesFilter = { farm_id: farmID };
    const nodes = await client.nodes.listNodes(filter);
    expect(nodes).not.toBeNull();
    expect(nodes?.length).toBeGreaterThan(0);
    expect(nodes?.[0].farm_id).toBe(farmID);
  });

  test("list nodes with filter node id", async () => {
    const filter: NodesFilter = { node_id: nodeID };
    const nodes = await client.nodes.listNodes(filter);
    expect(nodes).not.toBeNull();
    expect(nodes?.length).toBeGreaterThan(0);
    expect(nodes?.[0].node_id).toBe(nodeID);
  });

  test("get node", async () => {
    const node = await client.nodes.getNode(nodeID);
    expect(node).not.toBeNull();
  });

  test("update node", async () => {
    const update = {
      farm_id: farmID,
      interfaces: [
        {
          name: "eth0",
          mac: "00:1A:2B:3C:4D:5E",
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
      secureBoot: false,
      serial_number: "SN-987654321",
      virtualized: false,
    };
    const node = await client.nodes.updateNode(nodeID, twinID, update);
    expect(node).not.toBeNull();
    const updatedNode = await client.nodes.getNode(nodeID);
    expect(updatedNode).not.toBeNull();
    expect(updatedNode?.location.city).toBe("Rotterdam");
  });

  test("report node uptime", async () => {
    const uptime: UptimeReportRequest = {
      timestamp: new Date().toISOString(),
      uptime: 100,
    };
    const res = await client.nodes.reportNodeUptime(nodeID, twinID, uptime);
    expect(res).not.toBeNull();
  });
});
