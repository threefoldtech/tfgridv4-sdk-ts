<template>
  <v-toolbar :elevation="2">
    <v-toolbar-title>
      <v-img src="../assets/image.png" contain width="140"></v-img>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="d-flex align-center justify-start">
      <v-container v-if="twinID">
        <v-btn @click="logout">Logout</v-btn>
      </v-container>
    </div>
  </v-toolbar>
</template>

<script setup lang="ts">
import { useRegistrarStore } from "@/stores/registrar";

const registrarStore = useRegistrarStore();
const twinID = registrarStore.twinID;

const logout = () => {
  registrarStore.reset();
};
</script>
