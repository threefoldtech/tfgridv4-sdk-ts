import { describe, test, expect } from "@jest/globals";
import { NodeRegistrationRequest, UptimeReportRequest, NodesFilter } from "../../src/modules/node/types";
import { RegistrarClient } from "../../src/client/client";
import tweetnacl from "tweetnacl";
import base64 from "base64-js";

describe("test node module", () => {
  const keyPair = tweetnacl.sign.keyPair();
  const privateKey = base64.fromByteArray(keyPair.secretKey);

  const client = new RegistrarClient({ baseURL: "http://registrar:8080/v1", privateKey: privateKey });

  let twinID = 1;
  let nodeID = 1;
  let farmID = 1;

  test("create node", async () => {
    const account = await client.accounts.createAccount({});
    expect(account).not.toBeNull();
    twinID = account!.twin_id;

    const farm = await client.farms.createFarm({ twin_id: twinID, farm_name: `test-${Date.now()}` });
    expect(farm).not.toBeNull();
    farmID = farm!;
    const dummyNode: NodeRegistrationRequest = {
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
      secureBoot: true,
      serial_number: "SN-123456789",
      virtualized: true,
    };
    const res = await client.nodes.registerNode(dummyNode);
    expect(res).not.toBeNull();

    nodeID = res!;
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
    const node = await client.nodes.getNode(nodeID);
    expect(node).not.toBeNull();
    expect(node?.uptime).not.toBeNull();
    expect(node?.uptime.length).toBeGreaterThan(0);
  });
});
