<template>
  <v-dialog :model-value="dialog" max-width="500" @update:modelValue="handleDialogUpdate">
    <v-card>
      <v-card-title>Create Farm</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="name"
            label="Farm Name"
            required
            :rules="[v => !!v || 'Farm name is required']"
          ></v-text-field>
          <v-checkbox v-model="dedicated" label="Dedicated"></v-checkbox>
          <v-divider class="mb-2"></v-divider>
          <v-row justify="end">
            <v-col cols="3">
              <v-btn
                @click="submitFarm"
                :disabled="!name || isSubmitting"
                size="small"
                block
                variant="outlined"
                class="text-normal"
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
import { ref, defineProps, defineEmits } from "vue";
import { useRegistrarStore } from "@/stores/registrar";

const props = defineProps({
  dialog: Boolean,
});

const emit = defineEmits(["update:dialog"]);

const isSubmitting = ref<boolean>(false);
const name = ref<string>("");
const dedicated = ref<boolean>(false);
const registrarStore = useRegistrarStore();

const handleDialogUpdate = (value: boolean) => {
  emit("update:dialog", value);
};

const submitFarm = async () => {
  isSubmitting.value = true;
  try {
    await registrarStore.client!.farms.createFarm(name.value, dedicated.value, registrarStore.twinID!);
  } catch (e) {
    console.error(e);
  }
  isSubmitting.value = false;
  handleDialogUpdate(false);
};
</script>
