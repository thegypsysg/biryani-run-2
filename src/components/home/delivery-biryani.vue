<template>
    <div class="container mx-auto d-flex justify-center pt-8 text-center">
        <div>
            <div class="text-h4 text-deep-purple-darken-3">Get your Biryani</div>

            <div class="text-h6 font-weight-bold pt-4">From</div>

            <v-autocomplete
            placeholder="--Select Town--"
            class="border rounded mt-6 custom-input-height"
            
            :items="['Marine Parade']"
            ></v-autocomplete>

            <Carousel v-bind="settings" :breakpoints>
                <Slide v-for="(item, i) in 5" :key="i">
                    
                </Slide>

                <template #addons>
                    <Navigation />
                    <Pagination />
                </template>
            </Carousel>
        </div>
      
      
    </div>
</template>

<script lang="ts" setup>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';


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