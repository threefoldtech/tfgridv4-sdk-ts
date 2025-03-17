<template>
  <v-app>
    <Navbar />
    <v-main>
      <v-container fluid class="h-screen overflow-hidden">
        <v-row justify="center">
          <FarmList />
          <NodeList />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts"></script>
