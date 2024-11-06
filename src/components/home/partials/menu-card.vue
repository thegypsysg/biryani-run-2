<template>
  <div class="bg-white pa-2 border ma-2" elevation="4" style="border-radius: 10px;">
    <div class="d-flex justify-start align-center ga-3">
        <v-img :src="props.fileURL + props.menu.restaurant?.partner?.logo" aspect-ratio="1"
          style="width: 35px; height: 35px; max-width: 35px; max-height: 35px;"></v-img>
        <div class="font-weight-black text-body">{{ props.menu.restaurant?.partner ? props.menu.restaurant?.partner.partner_name : '' }}</div>
      </div>
    <div class="d-flex justify-space-between align-center font-weight-bold text-body  pa-2">
      <p class="text-red-darken-2">{{ props.menu.actual_dish_name || props.menu.dish?.dish_name }}</p>
      <p class="text-red-lighten-3">{{ props.menu.price }}</p>
    </div>
    <v-img :src="props.fileURL + props.menu.main_image" cover aspect-ratio="1"></v-img>
    <div class="pa-0">
    

      <div class="font-weight-light text-body-1 text-justify">{{ props.menu.dish_description }}</div>

      <hr class="my-2">
      <div class="text-caption text-left">
        <span class="font-weight-bold text-blue-darken-3">{{ props.menu.views }}</span>
        Purchases | {{ 300}} Views
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps<{
  menu: [],
  fileURL: string
}>();

const menu = ref([]);

onMounted(() => {
  console.log(props.menu);
  menu.value = Array.isArray(props.menu) ? props.menu.map((item: any) => ({
    title: item.actual_dish_name || item.dish.dish_name,
    img: props.fileURL + item.main_image,
    price: item.price,
    description: item.description,
    purchase_count: item.purchase_count,
    view_count: item.view_count,
    store: {
      logo: props.fileURL + item.restaurant_logo,
      name: item.restaurant_name
    }
  })) : [];
});
</script>

<style></style>
