import { describe, test, expect } from "@jest/globals";
import { RegistrarClient } from "../../src/client/client";

describe("test zos module", () => {
  const client = new RegistrarClient({ baseURL: "https://registrar.dev4.grid.tf/v1", privateKey: "private_key" });

  test("get zos version", async () => {
    const zos = await client.zos.getZosVersion();
    expect(zos).not.toBeNull();
  });
});
