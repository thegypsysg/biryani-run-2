<template>
  <div
    :class="{ 'bg-white': true, 'pa-3': isDesktop, 'pa-1': !isDesktop }"
    elevation="4"
    style="width: 100%; height: 320px"
  >
    <div
      class="align-center text-start ga-3"
      :style="{ height: isDesktop ? '50px' : '70px' }"
    >
      <v-img
        :src="
          props.fileURL + props.menu?.biryaniRunPrice?.restaurant?.partner?.logo
        "
        aspect-ratio="1"
        class="float-left mr-2"
        style="width: 35px; height: 35px; max-width: 35px; max-height: 35px"
      ></v-img>
      <div class="d-flex justify-space-between">
        <div>
          <div
            :class="{
              'font-weight-black text-no-wrap': true,
              'text-subtitle-1': isDesktop,
              'text-caption': !isDesktop,
            }"
          >
            {{
              props.menu?.biryaniRunPrice?.restaurant?.partner
                ? props.menu?.biryaniRunPrice?.restaurant?.partner?.partner_name
                : ""
            }}
          </div>
          <div class="text-blue-grey-lighten-2 text-caption">
            {{
              props.menu?.biryaniRunPrice?.restaurant?.town
                ? props.menu?.biryaniRunPrice?.restaurant?.town
                : ""
            }}
            <div
              v-if="!isDesktop"
              class="text-red text-start text-caption font-weight-bold"
            >
              {{
                props.menu?.biryaniRunPrice?.restaurant?.distance
                  ? props.menu?.biryaniRunPrice?.restaurant?.distance
                  : ""
              }}
              kms
            </div>
          </div>
        </div>

        <div
          v-if="isDesktop"
          class="text-red d-flex justify-end align-end text-caption font-weight-bold"
        >
          {{
            props.menu?.biryaniRunPrice?.restaurant?.distance
              ? props.menu?.biryaniRunPrice?.restaurant?.distance
              : ""
          }}
          kms
        </div>
      </div>
    </div>
    <div class="trending__app card-image-cont-1">
      <div class="cart clearfix animate-effect">
        <div class="action">
          <div class="px-2 text-center">
            <!-- :to="card.isLive ? `/${card.path}` : ''"
            @click="card.isLive ? '' : openLive(card)" -->
            <v-btn
              elevation="4"
              style="
                background-color: #fa2964;
                border-radius: 50px;
                padding-left: 8px;
                padding-right: 6px;
                padding-top: 4px;
                padding-bottom: 4px;
                font-weight: 600;
                font-size: 12px;
              "
              @click="goToDetail(props.menu)"
            >
              <span class="text-white" style="">View Details</span>
              <v-icon right style="color: #fff"> mdi-chevron-right </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <div class="overlay"></div>
      <v-img
        v-if="isDesktop"
        :src="
          props.menu?.biryaniRunPrice?.dish_image
            ? props.fileURL + props.menu?.biryaniRunPrice?.dish_image
            : props.menu?.main_image
              ? props.fileURL + props.menu?.main_image
              : ''
        "
        cover
        aspect-ratio="1"
        height="180px"
      ></v-img>
      <v-img
        v-if="!isDesktop"
        :src="
          props.menu?.biryaniRunPrice?.dish_image
            ? props.fileURL + props.menu?.biryaniRunPrice?.dish_image
            : props.menu?.main_image
              ? props.fileURL + props.menu?.main_image
              : ''
        "
        cover
        aspect-ratio="1"
        height="160px"
      ></v-img>
    </div>
    <!-- <div class="card-btn-container d-flex justify-space-between">
      <v-btn
        color="white"
        class="card-btn"
        :width="!isDesktop ? 35 : 32"
        :height="!isDesktop ? 35 : 32"
        icon="mdi-share-variant-outline"
      >
        <v-icon size="20" color="red">
          mdi-share-variant-outline
        </v-icon></v-btn
      >
      <v-btn
        class="card-btn"
        color="white"
        icon="mdi-heart-outline"
        :width="!isDesktop ? 35 : 32"
        :height="!isDesktop ? 35 : 32"
      >
        <v-icon size="20" color="red"> mdi-heart-outline </v-icon>
      </v-btn>
    </div> -->
    <p
      class="font-weight-bold text-white"
      style="position: absolute; bottom: 90px; left: 30px"
    >
      {{ props.menu?.biryaniRunPrice?.views }} views
    </p>
    <div class="pa-0">
      <div class="d-flex justify-space-between align-center pa-2">
        <div class="">
          <p class="font-weight-black text-subtitle-2 text-start">
            {{
              props.menu?.biryaniRunPrice?.actual_dish_name ||
              props.menu?.dish_name
            }}
          </p>
          <div class="text-red text-start mt-2">
            $
            {{
              props.menu?.biryaniRunPrice?.rate
                ? parseFloat(props.menu?.biryaniRunPrice?.rate).toFixed(2)
                : ""
            }}
          </div>
        </div>
        <v-btn elevation="0" class="bg-black text-white mt-6 mt-md-4">
          Add
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  menu: [];
  fileURL: string;
  isDesktop: boolean;
}>();

const goToDetail = (menu: any) => {
  localStorage.setItem("categoryDetailData", JSON.stringify(menu));
  router.push(`/category/${props.menu?.dish_id}`);
};
</script>

<style>
.card-cont {
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 100;
}

.trending__app:hover .overlay {
  opacity: 1;
}
.card-image-cont-1 {
  position: relative;
  overflow: hidden;
}
.trending__app .cart {
  opacity: 0;
  -webkit-transition: all 0.5s linear 0s;
  -moz-transition: all 0.5s linear 0s;
  -o-transition: all 0.5s linear 0s;
  transition: all 0.5s linear 0s;
  width: 100%;
  z-index: 666;
  position: absolute;
  top: 0;
  left: 25%;
}
.trending__app:hover .cart {
  opacity: 1;
  top: 40%;
  transform: translateY(-40%);
}
.cart {
  margin-top: 5px;
  -webkit-transition: all 0.2s linear 0s;
  -moz-transition: all 0.2s linear 0s;
  -o-transition: all 0.2s linear 0s;
  transition: all 0.2s linear 0s;
  width: 100%;
  z-index: 666;
  left: 0px;
}

.card-btn-container {
  position: absolute;
  gap: 10px;
  bottom: 63px;
  right: 30px;
  z-index: 100;
}

.card-btn {
  background: #fff !important;
  border: none !important;
  box-shadow: 1px rgba(0, 0, 0, 1) !important;
}
</style>
