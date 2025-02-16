import Accounts from "./models/accounts";
import Farms from "./models/farms";

async function fetchData() {
  try {
    const account = new Accounts();
    const data = await account.createAccount({
      relays: ["relay.com"],
      rmb_enc_key: "string",
      public_key: "jqxuczPp2nKiyolgR/ItPRHIILijyjRpdE2Z/S6rVHA=",
    });
    // const farm = new Farms();
    // const data = await farm.listFarms({
    //   farm_name: "zsQHTBEg2KEEg3pNvfc5",
    //   twin_id: 9,
    // });
    if (data) console.log("Fetched Data:", data);
  } catch (error) {
    console.error("API Error:", error);
  }
}

fetchData();

// import Config from "./configs/config"; // Adjust the path if needed

// console.log("Network:", Config.NETWORK);
// console.log("Registrar URL:", Config.REGISTRAR_NODE_CLIENT);
