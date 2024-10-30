<script setup>
import { useCounterStore } from '../stores/counter'

const counter = useCounterStore()

counter.count++
// with autocompletion ✨
counter.$patch({ count: counter.count + 1 })
// or using an action instead
counter.increment()
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>О нас</v-card-title>
      <v-card-text>Информация о компании.</v-card-text>
      <div>Current Count: {{ counter.count }}</div>
    </v-card>
  </v-container>
</template>


