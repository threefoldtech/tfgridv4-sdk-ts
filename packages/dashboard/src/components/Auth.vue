<template>
    <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
           <v-card-title>Enter or Generate Seed</v-card-title>
           <v-form>
            <v-text-field v-model="seed" label="Seed" required type="password"></v-text-field>
            <v-btn @click="generateSeed">Generate Seed</v-btn>
            <v-btn @click="submitSeed">Submit</v-btn>
           </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import tweetnacl from 'tweetnacl'
import RegistrarClient from 'registrar-client'
import { ref } from 'vue'

const dialog = ref(true)
const seed = ref('')
const client = ref(null)

const generateSeed = () => {
    seed.value = Array.from(tweetnacl.randomBytes(32),byte => byte.toString(16).padStart(2,'0')).join('')
}

const submitSeed = () => {
    client.value = new RegistrarClient(seed.value)
    dialog.value = false
}
</script>