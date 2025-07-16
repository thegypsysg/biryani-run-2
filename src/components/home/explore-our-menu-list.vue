<template>
  <!-- <div v-if="!desktop" class="d-flex ga-6 overflow-x-auto flex-row scroll-menu">
    <div
      v-for="(menu, i) in menuLists"
      :key="i"
      class="d-flex align-center ga-4 flex-column"
    >
      <a @click="" class="d-flex border-black pa-2 rounded-lg">
        <v-avatar :size="40">
          <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
        </v-avatar>
        <p class="text-no-wrap d-flex align-center pl-2 text-caption">
          {{ menu.title }}
        </p>
      </a>
    </div>
  </div>
  <div v-if="desktop">
    <v-container>
      <Carousel v-bind="settings" :breakpoints>
        <Slide v-for="(menu, i) in menuLists" :key="i">
          <a @click="">
            <v-avatar :size="100" v-if="desktop">
              <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
            </v-avatar>

            <p
              class="font-weight-bold text-caption text-center pt-2 no-text-wrap"
            >
              {{ menu.title }}
            </p>
          </a>
        </Slide>

        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </v-container>
  </div> -->

  <div v-if="!desktop" class="d-flex ga-6 overflow-x-auto flex-row scroll-menu">
    <div
      v-for="(menu, i) in menuLists"
      :key="i"
      class="d-flex align-center ga-4 flex-column"
      @click="scrollToSection(formatName(menu.title), true)"
    >
      <div class="d-flex border-black pa-2 rounded-lg">
        <v-avatar :size="40">
          <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
        </v-avatar>
        <div class="ml-2">
          <p class="text-no-wrap d-flex align-center text-caption">
            {{ menu.title }}
          </p>
          <div
            class="text-no-wrap d-flex align-center font-weight-bold text-caption"
          >
            <span class="text-red-darken-1"> 2 </span>
            &nbsp;
            <span> Restaurants</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="desktop" class="explore-section d-none d-md-block">
    <!-- <v-container> -->
    <div class="position-relative pt-14">
      <!-- <v-btn
        v-if="!isBeginning"
        icon
        class="custom-arrow prev-arrow"
        @click="goPrev"
      >
        <span class="arrow-icon">←</span>
      </v-btn> -->

      <Splide class="px-16" ref="splideRef" :options="splideOptions">
        <SplideSlide v-for="(menu, i) in menuLists" :key="i">
          <v-card
            @click="scrollToSection(formatName(menu.title), false)"
            class="card-wrapper"
            elevation="3"
          >
            <v-avatar :size="100" v-if="desktop">
              <v-img aspect-ratio="1" cover :src="$fileURL + menu.img"></v-img>
            </v-avatar>

            <div
              style="height: 70px"
              class="d-flex justify-space-between flex-column"
            >
              <p class="font-weight-bold text-caption text-center pt-2">
                {{ menu.title }}
              </p>
              <div
                class="text-no-wrap d-flex align-center font-weight-bold text-caption"
              >
                <span class="text-red-darken-1"> 2 </span>
                &nbsp;
                <span> Restaurants</span>
              </div>
            </div>
          </v-card>
        </SplideSlide>
      </Splide>

      <!-- <v-btn v-if="!isEnd" icon class="custom-arrow next-arrow" @click="goNext">
        <span class="arrow-icon">→</span>
      </v-btn> -->
    </div>
    <!-- </v-container> -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, nextTick, ref } from "vue";
import axios from "@/util/axios";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
// import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

defineProps<{
  // height: string
  desktop: boolean;
}>();

const splideOptions = {
  perPage: 7,
  arrows: true,
  pagination: false,
  gap: "2rem",
  breakpoints: {
    640: {
      perPage: 4,
    },
    960: {
      perPage: 7,
    },
    1200: {
      perPage: 10,
    },
  },
};

const splideRef = ref(null);
const isBeginning = ref(true);
const isEnd = ref(false);

const menuLists = ref([]);

const goNext = () => {
  splideRef.value?.splide?.go("+1");
};

const goPrev = () => {
  splideRef.value?.splide?.go("-1");
};

const handleSlideMove = () => {
  const splide = splideRef.value?.splide;
  if (splide) {
    isBeginning.value = splide.index === 0;
    isEnd.value = splide.index >= splide.length - splide.options.perPage;
  }
};

function scrollToSection(sectionId, mobile) {
  const cardSection = document.getElementById(sectionId);

  // this.$nextTick(() => {
  if (cardSection) {
    const cardRect = cardSection.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = mobile
      ? cardRect.top + scrollTop - 220
      : cardRect.top + scrollTop - 100; // Nilai offset yang diinginkan, dalam piksel

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }
  // });
  // window.scrollBy(0, -scrollOffset);
}

const formatName = (name) => name.toLowerCase().replace(/\s+/g, "");

async function getMenuList() {
  const res = await axios.get("/list-biryani-main-categories");
  menuLists.value = res.data.data.map((item: any) => ({
    title: item.category_name,
    img: item.main_image,
    id: item.category_name,
  }));
  console.log(menuLists.value);
}

// const settings: breakpoints = {
//   itemsToShow: 6,
//   snapAlign: 'center',
// };

// const breakpoints = {

//   960: {
//     itemsToShow: 6,
//     snapAlign: 'center',
//   },
// };
onMounted(() => {
  nextTick(() => {
    const splide = splideRef.value?.splide;
    if (splide) {
      splide.on("moved mounted", handleSlideMove);
      handleSlideMove();
    }
  });
  getMenuList();
});
</script>

<style scoped>
.card-wrapper {
  margin: 0.5rem;
  overflow: hidden;
  background: transparent;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none !important;
}

.card-wrapper:hover {
  transform: translateY(-4px);
}

.card-title {
  padding: 1rem;
  text-align: center;
  font-weight: 500;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.prev-arrow {
  left: -20px;
}

.next-arrow {
  right: -20px;
}

.arrow-icon {
  font-size: 24px;
  line-height: 1;
}

.scroll-cont::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scroll-cont {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
