<template>
  <div class="cart-items flex-grow-1 overflow-y-auto w-100">
    <!-- EMPTY STATE (if no restaurant is in Cart) -->
    <v-row no-gutters v-if="!restaurantId">
      <v-col cols="12" class="px-3 py-10 d-flex flex-column align-center justify-center text-center">
        <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-store-off-outline</v-icon>
        <h3 class="text-h6 font-weight-bold text-grey-darken-2">No Restaurant Selected</h3>
        <p class="text-body-2 text-grey mt-2">
          Your cart is empty. Please add items to your cart to view the restaurant menu.
        </p>
      </v-col>
    </v-row>

    <v-row no-gutters v-else>
      <v-col cols="12" class="px-3 py-2">
        <div class="d-flex flex-column pa-3 bg-white rounded-lg" style="border: 1px solid #e0e0e0 !important">
          <div class="d-flex align-start">
            <div class="flex-grow-0 flex-shrink-0">
              <v-img
                class="rounded-circle bg-white border"
                :src="fileURL + restaurantLogo"
                width="60"
                height="60"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </div>
            <div class="ml-3 pa-0 flex-grow-1" style="min-width: 0">
              <!-- Row 1: Name + Open Now -->
              <div class="d-flex align-start justify-space-between">
                <div class="font-weight-bold text-black text-subtitle-1 text-truncate pr-2" style="font-size: 1.1rem !important; line-height: 1.2">
                  {{ restaurantName || "" }}
                </div>
                <div v-if="isRestaurant24Hrs" class="font-weight-bold text-red flex-shrink-0" style="font-size: 0.85rem; line-height: 1.2">
                  24 Hrs
                </div>
                <div v-else-if="restaurantOpenStatus === 'open'" class="font-weight-bold flex-shrink-0 text-end" style="font-size: 0.85rem; line-height: 1.2; color: #2e7d32;">
                  Open Now
                </div>
                <div v-else-if="restaurantOpenStatus === 'closed'" class="font-weight-bold text-red flex-shrink-0" style="font-size: 0.85rem; line-height: 1.2">
                  Closed Now
                </div>
              </div>

              <!-- Row 2: Town + distance -->
              <div class="mt-1 d-flex align-start justify-space-between" style="gap: 8px">
                <div class="text-grey font-weight-medium d-flex align-center" style="font-size: 0.9rem; line-height: 1.25; min-width: 0; gap: 6px;">
                  <span class="text-truncate">{{ townName || "" }}</span>
                  <span v-if="distance" class="flex-shrink-0" style="font-size: 0.75rem; line-height: 1.2">
                    <span class="text-red font-weight-bold">{{ distance }}</span>
                    <span class="text-grey"> kms away</span>
                  </span>
                </div>
                <div v-if="acceptingOrdersLabel" class="font-weight-bold flex-shrink-0 text-end" :style="{ fontSize: '0.72rem', lineHeight: '1.2', color: acceptingOrdersLabel.color || (typeof acceptingOrdersLabel === 'string' && acceptingOrdersLabel.includes('Accepting') ? '#2e7d32' : '#d32f2f'), maxWidth: '42%' }">
                  {{ acceptingOrdersLabel.text || acceptingOrdersLabel }}
                </div>
              </div>

              <!-- Row 3: Tagline | Since -->
              <div v-if="tagLine || since" class="mt-2 font-weight-bold" style="font-size: 0.72rem; line-height: 1.25">
                <span class="text-red">{{ tagLine || "" }}</span>
                <span v-if="since" class="text-grey-darken-3">
                  <span v-if="tagLine" class="mx-1">|</span>
                  Since {{ since }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons (Categories) -->
          <div class="d-flex flex-wrap align-center mt-4" style="gap: 8px">
            <template v-if="categories && categories.length">
              <div
                v-for="cat in categories.slice(0, 2)"
                :key="cat.name"
                class="rounded-pill px-3 py-1 text-caption font-weight-bold cursor-pointer"
                :class="cat.name === activeCategory ? 'bg-red-lighten-5 text-red-darken-4' : 'bg-white text-blue-darken-3'"
                :style="cat.name === activeCategory ? 'border: 1px solid #b71c1c;' : 'border: 1px solid #1565c0;'"
                @click="handleCategoryClick(cat)"
              >
                <template v-if="cat.name === activeCategory && cat.count !== undefined">
                  {{ cat.name }} ({{ cat.count }})
                </template>
                <template v-else-if="cat.name !== activeCategory && cat.count !== undefined">
                  {{ cat.name }} ({{ cat.count }})
                </template>
                <template v-else>
                  {{ cat.name }}
                </template>
              </div>

              <!-- "More" dropdown for additional categories -->
              <v-menu v-if="categories.length > 2">
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="bg-white text-black rounded-pill px-3 py-1 text-caption font-weight-bold cursor-pointer d-flex align-center"
                    style="border: 1px solid #e0e0e0"
                  >
                    {{ selectedMoreCategoryLabel }}
                    <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
                  </div>
                </template>
                <v-list class="py-0" density="compact">
                  <v-list-item
                    v-for="cat in categories.slice(2)"
                    :key="cat.name"
                    :value="cat.name"
                    @click="handleCategoryClick(cat)"
                    :active="cat.name === activeCategory"
                    active-color="red-darken-4"
                  >
                    <v-list-item-title class="text-caption font-weight-medium">
                      {{ cat.count !== undefined ? `${cat.name} (${cat.count})` : cat.name }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </div>
        </div>
      </v-col>

      <!-- Menu Items List Section -->
      <v-col cols="12">
        <div class="px-0 w-100 position-relative">
          <form class="navbar__search cart-menu-dish-search" @submit.prevent style="margin: 0 12px">
            <input v-model="menuDishSearch" type="text" placeholder="Type a Dish Name" aria-label="Search dishes" />
            <button v-if="menuDishSearch" type="button" class="cart-menu-dish-clear" aria-label="Clear search" @click="menuDishSearch = ''">
              <v-icon size="14" color="white">mdi-close</v-icon>
            </button>
            <button class="btn btn--search" type="submit">
              <v-icon color="white" size="20">mdi-magnify</v-icon>
            </button>
          </form>

          <div v-if="mode === 'customer'" class="mt-2 px-3 text-caption font-weight-bold d-flex align-center flex-wrap" style="line-height: 1.3">
            <span class="text-black">Add more Dishes and press --- &gt;</span>
            <span class="text-blue cursor-pointer ml-1" @click="$emit('return-to-cart')">Return to Cart</span>
          </div>

          <div v-if="mode === 'owner'" class="mt-3 px-3 text-caption font-weight-bold text-black d-flex align-center" style="font-size: 13px !important">
            Press <v-icon color="green" size="18" class="mx-1">mdi-pencil</v-icon> for any Price Change Request
          </div>
        </div>

        <div class="d-flex flex-column justify-space-between align-content-space-between mt-3">
          <div>
            <template v-for="{ isHeader, category, product, key } in menuDisplayRows" :key="key">
              <div v-if="isHeader" class="font-weight-bold mt-3 mb-1 px-3" style="color: #8b0000; font-size: 1.15rem; line-height: 1.2;">
                {{ category }}
              </div>
              <div v-else class="w-100 d-flex align-start justify-space-between px-3 py-2 ga-4" style="border-bottom: 1px solid #e0e0e0">
                <div class="d-flex align-start" style="width: 85%">
                  <div class="flex-grow-0 flex-shrink-0 mt-1">
                    <v-img
                      class="rounded bg-white"
                      :src="fileURL + product.dish_image"
                      width="75"
                      height="75"
                      cover
                    >
                      <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                  </div>
                  <div class="ml-3 pa-0 w-100 pt-1">
                    <span class="text-wrap font-weight-black product-name text-body-2 mb-1" style="display: block; line-height: 1.25">
                      {{ product.dish_name }}
                    </span>
                    <p class="text-blue text-caption mt-1 font-weight-bold">
                      {{ product.quantity_name }}
                    </p>

                    <div class="d-flex justify-space-between w-100 align-center mt-2">
                      <span class="text-body-2 text-red font-weight-black">
                        {{ selectedCountry?.currency_symbol || 'S$' }} {{ product.rate }}
                      </span>
                    </div>

                    <div v-if="mode === 'customer'" class="d-flex align-center flex-wrap mt-2 ga-1">
                      <div
                        v-if="product.dish_description"
                        class="d-flex align-center cursor-pointer pa-1 rounded bg-orange-lighten-5 border text-caption text-grey-darken-4 font-weight-medium cursor-pointer"
                        @click="showInformationModal(`How is it made?`, product.dish_description)"
                        style="border-color: #ffe0b2 !important; border-radius: 6px !important; font-size: 8px !important;"
                      >
                        <span>How is it made?</span>
                        <v-icon size="12" class="ml-1" color="grey-darken-3">mdi-information-outline</v-icon>
                      </div>
                      <div
                        v-if="product.pq_description"
                        class="d-flex align-center cursor-pointer pa-1 rounded bg-orange-lighten-5 border text-caption text-grey-darken-4 font-weight-medium"
                        style="border-color: #ffe0b2 !important; border-radius: 6px !important; font-size: 8px !important;"
                        @click="showInformationModal(`What's Included?`, product.pq_description)"
                      >
                        <span>What's Included?</span>
                        <v-icon size="12" class="ml-1" color="grey-darken-3">mdi-information-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>

                <div style="width: 15%" class="d-flex justify-end pt-4">
                  <template v-if="mode === 'owner'">
                    <v-icon color="green" size="22" class="cursor-pointer">mdi-pencil</v-icon>
                  </template>
                  <template v-else>
                    <v-btn
                      v-if="!isInCart(product)"
                      @click="$emit('add-to-cart', product)"
                      size="xs"
                      color="black"
                      class="text-caption py-1 px-4"
                      variant="flat"
                      >Add</v-btn
                    >
                    <span v-else class="text-red text-caption font-weight-bold">
                      In Cart
                    </span>
                  </template>
                </div>
              </div>
            </template>
            <div v-if="menuDisplayRows.length === 0" class="text-center py-6 text-grey text-caption">
              No dishes found matching "{{ menuDishSearch }}"
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>

  <v-dialog v-model="informationModal" width="auto">
    <v-card width="350">
      <v-card-title>{{ informationModalTitle }}</v-card-title>
      <v-card-text>{{ informationModalContent }}</v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="informationModal = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import axios from "@/util/axios";
import { fileURL } from "@/util/variables";

const props = defineProps({
  mode: {
    type: String,
    default: "customer", // 'customer' or 'owner'
  },
  restaurantId: {
    type: [Number, String],
    default: null,
  },
  restaurantLogo: {
    type: String,
    default: "",
  },
  restaurantName: {
    type: String,
    default: "",
  },
  townName: {
    type: String,
    default: "",
  },
  isRestaurant24Hrs: {
    type: Boolean,
    default: false,
  },
  restaurantOpenStatus: {
    type: String,
    default: "open",
  },
  distance: {
    type: [Number, String],
    default: "",
  },
  acceptingOrdersLabel: {
    type: [String, Object],
    default: "",
  },
  tagLine: {
    type: String,
    default: "",
  },
  since: {
    type: [Number, String],
    default: "",
  },
  cartItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["return-to-cart", "add-to-cart"]);
const store = useStore();
const authToken = localStorage.getItem("token");

const selectedCountry = computed(() => store.state.selectedCountry);

const restaurantDish = ref([]);
const categories = ref([{ name: "Biryani Menu" }]);
const categoryDishes = ref([]);
const activeCategory = ref("Biryani Menu");
const menuDishSearch = ref("");
const allCategoryDishesCache = ref({}); // mcId -> dishes[]
const menuItemsLoadTick = ref(0);

const informationModal = ref(false);
const informationModalTitle = ref("");
const informationModalContent = ref("");

const showInformationModal = (title, content) => {
  informationModalTitle.value = title;
  informationModalContent.value = content || "No information available.";
  informationModal.value = true;
};

const mapMenuCategoryItem = (item) => ({
  ...item,
  dish_image: item.main_image,
  pq_description: item.whats_included,
});

const getRestaurantDish = async () => {
  if (!props.restaurantId) return;
  try {
    const cityId = selectedCountry.value ? selectedCountry.value.city_id : 1;
    const response = await axios.get(
      `/list-biryani-run-items-to-add/${props.restaurantId}/${cityId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    restaurantDish.value = response.data.data || [];
  } catch (error) {
    console.error("Error fetching restaurant dish:", error);
  }
};

const getMenuCategories = async () => {
  if (!props.restaurantId) return;
  try {
    const response = await axios.get(
      `/list-menu-rate-prices-menu-categories/${props.restaurantId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    const data = response.data.data;
    allCategoryDishesCache.value = {};
    menuItemsLoadTick.value += 1;
    
    const biryaniCategory = { name: "Biryani Menu" };
    const otherCategories = [];
    
    if (data && data.length > 0) {
      data.forEach((item) => {
        if (item.menu_category && item.menu_category.menu_header) {
          const categoryName = item.menu_category.menu_header;
          if (categoryName === "Biryani Menu") {
            biryaniCategory.mcgId = item?.menu_category?.mcg_id;
          } else {
            otherCategories.push({
              name: categoryName,
              count: item.mrp_count,
              mcId: item.mc_id,
              mcgId: item?.menu_category?.mcg_id,
            });
          }
        }
      });

      otherCategories.sort((a, b) => {
        const aId = a.mcgId != null && a.mcgId !== "" ? Number(a.mcgId) : Number.MAX_SAFE_INTEGER;
        const bId = b.mcgId != null && b.mcgId !== "" ? Number(b.mcgId) : Number.MAX_SAFE_INTEGER;
        return aId - bId;
      });
    }
    categories.value = [biryaniCategory, ...otherCategories];
    ensureAllMenuItemsLoaded();
  } catch (error) {
    console.error("Error fetching menu categories:", error);
  }
};

const ensureAllMenuItemsLoaded = async () => {
  if (!props.restaurantId) return;
  
  const missing = categories.value.filter(
    (cat) => cat.mcId && !allCategoryDishesCache.value[cat.mcId]
  );
  if (!missing.length) return;

  await Promise.all(
    missing.map(async (cat) => {
      try {
        const response = await axios.get(
          `/list-menu-rate-prices-items-to-add/${props.restaurantId}/${cat.mcId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        allCategoryDishesCache.value = {
          ...allCategoryDishesCache.value,
          [cat.mcId]: (response.data.data || []).map(mapMenuCategoryItem),
        };
      } catch (error) {
        console.error(`Error fetching items for category ${cat.name}:`, error);
      }
    })
  );
  menuItemsLoadTick.value += 1;
};

const handleCategoryClick = (cat) => {
  activeCategory.value = cat.name;
  menuDishSearch.value = "";
  
  if (cat.name === "Biryani Menu") {
    categoryDishes.value = [];
  } else if (cat.mcId) {
    if (allCategoryDishesCache.value[cat.mcId]) {
      categoryDishes.value = allCategoryDishesCache.value[cat.mcId];
    }
  }
};

const selectedMoreCategoryLabel = computed(() => {
  const activeCat = categories.value.find((cat) => cat.name === activeCategory.value);
  if (!activeCat) return "More";
  const isVisible = categories.value.slice(0, 2).some((cat) => cat.name === activeCategory.value);
  if (isVisible) return "More";
  return activeCat.count !== undefined ? `${activeCat.name} (${activeCat.count})` : activeCat.name;
});

const getBiryaniMenuDishes = () => {
  if (!restaurantDish.value) return [];
  return restaurantDish.value.filter((dish) => {
    const name = (dish.dish_name || "").toLowerCase();
    return name.includes("biryani");
  });
};

const formatMenuCategoryLabel = (name) => {
  if (!name) return "";
  return String(name).replace(/\s*Menu\s*$/i, "").trim();
};

const dishMatchesSearch = (dish, query) => {
  if (!query) return true;
  return String(dish.dish_name || "").toLowerCase().includes(query) ||
         String(dish.dish_description || "").toLowerCase().includes(query);
};

// In Cart.vue, sortDishesByCart sorts dishes so that those in the cart appear first.
// For the standalone component, we can use props.cartItems to do the same.
const isInCart = (product) => {
  if (!product) return false;
  return props.cartItems.some((item) => {
    if (product?.mrp_id) {
      return item.mrp_id === product.mrp_id;
    }
    return item.brp_id === product.brp_id && !item.mrp_id;
  });
};

const sortDishesByCart = (dishes) => {
  return [...dishes].sort((a, b) => {
    const aInCart = isInCart(a);
    const bInCart = isInCart(b);
    if (aInCart && !bInCart) return -1;
    if (!aInCart && bInCart) return 1;
    return 0;
  });
};

const menuDisplayRows = computed(() => {
  menuItemsLoadTick.value; // reactive dependency
  const query = menuDishSearch.value.trim().toLowerCase();
  const rows = [];

  if (query) {
    const biryaniMatches = sortDishesByCart(
      getBiryaniMenuDishes().filter((dish) => dishMatchesSearch(dish, query))
    );
    if (biryaniMatches.length) {
      rows.push({ isHeader: true, category: "Biryani", product: null, key: "header-Biryani" });
      biryaniMatches.forEach((product, index) => {
        rows.push({ isHeader: false, category: "Biryani", product, key: `Biryani-${product.brp_id || product.mrp_id || index}` });
      });
    }

    categories.value.forEach((cat) => {
      if (!cat.mcId) return;
      const label = formatMenuCategoryLabel(cat.name) || cat.name;
      if (label.toLowerCase() === "biryani") return;

      const matches = sortDishesByCart(
        (allCategoryDishesCache.value[cat.mcId] || []).filter((dish) => dishMatchesSearch(dish, query))
      );
      if (!matches.length) return;

      rows.push({ isHeader: true, category: label, product: null, key: `header-${cat.mcId}` });
      matches.forEach((product, index) => {
        rows.push({ isHeader: false, category: label, product, key: `${cat.mcId}-${product.brp_id || product.mrp_id || index}` });
      });
    });
  } else {
    // Browse mode
    if (activeCategory.value === "Biryani Menu") {
      const dishes = sortDishesByCart(getBiryaniMenuDishes());
      dishes.forEach((product, index) => {
        rows.push({ isHeader: false, category: "Biryani Menu", product, key: `Browse-Biryani-${product.brp_id || product.mrp_id || index}` });
      });
    } else {
      const activeCat = categories.value.find((c) => c.name === activeCategory.value);
      if (activeCat && activeCat.mcId) {
        const dishes = sortDishesByCart(allCategoryDishesCache.value[activeCat.mcId] || []);
        dishes.forEach((product, index) => {
          rows.push({ isHeader: false, category: activeCat.name, product, key: `Browse-${activeCat.mcId}-${product.brp_id || product.mrp_id || index}` });
        });
      }
    }
  }

  return rows;
});

watch(() => props.restaurantId, (newId) => {
  if (newId) {
    getRestaurantDish();
    getMenuCategories();
  } else {
    restaurantDish.value = [];
    categories.value = [{ name: "Biryani Menu" }];
    allCategoryDishesCache.value = {};
    categoryDishes.value = [];
    menuDishSearch.value = "";
  }
}, { immediate: true });

onMounted(() => {
  if (props.restaurantId) {
    getRestaurantDish();
    getMenuCategories();
  }
});
</script>

<style scoped>
.cart-menu-dish-search {
  position: relative;
  display: flex;
  margin-bottom: 0px !important;
  width: 100%;
}
.cart-menu-dish-search input {
  flex-grow: 1;
  padding: 8px 36px 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  outline: none;
}
.cart-menu-dish-search input:focus {
  border-color: #f63f17;
}
.btn--search {
  background-color: #e91e63;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-menu-dish-clear {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: #ccc;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}
</style>
