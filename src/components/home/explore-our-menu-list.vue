<template>
  <div  v-if="!desktop" class="d-flex ga-6 overflow-x-auto flex-row scroll-menu">

      <!-- <div v-for="(menu, i) in menuLists" :key="i" class="d-flex align-center ga-4 "
        :class="{ 'pr-4 flex-column-reverse': desktop, 'flex-column': !desktop }">
      
        <a @click="scrollToSection(menu.id)" :class="{ 'd-flex border-black pa-2 rounded-lg ': !desktop}">
          <v-avatar :size="100" v-if="desktop">
            <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
          </v-avatar>
          <v-avatar :size="40" v-if="!desktop">
            <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
          </v-avatar>
          <p :class="{ 'font-weight-bold text-body text-body-2 text-center pt-2': true, 'text-no-wrap d-flex align-center pl-2 text-caption': !desktop }">{{ menu.title }}</p>

        </a>
     
    </div> -->

      <div v-for="(menu, i) in menuLists" :key="i" class="d-flex align-center ga-4 flex-column">
        
          <a @click="" class="d-flex border-black pa-2 rounded-lg">
            <v-avatar :size="40">
            <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
          </v-avatar>
            <p class="text-no-wrap d-flex align-center pl-2 text-caption">{{ menu.title }}</p>

          </a>
      
      </div> 
  </div>
  <div  v-if="desktop">
    <v-container>
      <Carousel v-bind="settings" :breakpoints>
        <Slide v-for="(menu, i) in menuLists" :key="i">
          <a @click="">
            <v-avatar :size="100" v-if="desktop">
              <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
            </v-avatar>
          
            <p class="font-weight-bold text-body text-body-2 text-center pt-2 no-text-wrap">{{ menu.title }}</p>

          </a>
        </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
    </v-container>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from '@/util/axios';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

defineProps<{
  // height: string
  desktop: boolean
}>();

const menuLists = ref([]);

onMounted(() => {
  getMenuList();
});

async function getMenuList() {
  const res = await axios.get('/list-biryani-main-categories');
  menuLists.value = res.data.data.map((item: any) => ({
    title: item.category_name,
    img: item.main_image,
    id: item.category_name
  }));
  console.log(menuLists.value);
}

function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

const settings: breakpoints = {
  itemsToShow: 6,
  snapAlign: 'center',
};

const breakpoints = {

  960: {
    itemsToShow: 6,
    snapAlign: 'center',
  },
};


</script>

<style></style>
