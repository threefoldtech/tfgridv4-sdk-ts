import { describe, test, expect } from "@jest/globals";
import tweetnacl from "tweetnacl";
import base64 from "base64-js";
import { RegistrarClient } from "../../src/client/client";

describe("test farm module", () => {
  const keyPair = tweetnacl.sign.keyPair();
  const privateKey = base64.fromByteArray(keyPair.secretKey);

  const client = new RegistrarClient(privateKey);

  let twinID = 1;
  let farmID = 1;

  test("create farm", async () => {
    const account = await client.accounts.createAccount({});
    expect(account).not.toBeNull();
    twinID = account!.twin_id;

    const farmName = `test-${Date.now()}`;
    const res = await client.farms.createFarm({ twin_id: twinID, farm_name: farmName });
    expect(res).not.toBeNull();

    farmID = res!;
  });

  test("list farms", async () => {
    const farms = await client.farms.listFarms({});
    expect(farms).not.toBeNull();
    expect(farms?.length).toBeGreaterThan(0);
  });

  test("get farm", async () => {
    const farm = await client.farms.getFarm(farmID);
    expect(farm).not.toBeNull();
  });

  test("update farm", async () => {
    const farmName = `test24-${Date.now()}`;
    const farm = await client.farms.updateFarm(farmID, twinID, farmName);
    expect(farm).not.toBeNull();

    const updatedFarm = await client.farms.getFarm(farmID);
    expect(updatedFarm).not.toBeNull();
    expect(updatedFarm?.farm_name).toBe(farmName);
  });
});
