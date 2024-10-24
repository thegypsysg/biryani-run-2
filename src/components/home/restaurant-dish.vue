<template>
  <v-container>
    <div class="d-flex justify-space-between" :id="menuLists.category_name">
      <div class="text-h4 font-weight-bold">{{ menuLists.category_name }}</div>
      <v-btn elevation="0" class="text-blue">View All</v-btn>
    </div>
    <Carousel v-bind="settings" :breakpoints>
      <Slide v-for="(n, i) in menuLists.biryani_restaurant_dishes" :key="i">
        <MenuCard :menu="n" :fileURL="$fileURL" />
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </v-container>
</template>

<script lang="ts" setup>
const props = defineProps<{
  menuLists: any,
  fileURL: string
}>();
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import { onMounted } from 'vue';
import MenuCard from './partials/menu-card.vue'

onMounted(() => {
  console.log(props.menuLists);
});

const menu = {
  title: 'Mutton Biryani',
  img: 'https://myblacktree.com/cdn/shop/files/Best-Mutton-Biryani-Recipe-removebg-preview.png',
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
