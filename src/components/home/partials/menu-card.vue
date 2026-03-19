<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useCart } from "@/composables/useCart";
import axios from "@/util/axios";
import { fileURL, appId } from "@/main";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const { isInCart, cartQuantity, addToCart, updateQuantity } = useCart();

const props = defineProps<{
  menu: any;
  fileURL: string;
  isDesktop: boolean;
}>();

const loading = ref(false);
const showDesktopDetail = ref(false);
const snackbar = ref(false);
const message = ref({
  text: "",
  color: "success",
});

const isDescriptionExpanded = ref(false);
const dummyDescription = ref(
  'Chicken Dum Biryani is a classic, aromatic dish where marinated chicken and partially cooked basmati rice are layered and slow-cooked in a sealed pot ("dum"). This traditional method ensures that the flavors are sealed in, allowing the meat to become incredibly tender while the rice absorbs the rich, fragrant spices.',
);

const truncatedDescription = computed(() => {
  const limit = 153;
  if (dummyDescription.value.length > limit) {
    return dummyDescription.value.substring(0, limit);
  }
  return dummyDescription.value;
});

const selectedCountry = computed(() => store.state.selectedCountry);
const errorAddCart = computed(() => store.state.errorAddCart);
const token = computed(() => {
  return localStorage.getItem("token");
});

const userName = computed(() => {
  return store.state.userName;
});

const addToCartData = (data) => {
  // console.log(token.value);
  if (token.value == "null") {
    store.commit("setIsNotLoggedIn", true);
  } else {
    addToCart(data);
  }
};

const goToDetail = async (menu: any) => {
  if (props.isDesktop) {
    showDesktopDetail.value = true;
  } else {
    try {
      const response = await axios.post(
        `/biryani-run-price-increment-views/${menu?.biryaniRunPrice?.brp_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        },
      );
      // getAddress();
      const data = response.data?.data;
      // console.log(data);
      const menuData = {
        ...menu,
        biryaniRunPrice: {
          ...menu.biryaniRunPrice,
          views: menu.biryaniRunPrice.views + 1,
        },
      };
      localStorage.setItem("categoryDetailData", JSON.stringify(menuData));
      router.push(`/category/${menu?.dish_id}`);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      snackbar.value = true;
      message.value = {
        text: errorMessage,
        color: "error",
      };
    }
  }
};
</script>

<template>
  <v-snackbar v-model="snackbar" :timeout="3000" :color="message.color">
    {{ message.text }}
    <template #actions>
      <v-btn icon="mdi-close-circle" @click="snackbar = false"></v-btn>
    </template>
  </v-snackbar>
  <div
    :class="{ 'bg-white': true, 'pa-3': isDesktop, 'pa-1': !isDesktop }"
    elevation="4"
    style="width: 100%"
    :style="{ height: isDesktop ? '385px' : '360px' }"
  >
    <div
      class="align-center text-start ga-3"
      :style="{ height: isDesktop ? '60px' : '60px' }"
    >
      <v-img
        :src="
          props.fileURL + props.menu?.biryaniRunPrice?.restaurant?.partner?.logo
        "
        aspect-ratio="1"
        class="float-left mr-2"
        style="width: 50px; height: 50px; max-width: 50px; max-height: 50px"
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
          </div>
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
    <div
      class="d-flex justify-space-between"
      style="
        position: absolute;
        gap: 10px;
        bottom: 120px;
        right: 30px;
        z-index: 100;
      "
    >
      <v-btn
        color="white"
        class="card-btn"
        :width="!isDesktop ? 30 : 35"
        :height="!isDesktop ? 30 : 35"
        icon="mdi-share-variant-outline"
      >
        <v-icon size="18" color="red">
          mdi-share-variant-outline
        </v-icon></v-btn
      >
      <v-btn
        color="white"
        class="card-btn"
        :width="!isDesktop ? 30 : 35"
        :height="!isDesktop ? 30 : 35"
        icon="mdi-thumb-up-outline"
      >
        <v-icon size="18" color="red"> mdi-thumb-up-outline </v-icon></v-btn
      >
      <v-btn
        class="card-btn"
        color="white"
        icon="mdi-heart-outline"
        :width="!isDesktop ? 30 : 35"
        :height="!isDesktop ? 30 : 35"
      >
        <v-icon size="18" color="red"> mdi-heart-outline </v-icon>
      </v-btn>
    </div>

    <div class="pa-2">
      <p class="font-weight-black text-subtitle-2 text-start mt-4">
        {{
          props.menu?.biryaniRunPrice?.actual_dish_name || props.menu?.dish_name
        }}
        <span class="text-blue-lighten-1 ml-2">2 Pax</span>
      </p>
      <div
        class="d-flex justify-start ga-2 w-100 align-center my-2 font-weight-bold text-caption"
      >
        <p style="text-align: right">
          <span class="text-red">{{
            props.menu?.biryaniRunPrice?.restaurant?.distance
              ? props.menu?.biryaniRunPrice?.restaurant?.distance
              : ""
          }}</span>
          kms
        </p>
        <span>|</span>
        <div class="d-flex" style="gap: 10px">
          <p>
            <span class="text-blue-lighten-1">{{
              props.menu?.biryaniRunPrice?.views || 0
            }}</span>
            Views
          </p>
        </div>
        <span>|</span>

        <div class="d-flex" style="gap: 10px">
          <v-icon color="green"> mdi-thumb-up </v-icon>
          <p>{{ props.menu?.biryaniRunPrice?.likes || 0 }}</p>
        </div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <p class="text-start font-weight-bold mt-2">
          {{ selectedCountry?.currency_symbol }}
          {{
            props.menu?.biryaniRunPrice?.rate
              ? parseFloat(props.menu?.biryaniRunPrice?.rate).toFixed(2)
              : ""
          }}
        </p>
        <span>
          <v-btn
            v-if="!isInCart(props.menu)"
            @click="addToCartData(props.menu)"
            size="xs"
            color="black"
            class="text-caption py-1 px-8"
            variant="flat"
            >Add</v-btn
          >
          <div v-else="isInCart(props.menu)" class="d-flex align-center ga-2">
            <v-btn
              size="xs"
              color="black"
              class="text-caption pa-1 rounded-0"
              variant="flat"
              icon
              @click="updateQuantity(props.menu, 'decrease')"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>

            <span>
              {{ cartQuantity(props.menu) }}
            </span>

            <v-btn
              size="xs"
              color="black"
              class="text-caption pa-1 rounded-0"
              variant="flat"
              icon
              @click="updateQuantity(props.menu, 'increase')"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
        </span>
      </div>
    </div>
  </div>
  <v-dialog v-model="errorAddCart" max-width="400">
    <v-card>
      <v-card-text>
        Cannot add other restaurants at this time , we are still working on a
        multi-restaurant order system - Should we delete the existing restaurant
        items ?
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" text @click="store.dispatch('clearCart')"
          >Yes</v-btn
        >
        <v-btn
          color="error"
          text
          @click="store.commit('setErrorAddCart', false)"
          >No</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showDesktopDetail" max-width="850">
    <v-card class="position-relative overflow-hidden" rounded="xl">
      <v-btn
        icon="mdi-close"
        size="small"
        color="grey-darken-1"
        class="position-absolute"
        style="top: 15px; right: 15px; z-index: 100; color: white"
        variant="flat"
        @click="showDesktopDetail = false"
      ></v-btn>
      <v-card-text class="pa-0 bg-white">
        <v-row no-gutters>
          <!-- Left Content -->
          <v-col cols="12" md="6" class="pa-6">
            <!-- Left Info -->
            <div class="d-flex justify-space-between align-center mb-4 pr-4">
              <div class="d-flex align-center ga-3">
                <v-img
                  :src="
                    props.fileURL +
                    props.menu?.biryaniRunPrice?.restaurant?.partner?.logo
                  "
                  height="45"
                  width="45"
                  cover
                  class="rounded-circle"
                />
                <div class="d-flex flex-column font-weight-black">
                  <h4 class="text-blue-lighten-1 text-caption">
                    {{
                      props.menu?.biryaniRunPrice?.restaurant?.partner
                        ?.partner_name || "-"
                    }}
                  </h4>
                  <p
                    class="text-grey-darken-1 font-weight-bold"
                    style="font-size: 10px"
                  >
                    {{ props.menu?.biryaniRunPrice?.restaurant?.town || "-" }}
                  </p>
                  <p class="font-weight-bold" style="font-size: 10px">
                    <span class="text-red">{{
                      props.menu?.biryaniRunPrice?.restaurant?.distance || ""
                    }}</span>
                    kms away
                  </p>
                </div>
              </div>
              <div class="d-flex align-center ga-2">
                <v-icon size="24">
                  <v-img
                    src="@/assets/images/icons/google.png"
                    alt="Google Logo"
                  />
                </v-icon>
                <div class="d-flex flex-column justify-center align-center">
                  <div class="d-flex align-center">
                    <v-icon color="#F6B702" size="12"> mdi-star </v-icon>
                    <v-icon color="#F6B702" size="12"> mdi-star </v-icon>
                    <v-icon color="#F6B702" size="12"> mdi-star </v-icon>
                    <v-icon color="#F6B702" size="12"> mdi-star </v-icon>
                    <v-icon color="#F6B702" size="12">
                      mdi-star-outline
                    </v-icon>
                  </div>
                  <span class="font-weight-bold" style="font-size: 10px">
                    234
                  </span>
                </div>
              </div>
            </div>

            <!-- Main Dish Image -->
            <div class="position-relative mb-2 w-100 bg-black">
              <v-img
                :src="
                  props.menu?.biryaniRunPrice?.dish_image
                    ? props.fileURL + props.menu?.biryaniRunPrice?.dish_image
                    : props.menu?.main_image
                      ? props.fileURL + props.menu?.main_image
                      : ''
                "
                alt="dish image"
                cover
                height="220"
                class="w-100"
              ></v-img>
              <div
                class="position-absolute d-flex align-center ga-3"
                style="bottom: 15px; left: 15px"
              >
                <div
                  class="bg-success text-white font-weight-bold text-caption px-3 py-1 rounded-lg"
                >
                  <p>Veg</p>
                </div>
                <div
                  class="bg-white text-success font-weight-bold text-caption px-3 py-1 rounded-lg"
                >
                  <p>Halal</p>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div
              class="d-flex justify-space-between w-100 py-2 align-center font-weight-bold text-caption border-b pb-3"
            >
              <p class="text-grey-darken-2">
                <span class="text-red-darken-4"> 0 </span>
                Have Purchased
              </p>
              <span class="text-grey-darken-1">|</span>
              <p class="text-grey-darken-2">
                <span class="text-blue-lighten-1">{{
                  props.menu?.biryaniRunPrice?.views || 0
                }}</span>
                Views
              </p>
              <span class="text-grey-darken-1">|</span>
              <div class="d-flex align-center ga-1 text-grey-darken-2">
                <v-icon color="green" size="18"> mdi-thumb-up </v-icon>
                <span>{{ props.menu?.biryaniRunPrice?.likes || 0 }}</span>
              </div>
            </div>

            <!-- Title & Desc -->
            <h2 class="mt-3 text-h5 font-weight-black">
              {{
                props.menu?.biryaniRunPrice?.actual_dish_name ||
                props.menu?.dish_name
              }}
            </h2>

            <div
              class="my-3"
              style="font-size: 14px; color: #333; line-height: 1.5"
            >
              <p>
                {{
                  isDescriptionExpanded
                    ? dummyDescription
                    : truncatedDescription
                }}
              </p>
              <div
                v-if="dummyDescription.length > 153"
                class="mt-1 font-weight-bold"
                style="color: #4169e1; cursor: pointer"
                @click="isDescriptionExpanded = !isDescriptionExpanded"
              >
                {{ isDescriptionExpanded ? "less ...." : "more ...." }}
              </div>
            </div>
          </v-col>

          <!-- Right Content -->
          <v-col cols="12" md="6" class="pa-4">
            <div class="d-flex flex-column ga-6 mt-16 pr-6">
              <!-- Item 1: 2 Pax -->
              <div class="d-flex align-start ga-4">
                <div class="flex-grow-0 flex-shrink-0">
                  <v-img
                    class="rounded"
                    :src="
                      props.menu?.biryaniRunPrice?.dish_image
                        ? props.fileURL +
                          props.menu?.biryaniRunPrice?.dish_image
                        : props.fileURL + props.menu?.main_image
                    "
                    width="70"
                    height="70"
                    cover
                  ></v-img>
                </div>
                <div class="flex-grow-1 pt-1">
                  <div class="font-weight-black text-body-1 mb-3">
                    <span class="text-blue-darken-3">2 Pax</span>
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-btn
                        v-if="!isInCart(props.menu)"
                        @click="addToCartData(props.menu)"
                        color="black"
                        class="text-caption px-6 text-none font-weight-bold rounded-lg"
                        height="30"
                        variant="flat"
                        >Add</v-btn
                      >
                      <div
                        v-else
                        class="d-flex align-center bg-black rounded"
                        style="height: 30px"
                      >
                        <v-btn
                          size="small"
                          color="black"
                          class="rounded-s px-1"
                          variant="flat"
                          height="30"
                          min-width="30"
                          @click="updateQuantity(props.menu, 'decrease')"
                        >
                          <v-icon size="16">mdi-minus</v-icon>
                        </v-btn>
                        <span
                          class="px-3 bg-white text-black font-weight-bold d-flex align-center justify-center"
                          style="height: 30px; min-width: 30px"
                        >
                          {{ cartQuantity(props.menu) }}
                        </span>
                        <v-btn
                          size="small"
                          color="black"
                          class="rounded-e px-1"
                          variant="flat"
                          height="30"
                          min-width="30"
                          @click="updateQuantity(props.menu, 'increase')"
                        >
                          <v-icon size="16">mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </div>
                    <div class="text-body-2 font-weight-black">
                      {{ selectedCountry?.currency_symbol || "S$" }}
                      {{
                        parseFloat(
                          props.menu?.biryaniRunPrice?.rate || 0,
                        ).toFixed(2)
                      }}
                    </div>
                    <div class="text-body-2 font-weight-black text-red">
                      {{ selectedCountry?.currency_symbol || "S$" }}
                      {{
                        isInCart(props.menu)
                          ? (
                              parseFloat(
                                props.menu?.biryaniRunPrice?.rate || 0,
                              ) * cartQuantity(props.menu)
                            ).toFixed(2)
                          : parseFloat(
                              props.menu?.biryaniRunPrice?.rate || 0,
                            ).toFixed(2)
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Item 2: Tray Biryani (Dummy/Static UI for demonstration based on screenshot) -->
              <div class="d-flex align-start ga-4">
                <div class="flex-grow-0 flex-shrink-0">
                  <v-img
                    class="rounded"
                    :src="
                      props.menu?.biryaniRunPrice?.dish_image
                        ? props.fileURL +
                          props.menu?.biryaniRunPrice?.dish_image
                        : props.fileURL + props.menu?.main_image
                    "
                    width="70"
                    height="70"
                    cover
                  ></v-img>
                </div>
                <div class="flex-grow-1 pt-1">
                  <div class="font-weight-black text-body-1 mb-3">
                    <span class="text-blue-darken-3"
                      >Tray Biryani (6 to 7 Pax)</span
                    >
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-btn
                        color="black"
                        class="text-caption px-6 text-none font-weight-bold rounded-lg"
                        height="30"
                        variant="flat"
                        >Add</v-btn
                      >
                    </div>
                    <div class="text-body-2 font-weight-black">
                      {{ selectedCountry?.currency_symbol || "S$" }} 80.00
                    </div>
                    <div class="text-body-2 font-weight-black text-red">
                      {{ selectedCountry?.currency_symbol || "S$" }} 80.00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

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

.card-btn {
  background: #fff !important;
  border: none !important;
  box-shadow: 1px rgba(0, 0, 0, 1) !important;
}
</style>
