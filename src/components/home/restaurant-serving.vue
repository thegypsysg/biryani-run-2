<template>
  <div class="restaurant-dish-container">
    <div
      class="d-flex justify-space-between px-2 px-md-16 mb-1 mb-md-4"
      :id="formatName('Restaurants Serving Biryani')"
    >
      <div
        :class="{
          'text-h5 font-weight-bold': isDesktop,
          'font-weight-bold': !isDesktop,
        }"
      >
        Restaurants Serving Biryani
      </div>
      <v-btn
        @click="isMobile ? undefined : (isBestViewed = true)"
        elevation="0"
        class="text-blue"
        >View All</v-btn
      >
    </div>
    <div class="position-relative">
      <transition-group name="card-transition" mode="out-in">
        <Splide ref="splideRef" class="px-2 px-md-16" :options="splideOptions">
          <SplideSlide v-for="item in servingLists" :key="item.restaurant_id">
            <ServingCard
              :menu="item"
              :fileURL="$fileURL"
              :isDesktop="isDesktop"
            />
          </SplideSlide>
        </Splide>
      </transition-group>
    </div>
  </div>

  <v-dialog v-model="isBestViewed" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Best Viewed on Mobile</h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="isBestViewed = false">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import { onMounted, ref, onUnmounted, computed, nextTick } from "vue";
import MenuCard from "./partials/menu-card.vue";

const props = defineProps<{
  servingLists: any;
  fileURL: string;
}>();

const formatName = (name) => name.toLowerCase().replace(/\s+/g, "");

const splideRef = ref(null);
const isDesktop = ref(true);
const isBeginning = ref(true);
const isEnd = ref(false);
const isMobile = ref(false);
const isBestViewed = ref(false);

const splideOptions = computed(() => ({
  type: "slide",
  perPage: isMobile.value ? 1.3 : 3.5,
  arrows: isMobile.value ? false : true,
  pagination: false,
  gap: isMobile.value ? "0.4rem" : "0.8rem",
  drag: true,
  snap: true,
  rewind: false,
  speed: isMobile.value ? 300 : 400,
  dragMinThreshold: 10,
  flickMaxPages: 1,
  wheelMinThreshold: 50,
  padding: { left: 0, right: 0 },
  focus: 0,
  trimSpace: true,
  updateOnMove: true,
  breakpoints: {
    640: {
      perPage: 1.5,
      gap: "1rem",
      padding: { left: 0, right: 0 },
      focus: 0,
      drag: true,
      snap: true,
      speed: 300,
    },
    960: {
      perPage: 2,
    },
    1200: {
      perPage: 3.5,
    },
  },
}));

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

function checkMobile() {
  isMobile.value = window.innerWidth <= 640;
  nextTick(() => {
    splideRef.value?.splide?.refresh();
  });
}

const handleMoved = () => {
  if (isMobile.value) {
    nextTick(() => {
      splideRef.value?.splide?.refresh();
    });
  }
};

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768;
  checkMobile();
  window.addEventListener("resize", checkMobile);
  nextTick(() => {
    const splide = splideRef.value?.splide;
    if (splide) {
      splide.on("moved mounted", handleSlideMove);
      splide.on("moved", handleMoved);
      handleSlideMove();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile); // Clean up the event listener
});
</script>

<style scoped>
.nursing-section {
  padding: 1rem 0;
}

.card-wrapper {
  margin: 0.5rem;
  overflow: hidden;
  background: white;
  transition: transform 0.2s ease;
}

.card-wrapper:hover {
  transform: translateY(-4px);
}

.card-title {
  padding: 1rem;
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

.splide-container {
  touch-action: pan-y pinch-zoom;
  -webkit-tap-highlight-color: transparent;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

@media (max-width: 640px) {
  .custom-arrow {
    display: none !important;
  }

  .splide-container {
    overflow: visible;
    cursor: grab;
    margin: 0;
    padding: 0;
  }

  .splide-container:active {
    cursor: grabbing;
  }

  .splide__track {
    overflow: visible;
    -webkit-mask-image: -webkit-radial-gradient(
      white,
      black
    ); /* Helps with flickering */
  }

  .splide__list {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .card-wrapper {
    margin: 0.25rem;
    /* width: calc(66.666% - 0.5rem); */
  }

  .v-img {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translateZ(0);
    will-change: transform;
  }
}

.arrow-hidden {
  opacity: 0.5;
  cursor: not-allowed;
}

.img-cont {
  position: relative;
  overflow: hidden;

  .cart {
    margin-top: 5px;
    opacity: 0;
    -webkit-transition: all 0.5s linear 0s;
    -moz-transition: all 0.5s linear 0s;
    -o-transition: all 0.5s linear 0s;
    transition: all 0.5s linear 0s;
    z-index: 666;
    right: 30%;
    position: absolute;
    top: 0;
  }

  .action ul li {
    float: left;
  }
  .action ul li button {
    font-size: 16px !important;
    height: 40px;
    width: 40px;
  }

  .action ul li button i {
    font-size: 16px !important;
  }
}

.img-cont:hover .cart {
  opacity: 1;
  top: 20px;
}
.cart {
  margin-top: 5px;
  -webkit-transition: all 0.2s linear 0s;
  -moz-transition: all 0.2s linear 0s;
  -o-transition: all 0.2s linear 0s;
  transition: all 0.2s linear 0s;
  z-index: 666;
  right: 0px;
}

.card-transition-enter-active,
.card-transition-leave-active {
  transition:
    transform 0.5s,
    opacity 0.3s;
}

.card-transition-enter {
  opacity: 0;
  transform: translateX(-50%);
}

.card-transition-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
