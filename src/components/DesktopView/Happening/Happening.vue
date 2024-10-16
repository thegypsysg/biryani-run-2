<template>
  <div id="trending-grid-container">

    <v-row justify="center">
      <v-col cols="12">
        <p class="text-center my-6 text-h5 text-sm-h4 text-lg-h3" style="font-family: 'DM Serif Display', system-ui;
        font-weight: 400;">
          TRENDING CATEGORIES
        </p>
      </v-col>
    </v-row>
    <!-- <div class="featured-title text-h4 text-md-h3 text-center mt-6">Our New Homes For Sale and Rent</div>
    <div class="featured-sub-title text-center text-grey-darken-1 mt-6">
      OUR PORTFOLIO INCLUDES
      HIGH-QUALITY
      VILLAS, SPACIOUS
      APARTMENTS,
      AND THOUGHTFULLY
      DESIGNED
      TOWNHOUSES.
    </div> -->

    <!-- DESKTOP VIEW -->
    <div v-if="data" class="d-none d-sm-block w-100">
      <v-row>
        <v-col cols="6" md="4" class="d-flex flex-column pa-2">
          <Grid v-if="data[0]" :title="data[0].category_name"
            :image="`${$fileURL + (data[0].main_image ?? data[0].long_image)}`" :isSquare="false" :show_text="true"
            :show_option="true" />
        </v-col>

        <v-col cols="6" md="4" class="pa-2">
          <v-row>
            <v-col>
              <Grid v-if="data[1]" :title="data[1].category_name"
                :image="`${$fileURL + (data[1].main_image ?? data[1].long_image)}`" :isSquare="true" :show_text="true"
                :show_option="true" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <Grid v-if="data[2]" :title="data[2].category_name"
                :image="`${$fileURL + (data[2].main_image ?? data[2].long_image)}`" :isSquare="true" :show_text="true"
                :show_option="true" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" md="4" class="pa-2">
          <v-row>
            <v-col>
              <Grid v-if="data[3]" :title="data[3].category_name"
                :image="`${$fileURL + (data[3].main_image ?? data[3].long_image)}`" :isSquare="true" :show_text="true"
                :show_option="true" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <Grid v-if="data[4]" :title="data[4].category_name"
                :image="`${$fileURL + (data[4].main_image ?? data[4].long_image)}`" :isSquare="true" :show_text="true"
                :show_option="true" />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-responsive aspect-ratio="3" style="width: 100%;" class="pa-0">
            <v-row style="height: 100%;">
              <v-col cols="6" md="4" style="height: 100%;" class="pa-2">
                <Grid v-if="data[5]" :title="data[5].category_name"
                  :image="`${$fileURL + (data[5].main_image ?? data[5].long_image)}`" :isSquare="false"
                  :show_text="true" :show_option="true" />
              </v-col>
              <v-col cols="6" md="8" style="height: 100%;" class="pa-2">
                <Grid v-if="data[6]" :title="data[6].category_name"
                  :image="`${$fileURL + (data[6].main_image ?? data[6].long_image)}`" :isSquare="false"
                  :show_text="true" :show_option="true" />
              </v-col>
            </v-row>
          </v-responsive>
        </v-col>

      </v-row>
    </div>

    <!-- MOBILE VIEW -->
    <v-row class="d-sm-none">
      <template v-for="(item, i) in filterTrendings" :key="i">
        <v-col cols="6">
          <Grid :title="item?.category_name" :image="`${$fileURL + (item.main_image ?? item.long_image)}`"
            :isSquare="true" :show_text="true" :show_option="true" />
        </v-col>
      </template>
    </v-row>

    <!-- FILTER LIST -->
    <div class="d-sm-none" id="trending-filter-container">
      <div id="trending-item" class="d-flex ga-2 py-3 w-100 px-2">
        <!-- <v-btn @click="show('all')" class="bg-white rounded-pill border-thin" elevation="0">View All</v-btn> -->
        <div class="flex-fill d-flex ga-2" id="scroll-trending">
          <template v-for="(item, index) in filterList" :key="index">
            <v-btn @click="handleTrendingChange(item)" class="bg-white rounded-pill border-thin" elevation="0">
              {{ item }}
            </v-btn>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, watch, onUnmounted, onBeforeUnmount } from 'vue';

import { eventBus } from "@/util/bus";
import Grid from './partials/grid.vue';

interface TrendingItem {
  category_id: number;
  active: string;
  category_name: string;
  dated: string;
  description: string;
  long_image: string;
  main_image: string | null;
  user_id: number;
}

const isSmall = computed(() => {
  return window.innerWidth < 640
});

const props = defineProps<{
  data: TrendingItem[];
}>();

const filter = ref('View All');

const filterTrendings = computed(() => {
  if (filter.value == 'View All') { return props.data; }

  return props.data.filter((t) => {
    return t.category_name === filter.value;
  });
});

const filterList = computed(() => {
  let list: string[] = [
    'View All'
  ];

  props.data.forEach((item) => {
    if (!list.includes(item.category_name)) {
      list.push(item.category_name);
    }
  });

  return list;
});

const handleTrendingChange = (title: string) => {
  filter.value = title;
  // show(title);

  const trendingGridContainer = document.getElementById('trending-grid-container');
  if (trendingGridContainer) {
    const offset = 150;
    const elementPosition = trendingGridContainer.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}
const handleDataChange = () => {
  const tcontainer = document.getElementById('trending-container');
  const titem = document.getElementById('trending-item');

  if (tcontainer && titem) {
    tcontainer.appendChild(titem);
  }
};

onMounted(() => {
  handleDataChange();
});

onBeforeUnmount(() => {
  const container = document.getElementById('trending-filter-container');
  const titem = document.getElementById('trending-item');

  if (container && titem) {
    container.appendChild(titem);
  }
});

</script>

<style scoped>
#scroll-trending {
  overflow-x: auto;
  overflow-x: auto;
  scrollbar-width: none;
  /* For Firefox */
  -ms-overflow-style: none;
}
</style>
