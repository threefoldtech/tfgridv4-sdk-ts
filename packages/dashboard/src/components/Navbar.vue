<template>
  <v-app-bar :elevation="2" class="position-fixed z-index-1">
    <v-app-bar-title>
      <v-img src="../assets/logo_light.png" contain width="140"></v-img>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <div class="d-flex align-center justify-start">
      <v-container v-if="twinID">
        <v-btn @click="showFarmCreationModel = true" color="primary">Create Farm</v-btn>
        <v-btn icon @click ="showAccountModel = true" class="ml-2" size="small">
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn @click="logout" icon class="text-error ml-2" variant="tonal" size="small">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-container>
    </div>
  </v-app-bar>
  <CreateFarm :dialog="showFarmCreationModel" @update:dialog="showFarmCreationModel = $event" />
  <Account :dialog="showAccountModel" @update:dialog="showAccountModel = $event" />
</template>

<script setup lang="ts">
import { useRegistrarStore } from "@/stores/registrar";
import { computed, ref } from "vue";

const registrarStore = useRegistrarStore();
const twinID = computed(() => registrarStore.twinID);
const showFarmCreationModel = ref<boolean>(false);
const showAccountModel = ref<boolean>(false);

const logout = () => {
  registrarStore.reset();
};
</script>

<style scoped>
.z-index-1 {
  z-index: 100;
}
</style>
