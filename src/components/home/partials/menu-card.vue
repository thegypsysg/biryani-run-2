<template>
  <div class="bg-white pa-2 border ma-2" elevation="4" style="border-radius: 10px;">
    <div class="d-flex justify-space-between align-center font-weight-bold text-body  pa-2">
      <p class="text-red-darken-2">{{ menu.title }}</p>
      <p class="text-red-lighten-3">{{ menu.price }}</p>
    </div>
    <v-img :src="menu.img" cover aspect-ratio="1"></v-img>
    <div class="pa-0">
      <div class="d-flex justify-start align-center ga-3">
        <v-img :src="menu.store.logo" aspect-ratio="1"
          style="width: 35px; height: 35px; max-width: 35px; max-height: 35px;"></v-img>
        <div class="font-weight-black text-body">{{ menu.store.name }}</div>
      </div>

      <div class="font-weight-light text-body-1 text-justify">{{ menu.description }}</div>

      <hr class="my-2">
      <div class="text-caption text-left">
        <span class="font-weight-bold text-blue-darken-3">{{ menu.purchase_count }}</span>
        Purchases | {{ menu.view_count }} Views
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  menu: any
}>();

</script>

<style></style>
