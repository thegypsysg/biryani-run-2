<template>
  <div>
    <!-- <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="#fa2964" indeterminate />
    </div> -->
    <!-- <div v-if="!isLoading"> -->
    <div>
      <div style="z-index: 100000" class="position-fixed w-100">
        <div
          class="app-bar w-100 bg-transparent position-absolute d-flex justify-space-between align-center px-2"
          style="height: 50px; top: 0"
        >
          <v-btn
            variant="flat"
            color="black"
            class="card-btn"
            style="opacity: 0.8"
            width="35"
            height="35"
            icon="mdi-chevron-left"
            @click="goBack()"
          >
            <v-icon color="white" size="20"> mdi-chevron-left </v-icon>
          </v-btn>
          <!-- v-if="userName != 'null'" -->
          <div class="d-flex align-center" style="gap: 15px">
            <v-btn
              variant="flat"
              color="black"
              class="card-btn"
              style="opacity: 0.8; z-index: 1000"
              width="35"
              height="35"
              icon="mdi-thumb-up-outline"
              @click="updateLikes()"
            >
              <v-icon
                :color="categoryData?.likes >= 1 ? 'blue' : 'white'"
                size="20"
              >
                mdi-thumb-up-outline
              </v-icon>
            </v-btn>
            <v-btn
              variant="flat"
              color="black"
              class="card-btn"
              style="opacity: 0.8; z-index: 1000"
              width="35"
              height="35"
              icon="mdi-share-outline"
            >
              <v-icon color="white" size="20"> mdi-share-outline </v-icon>
            </v-btn>
            <v-btn
              variant="flat"
              :color="isFavorite ? 'white' : 'black'"
              class="card-btn"
              style="opacity: 0.8; z-index: 1000"
              width="35"
              height="35"
              icon="mdi-heart-outline"
              @click="updateFavorite()"
            >
              <v-icon :color="isFavorite ? 'black' : 'white'" size="20">
                mdi-heart-outline
              </v-icon>
            </v-btn>
          </div>
        </div>

        <img
          :src="
            categoryData?.biryaniRunPrice?.dish_image
              ? $fileURL + categoryData?.biryaniRunPrice?.dish_image
              : categoryData?.main_image
                ? $fileURL + categoryData?.main_image
                : ''
          "
          alt="redeem image"
          transition="fade-transition"
          class="main-image"
        />

        <v-container
          class="d-flex bg-white justify-space-between w-100 py-4 align-content-center mt-n2 font-weight-bold text-caption"
        >
          <div class="d-flex" style="gap: 10px">
            <p class="text-grey-darken-2">
              <span class="text-red-darken-4">
                {{ categoryData?.purchased || 0 }}
              </span>
              Have Purchased
            </p>
          </div>
          <span>|</span>
          <div class="d-flex" style="gap: 10px">
            <p>
              <span class="text-blue-lighten-1">{{
                categoryData?.biryaniRunPrice?.views || 0
              }}</span>
              Views
            </p>
          </div>
          <span>|</span>

          <div class="d-flex" style="gap: 10px">
            <v-icon color="green"> mdi-thumb-up </v-icon>
            <p>{{ categoryData?.likes || 0 }}</p>
          </div>
          <!-- <div class="d-flex" style="gap: 10px">
            <v-icon> mdi-share-outline </v-icon>
            <p class="text-green">
              {{ categoryData?.shares || 0 }}
            </p>
          </div>
          <p style="text-align: right" class="card-title-right">
            <span class="text-red">{{ categoryData?.distanceText }}</span> kms
            away
          </p> -->
        </v-container>
      </div>

      <v-container style="padding-top: 320px; padding-bottom: 100px">
        <h1 class="text-blue-lighten-1">{{ categoryData?.dish_name }}</h1>
        <!-- style="height: 100px; position: absolute; bottom: 50px; left: 0" -->
        <div class="d-flex justify-space-between align-center w-100 mt-14 ga-4">
          <div class="w-33">
            <v-img
              :src="
                $fileURL +
                categoryData?.biryaniRunPrice?.restaurant?.partner?.logo
              "
              height="100"
            />
          </div>
          <div class="w-66 d-flex align-center justify-space-between">
            <div class="d-flex flex-column ga-2 font-weight-black">
              <h4>
                {{
                  categoryData?.biryaniRunPrice?.restaurant?.partner
                    ?.partner_name || "-"
                }}
              </h4>
              <p class="text-grey-darken-1 text-caption">
                {{ categoryData?.biryaniRunPrice?.restaurant?.town || "-" }}
              </p>
              <p class="text-grey-darken-1 text-caption">
                <span class="text-red">{{
                  categoryData?.biryaniRunPrice?.restaurant?.distance
                    ? categoryData?.biryaniRunPrice?.restaurant?.distance
                    : ""
                }}</span>
                kms away
              </p>
            </div>
          </div>
        </div>
        <v-divider class="mt-14 mb-8"></v-divider>
        <div class="d-flex justify-space-between align-center">
          <h2 class="text-blue-lighten-1">
            {{ selectedCountry?.currency_symbol }}
            {{ categoryData?.biryaniRunPrice?.rate }}
          </h2>
          <!-- v-if="!isInCart(product, selectedRange)"
          @click="addToCartData(product, selectedRange)" -->
          <v-btn rounded="" color="black" class="py-2 px-12" variant="flat"
            >Add To Cart</v-btn
          >
        </div>
      </v-container>

      <div
        class="py-4 px-3 d-flex align-center justify-space-around w-100 font-weight-bold"
        style="
          background: #f3f3f3;
          gap: 20px;
          color: #5e5e5e;
          position: fixed;
          bottom: 0;
          font-size: 16px;
        "
      >
        <div class="d-flex" style="gap: 5px">
          <p><span class="text-red">12</span> Promotions |</p>
          <p><span class="text-red">2</span> Events |</p>
          <p><span class="text-red">43</span> Brands</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "@/util/axios";
import moment from "moment";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "CategoryDetail",
  data() {
    return {
      isLoading: false,
      currentDate: moment().format("DD/MM/YYYY"),
      categoryData: null,
      isFavorite: false,
    };
  },

  computed: {
    ...mapState(["itemSelectedComplete", "itemSelected2Complete"]),
    latitude() {
      return localStorage.getItem("latitude");
    },
    longitude() {
      return localStorage.getItem("longitude");
    },
    userName() {
      return localStorage.getItem("userName");
    },
    token() {
      return localStorage.getItem("token");
    },
  },

  mounted() {
    this.categoryData = JSON.parse(localStorage.getItem("categoryDetailData"));
    console.log(this.categoryData);
  },
  methods: {
    goBack() {
      window.location.href = "/";
    },
    formatDistance(distance) {
      if (distance === 0 || distance === null) {
        return "0 km";
      } else {
        //const roundedDistance = Math.round(distance * 10) / 10;
        //const formattedDistance = roundedDistance.toLocaleString('en-US', {
        //  minimumFractionDigits: 1,
        //  maximumFractionDigits: 1,
        //});
        //return `${formattedDistance} km`;

        return distance.toFixed(1) + " kms";
      }
    },
    getMonthName(monthNumber) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return monthNames[monthNumber - 1];
    },
    updateViews() {
      this.isLoading = true;
      axios
        .post(`/malls/update-views`, { mall_id: this.categoryData?.id })
        .then((response) => {
          const data = response.data.data;

          console.log("success update views", data);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    checkFavorite() {
      this.isLoading = true;
      axios
        .get(`/check-is-mall-favorite-mall/${this.categoryData?.id}`)
        .then((response) => {
          const data = response.data.data;
          this.isFavorite = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    updateLikes() {
      axios
        .post(`/malls/update-likes`, {
          mall_id: this.categoryData?.id,
          status: "like",
        })
        .then((response) => {
          const data = response.data.data;

          console.log("success update like", data);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    updateFavorite() {
      axios
        .post(`/mall-favorite-malls`, {
          mall_id: this.categoryData?.id,
        })
        .then((response) => {
          const data = response.data.data;
          this.isFavorite = true;
          console.log("success update favorite", data);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    dateComparisonStart(startDate) {
      const start = moment(startDate, "DD/MM/YYYY");
      const current = moment(this.currentDate, "DD/MM/YYYY");
      const diffDays = current.diff(start, "days");

      if (diffDays === 0) {
        return "Today";
      } else if (diffDays > 0) {
        return diffDays + " days ago";
      } else {
        return "In the future";
      }
    },
    dateComparisonEnd(endDate) {
      const end = moment(endDate, "DD/MM/YYYY");
      const current = moment(this.currentDate, "DD/MM/YYYY");
      const diffDays = end.diff(current, "days");

      if (diffDays === 0) {
        return "Today";
      } else if (diffDays > 0) {
        return diffDays + " days left";
      } else {
        return "Already passed";
      }
    },
  },
};
</script>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const selectedCountry = computed(() => store.state.selectedCountry);
</script>

<style>
.main-image {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 260px;
}

.card-tag {
  background: #e99820;
  color: #ffffff;
  position: absolute;

  padding: 5px 25px;
  font-size: 11px;

  top: 70px;
  right: 10px;
}

.logo-img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

.line-divider {
  height: 4px;
  width: 175px;
  background: #f9bc06;
  border-radius: 100%;
}

.line-divider-2 {
  height: 2px;
  width: 300px;
  background: #fa2964;
}

.card-cont {
  position: relative;
}

.card-cont:hover {
  background: white !important;
}

.card-image-cont-plat-mobile {
  position: relative;
  overflow: hidden;
  height: 200px;
  width: 100%;
}

.card-image-cont-plat-mobile:hover .card-image {
  transform: scale(1.2);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all 0.3s;
  transform: scale(1.3);
}

.skeleton {
  height: 100%;
  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
}

.skeleton-category {
  width: 280px !important;
}

.card-address-info {
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}
.card-address-info-mobile {
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
}

.card-btn-container-plat-mobile {
  position: absolute;
  gap: 10px;
  bottom: 310px;
  right: 30px;
  z-index: 100;
}

.card-btn {
  background: #fff !important;
  border: none !important;
  box-shadow: 1px rgba(0, 0, 0, 1) !important;
}

.card-image-cont-3 {
  position: relative;
  overflow: hidden;
  height: 240px;
  width: 100%;
}

.card-image-cont-3:hover .card-image {
  transform: scale(1.5);
}

.section-content h1 {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: black;
  margin: auto;
}

.featured-card {
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.43) !important;
}
.featured-card:hover {
  box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.43) !important;
}

.featured-card-img-cont {
  overflow: hidden;
  height: 180px;
}

.featured-card-img-cont-2 {
  overflow: hidden;
  height: 154px;
}

.featured-card-img-cont-3 {
  overflow: hidden;
  height: 230px;
}

.featured-card-img-cont-3-banner {
  overflow: hidden;
  height: 360px;
}

.featured-card-img-cont-promo {
  overflow: hidden;
  height: 170px;
}

.featured-card-img {
  transition: all 0.3s;
  transform: scale(1.4);
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

.featured-card:hover .featured-card-img {
  transform: scale(1.5);
}

.featured-card-img-banner {
  transition: all 0.3s;
  transform: scale(1);
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

.featured-card:hover .featured-card-img-banner {
  transform: scale(1.1);
}

.card-title-right {
  font-size: 9px;
  font-weight: 600;
}

.card-btn-container {
  position: absolute;
  gap: 20px;
}

.card-btn-container-1 {
  bottom: 100px;
  right: 30px;
}
.card-btn-container-1-malls {
  bottom: 95px;
  right: 30px;
}
.card-btn-container-2 {
  top: 142px;
  right: 30px;
}

.skeleton-discount {
  width: 35px;
}
</style>
