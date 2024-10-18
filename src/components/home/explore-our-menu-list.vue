<template>
  <div class="d-flex ga-6">
    <div v-for="(menu, i) in menuLists" :key="i" class="d-flex align-center ga-4"
      :class="{ 'border rounded-lg elevation-6 pa-4 flex-column-reverse': desktop, 'flex-column': !desktop }">
      <p v-if="desktop" class="font-weight-bold text-body">10 Choises</p>
      <v-avatar :size="100">
        <v-img aspect-ratio="1" cover :src="menu.img"></v-img>
      </v-avatar>
      <p class="font-weight-bold text-body">{{ menu.title }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  height: string
  desktop: bool
}>();

const menuLists = [
  {
    title: 'Chicken Biryani',
    img: 'https://cosmoappliances.com/wp-content/uploads/2024/01/Chicken-Biryani.png'
  },
  {
    title: 'Mutton Biryani',
    img: 'https://myblacktree.com/cdn/shop/files/Best-Mutton-Biryani-Recipe-removebg-preview.png'
  },
  {
    title: 'Veg Biryani',
    img: 'https://slurrp.club/wp-content/uploads/2021/10/DSC_0037-2-750x541.jpg'
  },
  {
    title: 'Lamb Biryani',
    img: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/lamb-biryani-83e5c3d.jpg'
  },
  {
    title: 'Prawn Biryani',
    img: 'https://ministryofcurry.com/wp-content/uploads/2017/06/Shirmp-Biryani-2.jpg'
  },
]

</script>

<style></style>
