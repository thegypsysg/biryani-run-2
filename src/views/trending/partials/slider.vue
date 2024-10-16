<template>
  <div>
    <Carousel v-bind="settings" :breakpoints>
      <Slide v-for="(city, i) in cities" :key="i">
        <v-responsive class="border pa-4 ma-6">
          <div>
            <v-img
              :src="$fileURL + city.img"
              aspect-ratio="1.3"
              cover
              style="height: 100%"
            ></v-img>
            <div class="d-flex flex-column justify-center align-center">
              <div class="font-weight-bold">
                {{ city.city }}
              </div>
              <div>{{ city.properties }} properties</div>
            </div>
          </div>
        </v-responsive>
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import axios from "@/util/axios";
import { useStore } from "vuex";
import { computed, onMounted, ref, watchEffect } from "vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

const settings = ref({
  itemsToShow: 1,
  snapAlign: "center",
});

const breakpoints = ref({
  // 200px and up
  200: {
    itemsToShow: 1.5,
    snapAlign: "center",
  },
  // 640px and up
  640: {
    itemsToShow: 2,
    snapAlign: "center",
  },
  // 700px and up
  700: {
    itemsToShow: 3.5,
    snapAlign: "center",
  },
  // 1024 and up
  1024: {
    itemsToShow: 4.5,
    snapAlign: "start",
  },
  // 1280 and up
  1280: {
    itemsToShow: 5,
    snapAlign: "start",
  },
});

const store = useStore();

const cities = ref([]);

const itemSelected2Complete = computed(() => store.state.itemSelected2Complete);

watchEffect(() => {
  getCities();
});

function getCities() {
  axios
    // .get(`/towns/city/${itemSelected2}`)
    .get(
      `/towns/city/${itemSelected2Complete.value ? itemSelected2Complete.value.id : null}`,
    )
    .then((response) => {
      const data = response.data.data;
      cities.value = data.map((item) => ({
        ...item,
        img: item.town_image,
        city: item.town_name,
        properties: 2,
      }));
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      throw error;
    });
}

onMounted(() => {
  getCities();
});
</script>

<style scoped></style>
