<template>
  <div :class="{'bg-white':true, 'pa-3':isDesktop, 'pa-1': !isDesktop}" elevation="4" style="width: 100%; height: 300px;">
    <div class=" align-center text-start ga-3">
        <v-img :src="props.fileURL + props.menu.restaurant?.partner?.logo" aspect-ratio="1" class="float-left mr-2"
          style="width: 35px; height: 35px; max-width: 35px; max-height: 35px;"></v-img>
        <div class="d-flex justify-space-between">
          <div>
            <div :class="{'font-weight-black text-no-wrap': true, 'text-subtitle-1': isDesktop, 'text-caption': !isDesktop}">{{ props.menu.restaurant?.partner ? props.menu.restaurant?.partner.partner_name : '' }}</div>
            <div class="text-blue-grey-lighten-2 text-caption">
              {{ props.menu.restaurant?.partner?.address ? props.menu.restaurant?.partner.address : 'Marine Parade' }}
              <div v-if="!isDesktop" class="text-red text-start text-caption font-weight-bold">
              0.34 kms
            </div>
            </div>
          
          </div>
       
          <div v-if="isDesktop" class="text-red d-flex justify-end text-caption font-weight-bold">
            0.34 kms
          </div>
        </div>
     
      </div>
    <v-img v-if="isDesktop" :src="props.fileURL + props.menu.main_image" cover aspect-ratio="1" height="180px"></v-img>
    <v-img v-if="!isDesktop" :src="props.fileURL + props.menu.main_image" cover aspect-ratio="1" height="160px"></v-img>
    <div class="pa-0">
    
      <div class="d-flex justify-space-between align-center pa-2">
        <p class="font-weight-black text-subtitle-2  text-start">{{ props.menu.actual_dish_name || props.menu.dish?.dish_name }}</p>
        <v-rating
          :length="5"
          v-if="isDesktop"
          :size="20"
          :model-value="4"
            density="comfortable"
          class="text-red"
          active-color="text-red"
        />
        <div class="text-red text-start"  v-if="
        !isDesktop">
          $ {{ parseFloat(props.menu.price).toFixed(2) }}
        </div>
      </div>
      <div class="text-red text-start" v-if="isDesktop">
        $ {{ parseFloat(props.menu.price).toFixed(2) }}
      </div>
      <v-rating
          :length="5"
          v-if="!isDesktop"
          :size="20"
          :model-value="4"
          class="text-red d-flex justify-start"
          active-color="text-red"
        />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps<{
  menu: [],
  fileURL: string,
  isDesktop: boolean
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
