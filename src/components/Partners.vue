<template>
  <v-container class="mb-14 mt-md-10 mt-sm-2 wrapper-box">
    <v-row>
      <v-col cols="12">
        <div>
          <p class="text-center" :class="isSmall ? 'text-caption' : undefined">
            <span class="mdi mdi-office-building-outline"></span> EXCLUSIVE
            LOCATIONS
          </p>
          <p align="center" class="header-title mt-4" :class="isSmall ? 'cust-title-2' : 'cust-title-1'">
            Become Our Partner
          </p>
          <!-- <p class="text-center text-grey-darken-1 mx-16 mt-n4" :class="isSmall ? 'text-caption' : undefined" :style="{
            letterSpacing: isSmall ? '2px' : '4px',
            lineHeight: isSmall ? '20px' : '30px',
          }">
            EXPLORE DIVERSE NEIGHBORHOODS, EACH OFFERING UNIQUE AMENITIES AND
            LIFESTYLE OPPORTUNITIES.
          </p> -->
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" md="4" cols="12">
        <v-lazy :options="{ threshold: 0.5 }" min-height="200">
          <v-card class="partners_box" elevation="0">
            <div class="w-100 d-flex justify-center mb-8 mt-8">
              <v-img height="40" width="40" src="@/assets/images/partner-1.png">
                <template #placeholder>
                  <div class="skeleton" />
                </template>
              </v-img>
            </div>
            <v-card-title class="text-black text-center">
              Qualified Agents
            </v-card-title>
            <v-card-text class="text-center">
              Are you a Real Estate Agent. Do you want to Sell or Rent your
              clients property through us .
            </v-card-text>
            <v-card-actions align="center">
              <v-btn elevation="0" class="mx-auto bg-info" style="background: #00cdcd !important">
                Partner with us
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-lazy>
      </v-col>
      <v-col sm="12" md="4" cols="12">
        <v-lazy :options="{ threshold: 0.5 }" min-height="200">
          <v-card class="partners_box" elevation="0">
            <div class="w-100 d-flex justify-center mb-8 mt-8">
              <v-img height="40" width="40" src="@/assets/images/partner-2.png">
                <template #placeholder>
                  <div class="skeleton" />
                </template>
              </v-img>
            </div>
            <v-card-title class="text-black text-center">
              As a Property Developer
            </v-card-title>
            <v-card-text class="text-center">
              Are you developing a new project, we help you find buyers.
            </v-card-text>
            <v-card-actions align="center">
              <v-btn elevation="0" class="mx-auto bg-info" style="background: #84afdc !important">
                Enquire Now
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-lazy>
      </v-col>
      <v-col sm="12" md="4" cols="12">
        <v-lazy :options="{ threshold: 0.5 }" min-height="200">
          <v-card class="partners_box" elevation="0">
            <div class="w-100 d-flex justify-center mb-8 mt-8">
              <v-img height="40" width="40" src="@/assets/images/partner-3.png">
                <template #placeholder>
                  <div class="skeleton" />
                </template>
              </v-img>
            </div>
            <v-card-title class="text-black text-center">
              As an Owner
            </v-card-title>
            <v-card-text class="text-center">
              Do your have a property to buy or sell . We will help you find a
              reliable Tenant / Buyer.
            </v-card-text>
            <v-card-actions align="center">
              <v-btn elevation="0" class="mx-auto bg-info" style="background: #808080 !important">
                List Now
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "Partners",
  data() {
    return {
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap");

.cust-title-2 {
  font-family: "DM Serif Display", system-ui;
  font-weight: 400;
  font-size: 33px;
  line-height: 35px;
}

.cust-title-1 {
  font-family: "DM Serif Display", system-ui;
  font-weight: 400;
}

.img-cont {
  position: relative;
  overflow: hidden;
}

.img-item {
  transition: all 0.3s;
  width: 100%;
  height: auto;
  transform: scale(1);
}

.partners_box:hover .img-item {
  transform: scale(1.2);
}

.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;

  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
