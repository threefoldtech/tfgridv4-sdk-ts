import { describe, test, expect } from "@jest/globals";
import { RegistrarClient } from "../../src/client/client";
import { generateKeypair } from "../utils";
import config from "../config.json";
import{Keypair} from "@stellar/stellar-base";

describe("test farm module", () => {
  const { privateKey } = generateKeypair();
  const client = new RegistrarClient({ baseURL: config.baseUrl, privateKey: privateKey });

  let twinID = 1;
  let farmID = 1;

  let stellarAddress = Keypair.random().publicKey();

  test("create farm", async () => {
    const account = await client.accounts.createAccount({});
    expect(account).not.toBeNull();
    twinID = account!.twin_id;
    const farmName = `test${Date.now()}`;
    const res = await client.farms.createFarm(farmName, false, twinID, stellarAddress);
    expect(res).not.toBeNull();

    farmID = res!.farm_id;
  });
  
  test("create farm with invalid farm name", async () => {
    const farmName = "";

    await expect(client.farms.createFarm(farmName, false, twinID,"" )).rejects.toThrowError(
      "Farm name must have minimum 1 and maximum 40 characters",
    );

    const farmName2 = "a".repeat(41);
    await expect(client.farms.createFarm(farmName2, false, twinID, "")).rejects.toThrowError(
      "Farm name must have minimum 1 and maximum 40 characters",
    );
  });

  test("create farm with invalid twin id", async () => {
    await expect(client.farms.createFarm("test", false, 0, "")).rejects.toThrowError("Invalid twinId");
    await expect(client.farms.createFarm("test", false, -1, "")).rejects.toThrowError("Invalid twinId");
  });

  test("create farm with invalid stellar address", async () => {
    const stellarAddress = "invalid";
    await expect(client.farms.createFarm("test", false, twinID,stellarAddress)).rejects.toThrowError("Invalid stellar address");
  });

  test("create farm with non-existing twin id", async () => {
    const stellarAddress = Keypair.random().publicKey();
    await expect(client.farms.createFarm("test",false, twinID+20,stellarAddress)).rejects.toThrowError(
      "Failed to create farm: 404 Not Found",
    );
  });

  test.skip("create farm with existing farm name with same twinId", async () => {
    const farmName = `test-${Date.now()}`;
    const stellarAddress = Keypair.random().publicKey();
    await client.farms.createFarm(farmName, false, twinID, stellarAddress);
    await expect(client.farms.createFarm(farmName, true, twinID,stellarAddress)).rejects.toThrowError(
      "Failed to create farm: 409 Conflict",
    );
  });

  test("create farm with existing farm name with different twinId", async () => {
    const farmName = `test${Date.now()}`;
    const stellarAddress = Keypair.random().publicKey();
    await client.farms.createFarm(farmName, false, twinID,stellarAddress);
    await expect(client.farms.createFarm(farmName, false, twinID - 1, stellarAddress)).rejects.toThrowError(
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
    const farmName = `test24${Date.now()}`;
    const farm = await client.farms.updateFarm(farmID, twinID, farmName, stellarAddress);
    expect(farm).not.toBeNull();
    const updatedFarm = await client.farms.getFarm(farmID);
    expect(updatedFarm).not.toBeNull();
    expect(updatedFarm?.farm_name).toBe(farmName);
  });
});
