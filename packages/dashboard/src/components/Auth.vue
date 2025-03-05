<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card class="ma-2 pa-2">
      <v-card-title class="text-center">Enter or Generate Seed</v-card-title>
      <v-card-text>
        <v-alert v-if="isGeneratingSeed" type="info" class="mb-2" variant="tonal" density="compact">
          Please copy the generated seed.
        </v-alert>
        <v-form>
          <v-text-field
            v-model="seed"
            label="Seed"
            required
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            :rules="[v => !!v || 'Seed is required']"
          >
          </v-text-field>
          <v-row justify="end">
            <v-col cols="3">
              <v-btn @click="generateSeed" size="small" block variant="outlined" class="text-normal"
                >Generate Seed</v-btn
              >
            </v-col>
            <v-col cols="2">
              <v-btn @click="submitSeed" :disabled="!seed || isSubmitting" size="small" block variant="outlined" class="text-normal">
                <template v-if="isSubmitting">
                  <v-progress-circular indeterminate size="20" />
                </template>
                <template v-else>
                  Submit
                </template>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import tweetnacl from "tweetnacl";
import { RegistrarClient, type Account } from "@threefold/registrar_client";
import { useRegistrarStore } from "@/stores/registrar";
import { ref } from "vue";
import base64 from "base64-js";

const registrarStore = useRegistrarStore();
const dialog = ref<boolean>(registrarStore.twinID === null ? true : false);
const seed = ref<string>("");
const showPassword = ref<boolean>(false);
const isGeneratingSeed = ref<boolean>(false);
const account = ref<Account | null>(null);
const isSubmitting = ref<boolean>(false);


const generateSeed = () => {
  const privateKey = tweetnacl.sign.keyPair();
  seed.value = base64.fromByteArray(privateKey.secretKey);
  isGeneratingSeed.value = true;
};

const submitSeed = async () => {
  isSubmitting.value = true;
  registrarStore.setClient(
    new RegistrarClient({ baseURL: import.meta.env.VITE_CLIENT_BASE_URL, privateKey: seed.value }),
  );
  const publicKey = tweetnacl.sign.keyPair.fromSecretKey(base64.toByteArray(seed.value)).publicKey;
  try {
    account.value = await registrarStore.client!.accounts.getAccountByPublicKey(base64.fromByteArray(publicKey));
    console.log(account.value.twin_id);
  } catch (error: any) {
    console.error(error);
    if (error.message.includes("404")) {
      account.value = await registrarStore.client!.accounts.createAccount({});
    }
  }
  registrarStore.setTwinID(account.value!.twin_id);
  dialog.value = false;
};
</script>
