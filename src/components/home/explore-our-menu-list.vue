<template>
  <div class="d-flex ga-6 overflow-x-auto flex-row scroll-menu">

      <div v-for="(menu, i) in menuLists" :key="i" class="d-flex align-center ga-4 "
        :class="{ 'b pa-4 flex-column-reverse': desktop, 'flex-column': !desktop }">
      
        <a @click="scrollToSection(menu.id)" :class="{ 'd-flex border-black pa-2 rounded-lg ': !desktop}">
          <v-avatar :size="100" v-if="desktop">
            <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
          </v-avatar>
          <v-avatar :size="40" v-if="!desktop">
            <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
          </v-avatar>
          <p :class="{ 'font-weight-bold text-body text-body-2 text-center pt-2': true, 'text-no-wrap d-flex align-center pl-2 text-caption': !desktop }">{{ menu.title }}</p>

        </a>
     
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from '@/util/axios';

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

</script>

<style></style>
