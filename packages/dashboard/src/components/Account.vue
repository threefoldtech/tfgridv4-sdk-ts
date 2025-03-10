<template>
  <v-dialog :model-value="dialog" max-width="500" @update:modelValue="handleDialogUpdate">
    <v-card>
      <v-card-title>Account</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="account.twin_id"
              label="Twin ID"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="account.relays"
              label="Relays"
              :disabled="!isEditable"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="account.rmb_enc_key"
              label="RMB Enc Key"
              :disabled="!isEditable"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="account.public_key"
              label="Public Key"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="toggleEdit" color="primary">
          {{ isEditable ? 'Save' : 'Edit' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRegistrarStore } from "@/stores/registrar";
import { ref, onMounted, watch } from "vue";
import { type Account } from "@threefold/registrar_client";

const registrarStore = useRegistrarStore();
const props = defineProps({
  dialog: Boolean,
});

const emit = defineEmits(["update:dialog"]);
const handleDialogUpdate = (value: boolean) => {
  emit("update:dialog", value);
};

const account = ref<Partial<Account>>({
  twin_id: 0,
  relays: [],
  rmb_enc_key: '',
  public_key: ''
});

const isEditable = ref(false);

const fetchAccount = async () => {
  try {
    const fetchedAccount = await registrarStore.client!.accounts.getAccountByTwinId(registrarStore.twinID!);
    account.value = fetchedAccount;
  } catch (e) {
    console.error(e);
  }
};

const toggleEdit = () => {
  if (isEditable.value) {
    registrarStore.client!.accounts.updateAccount(account.value.twin_id!, {
      relays: account.value.relays,
      rmb_enc_key: account.value.rmb_enc_key,
    });
  }
  isEditable.value = !isEditable.value;
};

onMounted(() => {
  fetchAccount();
});

watch(account, () => {
  isEditable.value = false;
}, { deep: true });

</script>