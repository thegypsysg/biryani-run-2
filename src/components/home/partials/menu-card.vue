<template>
  <div class="bg-white" elevation="4" style="border-radius: 10px;">
    <v-img :src="menu.img" cover aspect-ratio="1"></v-img>
    <div class="pa-2">
      <div class="d-flex justify-space-between align-center font-weight-bold text-h6 ">
        <p class="text-red-darken-2">{{ menu.title }}</p>
        <p class="text-red-lighten-3">{{ menu.price }}</p>
      </div>

      <div class="font-weight-light text-body-1">{{ menu.description }}</div>

      <hr>

      <div class="d-flex justify-start align-center ga-3">
        <v-img :src="menu.store.logo" aspect-ratio="1"
          style="width: 50px; height: 50px; max-width: 50px; max-height: 50px;"></v-img>
        <div class="font-weight-black text-h5">{{ menu.store.name }}</div>
      </div>
      <hr>
      <div class="d-flex justify-space-between align-center ga-3">
        <div class="text-caption">
          <span class="font-weight-bold text-blue-darken-3">{{ menu.purchase_count }}</span>
          Purchases | {{ menu.view_count }} Views
        </div>
        <div class="text-caption">
          <span class="font-weight-bold text-red-darken-3">{{ menu.store.distance }}</span>
          away
        </div>
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
