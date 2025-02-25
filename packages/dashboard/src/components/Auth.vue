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
                            <v-btn @click="generateSeed" size="small" block variant="outlined" class="text-normal">Generate Seed</v-btn>
                        </v-col>
                        <v-col cols="2">
                            <v-btn @click="submitSeed" :disabled="!seed" size="small" block variant="outlined" class="text-normal">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import tweetnacl from "tweetnacl";
import { type Account, RegistrarClient } from "registrar_client";
import { ref } from "vue";
import base64 from "base64-js";

const dialog = ref<boolean>(true);
const seed = ref<string>("");
const client = ref<RegistrarClient | null>(null);
const showPassword = ref<boolean>(false);
const isGeneratingSeed = ref<boolean>(false);
const account = ref<Account | null>(null);

const generateSeed = () => {
    seed.value = Array.from(tweetnacl.randomBytes(64), byte => byte.toString(16).padStart(2, "0")).join("");
    isGeneratingSeed.value = true;
};

const submitSeed = async () => {
    console.log(import.meta.env.VITE_CLIENT_BASE_URL);
  console.log(seed.value);
  client.value = new RegistrarClient({ baseURL: import.meta.env.VITE_CLIENT_BASE_URL, privateKey: seed.value });
  const publicKey = tweetnacl.sign.keyPair.fromSecretKey(base64.toByteArray(seed.value)).publicKey;
  try {
    account.value = await client.value.accounts.getAccountByPublicKey(base64.fromByteArray(publicKey));
  } catch (error) {
    console.error(error);
  }
};
</script>
