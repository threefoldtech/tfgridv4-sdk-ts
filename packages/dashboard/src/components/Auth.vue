<template>
  <v-dialog :model-value="dialog" persistent max-width="600" @update:modelValue="handleDialogUpdate">
    <v-card class="ma-2 pa-2">
      <v-card-title class="text-center">Enter or Generate Mnemonic</v-card-title>
      <v-card-text>
        <v-alert v-if="isGeneratingMnemonic" type="info" class="mb-2" variant="tonal" density="compact">
          Please copy the generated mnemonic.
        </v-alert>
        <v-form>
          <v-text-field
            v-model="mnemonic"
            label="Seed"
            required
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            :rules="[v => !!v || 'Seed is required']"
          >
          </v-text-field>
          <v-row justify="end">
            <v-col cols="5">
                <v-btn @click="generate" variant="outlined" class="text-normal" min-width="175" max-height="30">
                Generate mnemonic
                </v-btn>
            </v-col>
            <v-col cols="2">
              <v-btn
                @click="submitMnemonic"
                :disabled="!mnemonic || isSubmitting"
                block
                variant="outlined"
                class="text-normal"
                color="primary"
                max-height="30"
              >
                <template v-if="isSubmitting">
                  <v-progress-circular indeterminate size="20" />
                </template>
                <template v-else> Submit </template>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { generateMnemonic, mnemonicToSeed } from "bip39";
import tweetnacl from "tweetnacl";
import { RegistrarClient, type Account } from "@threefold/registrar_client";
import { useRegistrarStore } from "@/stores/registrar";
import { ref, defineProps, defineEmits } from "vue";
import base64 from "base64-js";
import { toast } from "vue3-toastify";

const registrarStore = useRegistrarStore();
const mnemonic = ref<string>("");
const showPassword = ref<boolean>(false);
const isGeneratingMnemonic = ref<boolean>(false);
const account = ref<Account | null>(null);
const isSubmitting = ref<boolean>(false);

const props = defineProps({
  dialog: Boolean,
});

const emit = defineEmits(["update:dialog"]);
const handleDialogUpdate = (value: boolean) => {
  emit("update:dialog", value);
};

const generate = () => {
  mnemonic.value = generateMnemonic();
  isGeneratingMnemonic.value = true;
};

const createAccount = async () => {
  try {
    account.value = await registrarStore.client!.accounts.createAccount({});
    toast.success("Account created successfully");
    handleDialogUpdate(false);
    registrarStore.setTwinID(account.value!.twin_id);
    isGeneratingMnemonic.value = false;
  } catch (e) {
    toast.error("Failed to create account");
    isSubmitting.value = false;
  }
  isSubmitting.value = false;
};

const submitMnemonic = async () => {
  isSubmitting.value = true;
  registrarStore.setClient(
    new RegistrarClient({ baseURL: import.meta.env.VITE_CLIENT_BASE_URL, mnemonicOrSeed: mnemonic.value }),
  );
  const seed = await mnemonicToSeed(mnemonic.value);
  const publicKey = tweetnacl.sign.keyPair.fromSeed(seed.subarray(32)).publicKey;
  try {
    account.value = await registrarStore.client!.accounts.getAccountByPublicKey(base64.fromByteArray(publicKey));
  } catch (error: any) {
    await createAccount();
  }

};

</script>
