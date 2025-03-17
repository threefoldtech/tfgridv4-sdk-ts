import { RegistrarClient } from "@threefold/registrar_client";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useRegistrarStore = defineStore("registrat-client", () => {
  const client = ref<RegistrarClient | null>(null);
  const twinID = ref<number | null>(null);

  const setClient = (newClient: RegistrarClient) => {
    client.value = newClient;
  };

  const setTwinID = (id: number) => {
    twinID.value = id;
  };
  const reset = () => {
    client.value = null;
    twinID.value = null;
  };

  return {
    client,
    twinID,
    setClient,
    setTwinID,
    reset,
  };
});
