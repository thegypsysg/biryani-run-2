<template>
  <!-- Desktop Header -->
  <div
    class="d-none d-md-flex justify-space-between align-center py-4 px-10 border-b"
    style="min-height: 90px"
  >
    <!-- <div class="drawer-logo" v-if="logo">
      <v-img height="35" width="80" :src="$fileURL + logo" />
    </div> -->
    <div class="d-flex align-center ga-4">
      <Logo />
      <div class="text-h5 font-weight-bold">Marcs Boulevard</div>
    </div>

    <div
      v-if="!isSignin"
      style="height: 48px; width: 48px; border-radius: 50%; cursor: pointer"
      icon
      class="mr-4"
      @click="drawer = !drawer"
    >
      <v-img
        v-if="userImage != null"
        :src="userImage"
        cover
        style="height: 100%; width: 100%; border-radius: 50%"
      >
        <template #placeholder>
          <div class="skeleton" />
        </template>
      </v-img>
      <img
        v-else-if="userImage == null && !isLoading"
        src="@/assets/images/icons/user_icon.png"
        cover
        height="48"
        style="height: 100%; width: 100%"
      />
    </div>
  </div>

  <div
    id="studio-container"
    style="
      min-height: 100vh;
      position: relative;
      z-index: 2;
      background-color: #f7f8f9;
      overflow-x: hidden;
    "
  >
    <!-- Desktop -->
    <v-container style="height: 70vh" class="pa-0 d-none d-md-block">
      <v-img
        src="https://demo03.houzez.co/wp-content/uploads/2016/03/200-1170x877.jpg"
        cover
        style="height: 100%"
        aspect-ratio="1.1"
      >
      </v-img>
    </v-container>

    <!-- MOBILE -->
    <v-container class="d-md-none pa-0" style="position: relative">
      <v-row style="height: 34vh">
        <v-col cols="12" class="d-flex flex-column">
          <Grid
            title="Image"
            image="https://demo03.houzez.co/wp-content/uploads/2016/03/200-1170x877.jpg"
            :isSquare="false"
          />
          <v-badge
            content="UNDER CONSTRUCTION"
            inline
            color="blue-darken-4"
            rounded="0"
            class="text-body-1 font-weight-bold position-absolute"
            style="top: 30px; left: 20px"
          ></v-badge>
        </v-col>
      </v-row>

      <v-container>
        <div class="text-body-1 font-weight-black">
          The Perfect Place To Live Your Dreams
        </div>
        <div class="text-h4 font-weight-bold mt-8">Marcs Boulevard</div>
        <div class="text-body-2 font-weight-black text-red-darken-4 my-4">
          By
        </div>
        <div class="d-flex ga-2 align-center justify-start">
          <img
            src="https://admin1.the-gypsy.sg/img/app/0cdb3194563203e1a3c29f845ca96c8d.jpg"
            style="height: 30px"
          />
          <div class="font-weight-bold text-body-1">
            PT Perintis Triniti Properti (Triniti Land)
          </div>
        </div>

        <div class="d-flex justify-space-between mt-6">
          <div class="d-flex ga-2">
            <v-btn
              rounded="0"
              size="small"
              icon="mdi-newspaper-variant-outline"
            ></v-btn>
            <v-btn rounded="0" size="small" icon="mdi-map-legend"></v-btn>
            <v-btn
              rounded="0"
              size="small"
              icon="mdi-map-marker-radius-outline"
            ></v-btn>
          </div>
          <div class="d-flex ga-2">
            <v-btn rounded="0" size="small" icon="mdi-heart-outline"></v-btn>
            <v-btn
              rounded="0"
              size="small"
              icon="mdi-share-variant-outline"
            ></v-btn>
          </div>
        </div>
      </v-container>
    </v-container>

    <About />
    <!-- <Description class="mt-6 d-md-none d-block" /> -->
    <Overview class="mt-6 d-md-none d-block" />
    <Detail class="mt-6" />
    <Item class="mt-6" />
    <Video class="mt-6" />
    <Contact class="mt-6 d-none d-md-block" />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Logo from "@/components/mainLogo.vue";
import Grid from "@/components/DesktopView/Happening/partials/grid.vue";
import Overview from "./partials/overview.vue";
import Video from "./partials/video.vue";
import Contact from "./partials/contact.vue";
import Detail from "./partials/detail.vue";
import Item from "./partials/item.vue";
import About from "./partials/about.vue";
</script>
