import Nodes from "./models/nodes";

async function fetchData() {
  try {
    const node = new Nodes();
    const data = await node.getNode(1);
    console.log("Fetched Data:", data);
    if (data) console.log("Fetched Data:", data[0].farm_id);
  } catch (error) {
    console.error("API Error:", error);
  }
}

fetchData();
