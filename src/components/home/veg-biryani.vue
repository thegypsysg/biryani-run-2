<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <div class="text-h4 font-weight-bold">Veg Biryani</div>
      <v-btn elevation="0" class="text-blue">View All</v-btn>
    </div>
    <Carousel v-bind="settings" :breakpoints>
      <Slide v-for="(n, i) in 4" :key="i">
        <MenuCard :menu />
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </v-container>
</template>

<script lang="ts" setup>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

import MenuCard from './partials/menu-card.vue'

const menu = {
  title: 'Veg Biryani',
  img: 'https://slurrp.club/wp-content/uploads/2021/10/DSC_0037-2-750x541.jpg',
  price: '$12',
  description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  purchase_count: 20,
  view_count: 300,
  store: {
    name: 'Sakuntala',
    logo: 'https://png.pngtree.com/png-clipart/20230527/original/pngtree-s-logo-icon-png-image_9171884.png',
    distance: '0.35 kms'
  }
};

const settings: breakpoints = {
  itemsToShow: 1,
  snapAlign: 'center',
};

const breakpoints = {
  // 200px and up
  200: {
    itemsToShow: 1,
    snapAlign: 'center',
  },
  // 640px and up
  640: {
    itemsToShow: 2,
    snapAlign: 'center',
  },
  // 700px and up
  960: {
    itemsToShow: 4,
    snapAlign: 'center',
  },
};

</script>

<style></style>
