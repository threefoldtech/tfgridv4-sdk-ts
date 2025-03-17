<template>
  <v-col cols="6">
    <v-card v-if="twinID">
      <v-card-title>Farm List</v-card-title>
      <v-card-text>
        <v-row class="mb-2">
          <v-col cols="3">
            <v-text-field
              v-model="filter.farm_name"
              label="Farm Name"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="filter.farm_id" label="Farm ID" density="compact" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="filter.twin_id" label="Twin ID" density="compact" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="3" class="d-flex align-center pb-7">
            <v-btn
              @click="clearFilters"
              variant="outlined"
              size="small"
              class="mr-2"
              :disabled="!filter.farm_name && !filter.farm_id && !filter.twin_id"
            >
              Clear
            </v-btn>
            <v-btn @click="applyFilters" variant="outlined" size="small">Apply</v-btn>
          </v-col>
        </v-row>

        <v-data-table-server
          v-model:items-per-page="filter.size"
          :items-length="100"
          :items="farms"
          @update:options="updateOptions"
          class="border-thin"
          height="500"
          hide-default-header
        >
         <template v-slot:item="{ item }">
          <v-card class="mb-2" color="grey-darken-3">
            <v-card-title class="text-subtitle-1">
            {{ item.farm_name }}
              <v-chip color="primary" variant="tonal">{{ item.dedicated ? "Dedicated" : "Non-Dedicated" }}</v-chip>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">Farm ID: {{ item.farm_id }}</v-col>
                <v-col cols="6">Stellar Address: {{ item.stellar_address }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="6">Created At: {{ formatTimestamp(item.created_at) }}</v-col>
                <v-col cols="6">Updated At: {{ formatTimestamp(item.updated_at) }}</v-col>
              </v-row>
            </v-card-text>
          </v-card>
         </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
    <v-alert v-else>
      Please submit your seed to view farms
    </v-alert>
  </v-col>
</template>

<script setup lang="ts">
import { type FarmsFilter, type Farm } from "@threefold/registrar_client";
import { useRegistrarStore } from "@/stores/registrar";
import { ref, computed, watch } from "vue";
import { toast } from "vue3-toastify";

const registrarStore = useRegistrarStore();

const twinID = computed(() => registrarStore.twinID);

const filter = ref<FarmsFilter>({ page: 1, size: 10 });
const farms = ref<Farm[]>([]);


const clearFilters = async () => {
  filter.value = {
    page: filter.value.page,
    size: filter.value.size,
  };
  await applyFilters();
};

const applyFilters = async () => {
  try {
    farms.value = await registrarStore.client!.farms.listFarms(filter.value);
  } catch (e) {
    toast.error("Failed to fetch farms");
  }
};

watch(twinID, async value => {
  if (value) {
    await applyFilters();
  }
});

const updateOptions = async (options: any) => {
  filter.value = {
    ...filter.value,
    page: options.page,
    size: options.itemsPerPage,
  };
  await applyFilters();
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toString().split("(")[0]
};
</script>

