import { log } from "console";
import { RegistrarClient, UpdateAccountRequest } from "../src/";

async function updateAccount(client: RegistrarClient, twinID: number, update: UpdateAccountRequest) {
  const account = await client.accounts.updateAccount(twinID, update);
  log("================= Updating Account =================");
  log(account);
  log("================= Updating Account =================");
}

async function getAccount(client: RegistrarClient, twinID: number) {
  const account = await client.accounts.getAccountByTwinId(twinID);
  log("================= Getting Account =================");
  log(account);
  log("================= Getting Account =================");
}

async function main() {
  const privateKey = "6KY+Ih5LLTivq4cGNrFxkNVtx0lSGbK7wfp2IP/6Wa3plMiff05OWILxBgdPDPrIvPaeBgwTe9bwt4X61Sm2fQ==";
  const client = new RegistrarClient({ baseURL: "https://registrar.grid.tf/v1/", privateKey: privateKey });
  const update: UpdateAccountRequest = {
    relays: ["relay1", "relay2"],
    rmb_enc_key: "rmb_enc_key",
  };
  const twinID = 63;
  await updateAccount(client, twinID, update);
  await getAccount(client, twinID);
}

main();
