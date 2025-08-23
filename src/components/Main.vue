<template>
  <div
    style="
      height: 100vh;
      position: fixed;
      top: 30px;
      left: 0;
      right: 0;
      z-index: 0;
    "
  >
    <!-- Gambar background -->
    <v-img
      src="https://www.myprotein.com/images?url=https://blogscdn.thehut.net/app/uploads/sites/478/2019/03/intermittent-fasting-ft_1661177868.jpg"
      aspect-ratio="16/9"
      cover
      :class="['zoom-effect', { zoomed: isZoomed }]"
      style="height: 100%; z-index: 0; position: relative"
    ></v-img>

    <!-- Overlay abu-abu dengan opacity -->
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
      "
    ></div>

    <!-- Teks dan tombol di atas banner -->
    <v-row
      style="
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100vh;
        margin-left: 10px;
        margin-top: 70px;
      "
      class="d-flex align-center"
    >
      <div
        :data-aos="!isSmall ? 'fade-left' : 'fade-right'"
        data-aos-offset="200"
        data-aos-duration="2000"
        data-aos-easing="ease-in-sine"
      >
        <v-col
          cols="12"
          class="d-flex flex-column align-start"
          style="padding-left: 20px"
        >
          <h1 style="color: #fff; font-size: 46px; font-weight: bold">
            What's Your<br />Favourite Biryani
          </h1>

          <v-btn
            size="x-large"
            color="white"
            rounded
            elevation="0"
            class="font-weight-light mt-8 capitalize"
          >
            View Menu
          </v-btn>
        </v-col>
      </div>
    </v-row>
  </div>

  <div
    style="
      min-height: 100vh;
      position: relative;
      z-index: 2;
      background-color: #fff;
      margin-top: 100vh;
    "
  >
    <ExploreOurMenu class="d-none d-md-block" />

    <!-- <DeliveryBiryani /> -->
    <div class="mt-10">
      <template v-for="item in menuLists" :key="item.id">
        <RestaurantDish :id="item.mc_id" :menuLists="item" :fileURL="fileURL" />
      </template>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import "vue3-carousel/dist/carousel.css";
import { ref, onMounted, computed, watch } from "vue"; // Ensure these are imported
import ExploreOurMenu from "@/components/home/explore-our-menu.vue";
import DeliveryBiryani from "@/components/home/delivery-biryani.vue";
import ChickenBiryani from "@/components/home/chicken-biryani.vue";
import MuttonBiryani from "@/components/home/mutton-biryani.vue";
import VegBiryani from "@/components/home/veg-biryani.vue";
import LambBiryani from "@/components/home/lamb-biryani.vue";
import PrawnBiryani from "@/components/home/prawn-biryani.vue";
import { eventBus } from "@/util/bus";
import axios from "@/util/axios";
import AOS from "aos";
import { useStore } from "vuex";
import { appId, fileURL } from "@/util/variables";

const store = useStore();

const isZoomed = ref(false);
const listData = ref([]);
const listDataCommercial = ref([]);
const listMainCategories = ref([]);
const isLoading = ref(true);
const menuLists = ref([]);
const selectedCountry = computed(() => store.state.selectedCountry);
const latitude = computed(() => localStorage.getItem("latitude"));
const longitude = computed(() => localStorage.getItem("longitude"));
watch(selectedCountry, (newX) => {
  // console.log("country is", newX);
  getMenuList(newX.city_id);
});
function scrollToSection() {
  eventBus.scrollToSection = "happeningTarget"; // Ganti dengan ID section yang diinginkan
}

const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
};

async function getMenuList(cityId) {
  const res = await axios.get(
    `/list-main-categories-by-app-id/${appId}/${cityId}/${latitude.value}/${longitude.value}`,
  );
  menuLists.value = res.data.data.filter(
    (item) => item.onBoardDishes.length > 0,
  );
}

function get4WallsPropertyData() {
  isLoading.value = true;
  axios
    .get(`/list-4walls-property-types`)
    .then((response) => {
      const data = response.data.data;
      //   console.log(data);
      listData.value = data.sort(function (a, b) {
        return a.property_type_id - b.property_type_id;
      });
      // let itemFinal = [];
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      throw error;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function get4WallsPropertyDataCommercial() {
  isLoading.value = true;
  axios
    .get(`/list-4walls-property-types?property_category=C`)
    .then((response) => {
      listDataCommercial.value = response.data.data;
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      throw error;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

const getListMainCategories = async () => {
  isLoading.value = true;
  const response = await axios.get("/list-main-categories");
  listMainCategories.value = response.data.data;
  isLoading.value = false;
};

onMounted(() => {
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  const cards = document.querySelectorAll(".fade-in-up");
  cards.forEach((card) => {
    observer.observe(card);
  });

  AOS.init();
  setTimeout(() => {
    isZoomed.value = true;
  }, 100); // Small delay to ensure the transition starts after mount

  getMenuList();
  get4WallsPropertyData();
  getListMainCategories();
  get4WallsPropertyDataCommercial();
});
const props = defineProps({
  isSmall: {
    type: Boolean,
    default: false,
  },
});
</script>

<style>
.zoom-effect {
  transition: transform 10s ease-out;
}

.zoomed {
  transform: scale(1.1);
}

.fade-in-up {
  opacity: 0;
  transform: translateY(200px);
  transition:
    opacity 2s ease,
    transform 2s ease;
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

.featured-title {
  font-family: "DM Serif Display";
}

.featured-sub-title {
  letter-spacing: 5px;
}
</style>
