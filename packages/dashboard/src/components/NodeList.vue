<template>
  <v-col cols="6">
    <v-card v-if="twinID">
      <v-card-title> Node List </v-card-title>
      <v-card-text>
        <v-row class="mb-2">
          <v-col cols="3">
            <v-text-field v-model="filter.node_id" label="Node ID" density="compact" variant="outlined"></v-text-field>
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
              :disabled="!filter.node_id && !filter.farm_id && !filter.twin_id"
            >
              Clear
            </v-btn>
            <v-btn @click="applyFilters" variant="outlined" size="small"> Apply </v-btn>
          </v-col>
        </v-row>

        <v-data-table-server
          v-model:items-per-page="filter.size"
          :items-length="100"
          :items="nodes"
          @update:options="updateOptions"
          class="border-thin"
          hide-default-header
          height="500"
        >
          <template v-slot:item="{ item }">
            <v-card class="mb-2" color="grey-darken-3">
              <v-card-title class="text-subtitle-1">
                Node ID: {{ item.node_id }}
                <v-chip color="primary" variant="tonal">{{ item.location.country }}</v-chip>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">CPU: {{ convertToGB(item.resources.cru) }}GB</v-col>
                  <v-col cols="6">Memory: {{ convertToGB(item.resources.mru) }}GB</v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">SSD Disk: {{ convertToGB(item.resources.sru)}}GB</v-col>
                  <v-col cols="6">HDD Disk: {{ convertToGB(item.resources.hru) }}GB</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
    <v-alert v-else>
      Please submit your seed to view the nodes
    </v-alert>
  </v-col>
</template>

<script setup lang="ts">
import { type NodesFilter, type Node } from "@threefold/registrar_client";
import { useRegistrarStore } from "@/stores/registrar";
import { ref, computed, watch } from "vue";
import { toast } from "vue3-toastify";

const registrarStore = useRegistrarStore();

const twinID = computed(() => registrarStore.twinID);

const filter = ref<NodesFilter>({
  page: 1,
  size: 10,
});
const nodes = ref<Node[]>([]);
const headers = [
  { title: "Node ID", key: "node_id" },
  { title: "Farm ID", key: "farm_id" },
  { title: "Created", key: "created" },
  { title: "Updated", key: "updated" },
];
const clearFilters = async () => {
  filter.value = {
    page: filter.value.page,
    size: filter.value.size,
  };
  await applyFilters();
};

const applyFilters = async () => {
  try {
    nodes.value = await registrarStore.client!.nodes.listNodes(filter.value);
  } catch (e) {
    toast.error("Failed to fetch nodes");
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

const convertToGB = (sizeInBytes: number): number => {
  return parseFloat((sizeInBytes / (1024 ** 3)).toFixed(2));
};

</script>
