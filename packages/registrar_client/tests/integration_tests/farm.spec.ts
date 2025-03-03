import { describe, test, expect } from "@jest/globals";
import tweetnacl from "tweetnacl";
import base64 from "base64-js";
import { RegistrarClient } from "../../src/client/client";

describe("test farm module", () => {
  const keyPair = tweetnacl.sign.keyPair();
  const privateKey = base64.fromByteArray(keyPair.secretKey);

  const client = new RegistrarClient({ baseURL: "http://localhost:8080/v1", privateKey: privateKey });

  let twinID = 1;
  let farmID = 1;

  test("create farm", async () => {
    const account = await client.accounts.createAccount({});
    expect(account).not.toBeNull();
    twinID = account!.twin_id;

    const farmName = `test-${Date.now()}`;
    const res = await client.farms.createFarm(farmName, false, twinID);
    expect(res).not.toBeNull();

    farmID = res!.farm_id;
  });
  
  test("create farm with invalid farm name", async () => {
    const farmName = "";
    await expect(client.farms.createFarm(farmName, false, twinID)).rejects.toThrowError(
      "Farm name must have minimum 1 and maximum 40 characters",
    );

    const farmName2 = "a".repeat(41);
    await expect(client.farms.createFarm(farmName2, false, twinID)).rejects.toThrowError(
      "Farm name must have minimum 1 and maximum 40 characters",
    );
  });

  test("create farm with invalid twin id", async () => {
    await expect(client.farms.createFarm("test", false, 0)).rejects.toThrowError("Invalid twinId");
    await expect(client.farms.createFarm("test", false, -1)).rejects.toThrowError("Invalid twinId");
  });

  test("create farm with non-existing twin id", async () => {
    await expect(client.farms.createFarm("test",false, twinID+20)).rejects.toThrowError(
      "Failed to create farm: 404 Not Found",
    );
  });

  test.skip("create farm with existing farm name with same twinId", async () => {
    const farmName = `test-${Date.now()}`;
    await client.farms.createFarm(farmName, false, twinID);
    await expect(client.farms.createFarm(farmName, true, twinID)).rejects.toThrowError(
      "Failed to create farm: 409 Conflict",
    );
  });

  test("create farm with existing farm name with different twinId", async () => {
    const farmName = `test-${Date.now()}`;
    await client.farms.createFarm(farmName, false, twinID);
    await expect(client.farms.createFarm(farmName, false, twinID - 1)).rejects.toThrowError(
      "Failed to create farm: 401 Unauthorized",
    );
  });

  test("list farms without filters", async () => {
    const farms = await client.farms.listFarms({});
    expect(farms).not.toBeNull();
    expect(farms?.length).toBeGreaterThan(0);
  });

  test("list farms with filters", async () => {
    const farms = await client.farms.listFarms({ twin_id: twinID });
    expect(farms).not.toBeNull();
    expect(farms?.length).toBeGreaterThan;
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
