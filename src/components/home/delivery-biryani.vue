<template>
    <div class="container mx-auto d-flex justify-center pt-8 text-center">
        <div>
            <div class="text-h4 text-deep-purple-darken-3">Get your Biryani</div>

            <div class="text-h6 font-weight-bold pt-4">From</div>

            <v-autocomplete
            placeholder="--Select Town--"
            class="border rounded mt-6  mx-auto"
            style="width:250px;"
          
            :items="['Marine Parade']"
            ></v-autocomplete>
            
            <Carousel v-bind="settings" :breakpoints class="pt-8">
                <Slide v-for="(item, i) in 5" :key="i">
                    <div class=" d-flex border pa-2 rounded-lg ">
                
                    <v-img aspect-ratio="1" height="40" width="40" cover src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></v-img>
                 
                    <p class="text-no-wrap d-flex align-center pl-2 text-subtitle-2">
                        <div class="pr-3">Marine Parade</div>
                        
                        <div class="text-red font-weight-bold">1.21 km</div>
                    </p>

                    </div>
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