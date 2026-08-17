<template>
  <v-snackbar v-model="snackbar" :timeout="3000" :color="message.color">
    {{ message.text }}
    <template #actions>
      <v-btn icon="mdi-close-circle" @click="snackbar = false"></v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="snackbarVisible" :timeout="3000" :color="snackbarColor">
    {{ snackbarMessage }}
    <template #actions>
      <v-btn icon="mdi-close-circle" @click="snackbarVisible = false"></v-btn>
    </template>
  </v-snackbar>

  <MazDrawer
    variant="right"
    :model-value="viewCart"
    @update:model-value="emit('update:viewCart', $event)"
    class="no-header"
  >
    <template #default="{ close }">
      <div class="cart-drawer fill-height">
        <div class="flex-grow-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-sheet>
                <div
                  class="d-flex align-center justify-space-between pa-3 bg-grey-lighten-4"
                >
                  <div class="text-h5 font-weight-bold">My Cart</div>
                  <div
                    class="text-h6 font-weight-light"
                    v-show="cartQuantity > 0"
                  >
                    <span class="">{{ cartQuantity }}</span> Items
                    <span v-if="!isSmall">|</span> <br v-if="isSmall" />Subtotal
                    <span class="text-h6 font-weight-bold" v-if="subTotal">
                      {{ selectedCountry.currency_symbol }}
                      {{ finalCartTotal }}
                    </span>
                  </div>
                  <div v-if="!isRestaurant">
                    <v-btn
                      class="text-grey-lighten-1"
                      :size="isSmall ? 'small' : 'large'"
                      @click="close"
                      variant="text"
                      icon="mdi-close-circle"
                    ></v-btn>
                  </div>
                  <div v-else>
                    <v-btn
                      @click="isRestaurant = false"
                      icon="mdi-arrow-left"
                    ></v-btn>
                  </div>
                </div>
              </v-sheet>
            </v-col>
          </v-row>
        </div>

        <template v-if="!isRestaurant">
          <div
            class="cart-items flex-grow-1"
            style="min-height: 0; overflow-y: auto"
          >
            <v-row no-gutters>
              <v-col v-if="step == 1" class="pb-4 px-2 bg-grey-lighten-4">
                <div style="min-height: 75vh">
                  <!-- 1. Restaurant Info & Action Buttons Card -->
                  <div
                    class="d-flex flex-column pa-3 my-3 bg-white rounded-lg"
                    style="border: 1px solid #e0e0e0 !important"
                  >
                    <!-- Restaurant Info (Logo, Name, Town, Distance, Tagline, 24 Hrs) -->
                    <div class="d-flex align-start mb-3">
                      <div class="flex-grow-0 flex-shrink-0">
                        <v-img
                          class="rounded-circle bg-white border"
                          :src="fileURL + cart[0]?.restaurant_logo"
                          width="60"
                          height="60"
                        >
                          <template v-slot:placeholder>
                            <div
                              class="d-flex align-center justify-center fill-height"
                            >
                              <v-progress-circular
                                color="grey-lighten-4"
                                indeterminate
                              ></v-progress-circular>
                            </div>
                          </template>
                        </v-img>
                      </div>
                      <div class="ml-3 pa-0 flex-grow-1" style="min-width: 0">
                        <div class="d-flex align-start justify-space-between">
                          <div
                            class="font-weight-bold text-black text-subtitle-1 text-truncate pr-2"
                            style="font-size: 1.1rem !important; line-height: 1.2"
                          >
                            {{ cart[0]?.restaurant_name || "" }}
                          </div>
                          <div
                            v-if="isRestaurant24Hrs"
                            class="font-weight-bold text-red flex-shrink-0"
                            style="font-size: 0.85rem; line-height: 1.2"
                          >
                            24 Hrs
                          </div>
                        </div>
                        <div
                          class="text-grey font-weight-medium text-subtitle-2 mt-1 d-flex align-center"
                          style="line-height: 1.2; gap: 6px"
                        >
                          <span class="flex-grow-1" style="min-width: 0">{{
                            cart[0]?.town_name || ""
                          }}</span>
                          <span
                            v-if="cart[0]?.distance"
                            class="flex-shrink-0 text-center"
                            style="font-size: 0.75rem; line-height: 1.2"
                          >
                            <span class="text-red font-weight-bold">{{
                              cart[0].distance
                            }}</span>
                            <span class="text-grey"> kms away</span>
                          </span>
                          <span class="flex-grow-1"></span>
                        </div>
                        <div
                          v-if="cart[0]?.tag_line || cart[0]?.since"
                          class="mt-3"
                          style="font-size: 0.72rem; line-height: 1.25"
                        >
                          <span
                            v-if="cart[0]?.tag_line"
                            class="font-weight-medium"
                            style="color: #2e7d32"
                            >{{ cart[0].tag_line }}</span
                          >
                          <span
                            v-if="cart[0]?.tag_line && cart[0]?.since"
                            class="text-black"
                          >
                            |
                          </span>
                          <span v-if="cart[0]?.since" class="text-black">
                            Since
                            <span
                              class="font-weight-bold"
                              style="color: #7b1fa2"
                              >{{ cart[0].since }}</span
                            >
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="d-flex flex-wrap align-center" style="gap: 8px">
                      <div
                        class="bg-blue-lighten-5 text-blue-darken-3 rounded-pill px-3 py-1 text-caption font-weight-bold cursor-pointer"
                        @click="isRestaurant = true"
                      >
                        Restaurant Menu
                      </div>
                      <div
                        class="bg-red-lighten-5 text-black rounded-pill px-3 py-1 text-caption font-weight-bold cursor-pointer"
                        @click="handleClearCart"
                      >
                        Clear Cart
                      </div>
                    </div>

                    <!-- Promotion (max 2 lines + more) -->
                    <div
                      v-if="restaurantPromoMessage"
                      class="mt-3"
                      style="position: relative"
                    >
                      <div
                        ref="promoMessageRef"
                        class="text-caption font-weight-medium"
                        :class="{ 'promo-message-clamped': !promoExpanded }"
                        :style="{
                          color: '#0288d1',
                          whiteSpace: 'pre-line',
                          paddingRight:
                            showPromoMore && !promoExpanded ? '40px' : '0',
                        }"
                      >
                        {{ restaurantPromoMessage }}
                      </div>
                      <span
                        v-if="showPromoMore && !promoExpanded"
                        class="text-red font-weight-bold text-caption cursor-pointer"
                        style="
                          position: absolute;
                          right: 0;
                          bottom: 0;
                          background: #fff;
                          padding-left: 4px;
                        "
                        @click="promoExpanded = true"
                      >
                        more
                      </span>
                      <span
                        v-if="promoExpanded && showPromoMore"
                        class="text-red font-weight-bold text-caption cursor-pointer d-inline-block mt-1"
                        @click="promoExpanded = false"
                      >
                        less
                      </span>
                    </div>
                  </div>

                  <!-- 2. Pick-Up & Delivery Toggle Buttons -->
                  <!-- <div class="d-flex my-3" style="gap: 12px">
                    <div
                      @click="deliveryType = 'pickup'"
                      class="flex-1-1-0 d-flex align-center justify-center py-2 px-4 border rounded-lg cursor-pointer transition-all"
                      :style="
                        deliveryType === 'pickup'
                          ? {
                              border: '1.5px solid #a03022 !important',
                              backgroundColor: '#fbebe9',
                            }
                          : {
                              border: '1px solid #e0e0e0 !important',
                              backgroundColor: '#ffffff',
                            }
                      "
                    >
                      <v-img
                        :src="pickup"
                        width="24"
                        height="24"
                        class="mr-2 flex-grow-0"
                        contain
                      />
                      <span
                        class="font-weight-bold text-subtitle-2"
                        :class="
                          deliveryType === 'pickup'
                            ? 'text-red-darken-4'
                            : 'text-grey-darken-3'
                        "
                        >Pick-Up</span
                      >
                    </div>
                    <div
                      @click="deliveryType = 'delivery'"
                      class="flex-1-1-0 d-flex align-center justify-center py-2 px-4 border rounded-lg cursor-pointer transition-all"
                      :style="
                        deliveryType === 'delivery'
                          ? {
                              border: '1.5px solid #a03022 !important',
                              backgroundColor: '#fbebe9',
                            }
                          : {
                              border: '1px solid #e0e0e0 !important',
                              backgroundColor: '#ffffff',
                            }
                      "
                    >
                      <v-img
                        :src="delivery"
                        width="24"
                        height="24"
                        class="mr-2 flex-grow-0"
                        contain
                      />
                      <span
                        class="font-weight-bold text-subtitle-2"
                        :class="
                          deliveryType === 'delivery'
                            ? 'text-red-darken-4'
                            : 'text-grey-darken-3'
                        "
                        >Delivery</span
                      >
                    </div>
                  </div> -->

                  <!-- 3. Date Selector -->
                  <!-- <div class="my-3">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <span
                        class="font-weight-bold text-blue-darken-2 text-subtitle-2"
                        >Today</span
                      >
                      <span class="text-caption text-grey">Select Date</span>
                    </div>

                    <div
                      class="d-flex gap-2 overflow-x-auto pb-2 hide-scrollbar"
                      style="gap: 8px"
                    >
                      <div
                        v-for="d in [
                          'Wed 17',
                          'Thu 18',
                          'Fri 19',
                          'Sat 20',
                          'Sun 21',
                          'Mon 22',
                          'Tue 23',
                        ]"
                        :key="d"
                        @click="selectedDummyDate = d"
                        class="d-flex flex-column align-center justify-center rounded-lg cursor-pointer px-3 py-2 flex-shrink-0"
                        :style="
                          selectedDummyDate === d
                            ? {
                                backgroundColor: '#a03022',
                                color: '#ffffff',
                                border: '1.5px solid #a03022',
                                minWidth: '60px',
                              }
                            : {
                                backgroundColor: '#ffffff',
                                color: '#757575',
                                border: '1px solid #e0e0e0',
                                minWidth: '60px',
                              }
                        "
                      >
                        <span class="text-caption font-weight-medium">{{
                          d.split(" ")[0]
                        }}</span>
                        <span
                          class="text-subtitle-1 font-weight-bold"
                          style="line-height: 1.1"
                          >{{ d.split(" ")[1] }}</span
                        >
                      </div>
                    </div>
                  </div> -->

                  <!-- 4. My Addresses Card -->
                  <!-- <div
                    class="bg-grey-lighten-4 rounded-lg pa-3 my-3"
                    style="border: 1px solid #e0e0e0 !important"
                  >
                    <div class="d-flex align-center justify-space-between mb-3">
                      <span
                        class="font-weight-bold text-black text-subtitle-1"
                        style="font-family: serif"
                      >
                        My Addresses
                      </span>
                      <div class="d-flex" style="gap: 8px">
                        <div
                          v-for="chip in ['Home', 'Home 2']"
                          :key="chip"
                          @click="selectedDummyAddressChip = chip"
                          class="rounded-pill px-3 py-1 text-caption font-weight-bold cursor-pointer transition-all"
                          :class="
                            selectedDummyAddressChip === chip
                              ? 'bg-blue-grey-darken-1 text-white'
                              : 'bg-transparent text-grey-darken-2 border'
                          "
                          :style="
                            selectedDummyAddressChip !== chip
                              ? 'border: 1px solid #757575 !important'
                              : ''
                          "
                        >
                          {{ chip }}
                        </div>
                      </div>
                    </div>

                    <div
                      class="text-body-2 text-red-darken-4 font-weight-bold mb-3"
                      style="line-height: 1.4"
                    >
                      Block 76, #13-03 Marine Drive,<br />
                      Singapore 440076
                    </div>

                    <div
                      class="d-flex align-center justify-space-between pt-2 border-t"
                      style="border-top: 1px solid #e0e0e0 !important"
                    >
                      <div
                        class="d-flex align-center text-grey-darken-3 text-caption font-weight-bold"
                      >
                        <v-icon size="16" color="grey-darken-2" class="mr-1"
                          >mdi-map-marker-outline</v-icon
                        >
                        <p>
                          Total Distance :
                          <span class="text-red-darken-4"> 3.26 </span> kms away
                        </p>
                      </div>
                      <div
                        class="text-caption text-blue-darken-2 font-weight-bold cursor-pointer hover:underline"
                      >
                        Note To Rider
                      </div>
                    </div>
                  </div> -->

                  <!-- 5. Delivery Options Section -->
                  <!-- <div class="my-3">
                    <div
                      class="font-weight-bold text-subtitle-2 text-grey-darken-3 mb-2"
                    >
                      Delivery Options
                    </div>

                    <div class="d-flex flex-column" style="gap: 8px">
                      <div
                        @click="selectedDummyDeliveryOption = 'priority'"
                        class="d-flex align-center justify-space-between pa-3 rounded-lg cursor-pointer transition-all elevation-1 bg-white"
                        :style="
                          selectedDummyDeliveryOption === 'priority'
                            ? {
                                border: '1.5px solid #a03022',
                                backgroundColor: '#fbebe9',
                              }
                            : {
                                border: '1px solid #e0e0e0',
                              }
                        "
                      >
                        <div class="d-flex align-center">
                          <v-icon
                            size="24"
                            :color="
                              selectedDummyDeliveryOption === 'priority'
                                ? 'red-darken-4'
                                : 'grey-darken-1'
                            "
                            class="mr-3"
                          >
                            mdi-clock-fast
                          </v-icon>
                          <div>
                            <div
                              class="font-weight-bold text-subtitle-2 text-black"
                            >
                              Priority Delivery
                            </div>
                            <div class="text-caption text-grey-darken-1">
                              By 12:00 pm
                            </div>
                          </div>
                        </div>
                        <div
                          class="font-weight-bold text-subtitle-2 text-blue-darken-3"
                        >
                          S$ 9.20
                        </div>
                      </div>

                      <div
                        @click="selectedDummyDeliveryOption = 'basic'"
                        class="d-flex align-center justify-space-between pa-3 rounded-lg cursor-pointer transition-all elevation-1 bg-white"
                        :style="
                          selectedDummyDeliveryOption === 'basic'
                            ? {
                                border: '1.5px solid #a03022',
                                backgroundColor: '#fbebe9',
                              }
                            : {
                                border: '1px solid #e0e0e0',
                              }
                        "
                      >
                        <div class="d-flex align-center">
                          <v-icon
                            size="24"
                            :color="
                              selectedDummyDeliveryOption === 'basic'
                                ? 'red-darken-4'
                                : 'grey-darken-1'
                            "
                            class="mr-3"
                          >
                            mdi-truck-delivery-outline
                          </v-icon>
                          <div>
                            <div
                              class="font-weight-bold text-subtitle-2 text-black"
                            >
                              Basic Delivery
                            </div>
                            <div class="text-caption text-grey-darken-1">
                              By 12:30 pm
                            </div>
                          </div>
                        </div>
                        <div
                          class="font-weight-bold text-subtitle-2 text-blue-darken-3"
                        >
                          S$ 7.80
                        </div>
                      </div>

                      <div
                        @click="selectedDummyDeliveryOption = 'no_hurry'"
                        class="d-flex align-center justify-space-between pa-3 rounded-lg cursor-pointer transition-all elevation-1 bg-white"
                        :style="
                          selectedDummyDeliveryOption === 'no_hurry'
                            ? {
                                border: '1.5px solid #a03022',
                                backgroundColor: '#fbebe9',
                              }
                            : {
                                border: '1px solid #e0e0e0',
                              }
                        "
                      >
                        <div class="d-flex align-center">
                          <v-icon
                            size="24"
                            :color="
                              selectedDummyDeliveryOption === 'no_hurry'
                                ? 'red-darken-4'
                                : 'grey-darken-1'
                            "
                            class="mr-3"
                          >
                            mdi-walk
                          </v-icon>
                          <div>
                            <div
                              class="font-weight-bold text-subtitle-2 text-black"
                            >
                              No Hurry Delivery
                            </div>
                            <div class="text-caption text-grey-darken-1">
                              By 01:00 pm
                            </div>
                          </div>
                        </div>
                        <div
                          class="font-weight-bold text-subtitle-2 text-blue-darken-3"
                        >
                          S$ 6.50
                        </div>
                      </div>
                    </div>
                  </div> -->
                  <v-divider class="my-2" />
                  <template
                    v-for="{
                      isHeader,
                      category,
                      product,
                      key,
                    } in flatGroupedCart"
                    :key="key"
                  >
                    <div
                      v-if="isHeader"
                      class="text-subtitle-1 font-weight-bold mt-4 mb-1 px-3 text-orange-darken-3"
                      style="font-family: serif; font-size: 1.1rem !important"
                    >
                      {{ category }}
                    </div>
                    <div
                      v-else
                      class="d-flex flex-column px-3 py-3 my-3 w-100 bg-white rounded-lg"
                      style="
                        max-width: 100%;
                        border: 1px solid #e0e0e0 !important;
                      "
                    >
                      <div class="d-flex align-start w-100">
                        <div style="width: 25%" class="flex-shrink-0">
                          <v-img
                            class="rounded-lg bg-white"
                            :src="fileURL + product.dish_image"
                            width="85"
                            height="85"
                            cover
                          >
                            <template v-slot:placeholder>
                              <div
                                class="d-flex align-center justify-center fill-height"
                              >
                                <v-progress-circular
                                  color="grey-lighten-4"
                                  indeterminate
                                ></v-progress-circular>
                              </div>
                            </template>
                          </v-img>
                        </div>
                        <div style="width: 75%" class="ml-md-0 ml-2 pa-0">
                          <!-- Row 1: Product Name -->
                          <div
                            class="text-wrap font-weight-bold text-subtitle-1 text-black"
                            style="line-height: 1.25"
                          >
                            {{
                              product?.actual_dish_name
                                ? product.actual_dish_name
                                : product?.dish_name
                                  ? product.dish_name
                                  : ""
                            }}
                          </div>

                          <!-- Row 2: Variant & Total Price -->
                          <div
                            class="d-flex align-center justify-space-between mt-1"
                          >
                            <span class="text-grey-darken-2 text-body-2">{{
                              product.quantity_name
                            }}</span>
                            <div
                              class="d-flex align-center gap-2 justify-space-between"
                            >
                              <span
                                class="font-weight-black text-subtitle-1 text-black ml-2"
                              >
                                {{ selectedCountry?.currency_symbol }}
                                {{
                                  (product.price * product.quantity).toFixed(2)
                                }}
                              </span>
                            </div>
                          </div>

                          <!-- Row 4: Controls & Unit Price -->
                          <div
                            class="d-flex align-center justify-space-between"
                          >
                            <!-- Quantity Control -->
                            <div
                              class="d-flex align-center rounded border overflow-hidden bg-grey-lighten-4"
                              style="height: 32px"
                            >
                              <v-btn
                                size="32"
                                color="orange-darken-1"
                                class="rounded-0 text-white"
                                variant="flat"
                                icon
                                @click="
                                  handleUpdateQuantity(product, 'decrease')
                                "
                              >
                                <v-icon size="14">mdi-minus</v-icon>
                              </v-btn>
                              <span
                                class="px-3 text-body-2 font-weight-bold text-center"
                                style="min-width: 32px"
                              >
                                {{ product.quantity }}
                              </span>
                              <v-btn
                                size="32"
                                color="orange-darken-1"
                                class="rounded-0 text-white"
                                variant="flat"
                                icon
                                @click="
                                  handleUpdateQuantity(product, 'increase')
                                "
                              >
                                <v-icon size="14">mdi-plus</v-icon>
                              </v-btn>
                            </div>

                            <!-- Unit Price -->
                            <div
                              class="text-body-2 text-grey-darken-3 font-weight-bold"
                            >
                              {{ selectedCountry?.currency_symbol }}
                              {{ product.price }}
                            </div>

                            <v-btn
                              @click="handleRemoveFromCart(product)"
                              color="orange-darken-1"
                              icon="mdi-delete-outline"
                              variant="text"
                              size="small"
                            ></v-btn>
                          </div>
                        </div>
                      </div>
                      <!-- Row 3: Info Chips -->
                      <div
                        class="d-flex ga-2 align-center mt-2 flex-wrap w-100"
                      >
                        <div
                          v-if="product.dish_description"
                          class="d-flex align-center cursor-pointer px-2 py-1 rounded bg-orange-lighten-5 border text-caption text-grey-darken-4 font-weight-medium cursor-pointer"
                          @click="
                            showInformationModal(
                              `How is it made?`,
                              product.dish_description,
                            )
                          "
                          style="
                            border-color: #ffe0b2 !important;
                            border-radius: 6px !important;
                            font-size: 9px !important;
                          "
                        >
                          <span>How is it made?</span>
                          <v-icon size="12" class="ml-1" color="grey-darken-3"
                            >mdi-information-outline</v-icon
                          >
                        </div>
                        <div
                          v-if="product.pq_description"
                          class="d-flex align-center cursor-pointer px-2 py-1 rounded bg-orange-lighten-5 border text-caption text-grey-darken-4 font-weight-medium"
                          style="
                            border-color: #ffe0b2 !important;
                            border-radius: 6px !important;
                            font-size: 9px !important;
                          "
                          @click="
                            showInformationModal(
                              `What's Included?`,
                              product.pq_description,
                            )
                          "
                        >
                          <span>What's Included?</span>
                          <v-icon size="12" class="ml-1" color="grey-darken-3"
                            >mdi-information-outline</v-icon
                          >
                        </div>
                        <div
                          v-if="product.whats_free"
                          class="d-flex align-center cursor-pointer px-2 py-1 rounded bg-orange-lighten-5 border text-caption text-grey-darken-4 font-weight-medium"
                          @click="
                            showInformationModal(
                              `What's Free?`,
                              product.whats_free,
                            )
                          "
                          style="
                            border-color: #ffe0b2 !important;
                            border-radius: 6px !important;
                            font-size: 9px !important;
                          "
                        >
                          <span>What's Free?</span>
                          <v-icon size="12" class="ml-1" color="grey-darken-3"
                            >mdi-information-outline</v-icon
                          >
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <p class="pl-3 text-body-2">
                  To Proceed Please Select Pick up or Delivery
                </p>
              </v-col>
              <v-col v-if="step == 2" class="pa-5" style="min-height: 75vh">
                <div class="my-3 text-h6 d-flex justify-space-between">
                  <div class="d-flex flex-column">
                    <span>My Addresses</span>
                    <!-- <span class="text-caption text-red">You do not have any Delivery Address in your List .</span> -->
                  </div>
                  <v-btn
                    prepend-icon="mdi-arrow-left"
                    @click="step = 1"
                    color="grey"
                    variant="flat"
                    >Back</v-btn
                  >
                </div>
                <v-alert
                  v-show="addresses.length == 0"
                  class="p-0"
                  border="top"
                  type="warning"
                  variant="outlined"
                  text="You do not have any Delivery Address in your List."
                ></v-alert>
                <div class="pt-5">
                  <v-btn
                    @click="openAddressDialog"
                    prepend-icon="mdi-plus-circle"
                    color="primary"
                    variant="flat"
                    size="large"
                    block
                    >Add New</v-btn
                  >
                  <v-dialog
                    v-model="addressDialog"
                    :max-width="!isSmall ? 500 : undefined"
                    :fullscreen="isSmall"
                  >
                    <v-card>
                      <div
                        class="d-flex align-center justify-space-between px-md-5 px-2 py-4 border-b"
                      >
                        <div>
                          <strong>Add New Address</strong>
                        </div>
                        <div>
                          <v-icon @click="addressDialog = false"
                            >mdi-close-circle</v-icon
                          >
                        </div>
                      </div>
                      <div class="px-md-5 px-2 py-5 d-flex flex-column ga-3">
                        <v-row>
                          <v-col cols="12">
                            <v-autocomplete
                              prepend-inner-icon="mdi-magnify"
                              v-model:search="search"
                              :items="searchResults"
                              item-title="ADDRESS"
                              item-value="ADDRESS"
                              placeholder="Search Address..."
                              density="compact"
                              variant="outlined"
                              ref="searchRef"
                              :loading="isLoadingAddress"
                              hide-no-data
                              return-object
                              @update:model-value="onAddressSelected"
                            >
                              <template v-slot:item="{ props, item }">
                                <v-list-item
                                  v-bind="props"
                                  :title="item.raw.ADDRESS"
                                  :subtitle="item.raw.BUILDING"
                                ></v-list-item>
                              </template>
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" v-if="dwellingTypes.length > 0">
                            <p class="text-grey-darken-1 font-weight-bold mb-2">
                              Dwelling Type
                            </p>
                            <div class="d-flex align-center" style="gap: 5px">
                              <v-btn
                                v-for="dwelling in dwellingTypes.slice(0, 3)"
                                :key="dwelling.dwelling_id"
                                :color="
                                  addressForm.dwelling_id ===
                                  dwelling.dwelling_id
                                    ? 'blue-darken-1'
                                    : 'indigo-darken-1'
                                "
                                :variant="
                                  addressForm.dwelling_id ===
                                  dwelling.dwelling_id
                                    ? 'flat'
                                    : 'outlined'
                                "
                                rounded="pill"
                                size="small"
                                class="text-none text-caption font-weight-bold"
                                @click="
                                  addressForm.dwelling_id = dwelling.dwelling_id
                                "
                              >
                                {{ dwelling.dwelling_name }}
                              </v-btn>

                              <v-menu v-if="dwellingTypes.length > 3">
                                <template v-slot:activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    :color="
                                      selectedDwellingName !== 'More'
                                        ? 'blue-darken-1'
                                        : 'grey-lighten-1'
                                    "
                                    :variant="
                                      selectedDwellingName !== 'More'
                                        ? 'flat'
                                        : 'outlined'
                                    "
                                    rounded="pill"
                                    size="small"
                                    class="text-none font-weight-bold"
                                    append-icon="mdi-chevron-down"
                                  >
                                    {{ selectedDwellingName }}
                                  </v-btn>
                                </template>
                                <v-list>
                                  <v-list-item
                                    v-for="dwelling in dwellingTypes.slice(3)"
                                    :key="dwelling.dwelling_id"
                                    @click="
                                      addressForm.dwelling_id =
                                        dwelling.dwelling_id
                                    "
                                  >
                                    <v-list-item-title
                                      :class="
                                        addressForm.dwelling_id ===
                                        dwelling.dwelling_id
                                          ? 'text-blue-darken-1 font-weight-bold'
                                          : ''
                                      "
                                    >
                                      {{ dwelling.dwelling_name }}
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div>
                              <p class="text-grey-darken-1 font-weight-bold">
                                Full Address
                              </p>
                              <!-- <p
                                class="text-blue-darken-1 text-caption font-weight-bold"
                              >
                                * Please update your exact Address below
                              </p> -->
                              <MazTextarea
                                class="mt-1"
                                rows="4"
                                v-model="addressForm.full_address"
                                placeholder="Your Full Address"
                              />
                            </div>
                          </v-col>
                          <v-col
                            v-if="
                              addressForm.dwelling_id != 3 &&
                              addressForm.dwelling_id != 7 &&
                              addressForm.dwelling_id != 8
                            "
                            cols="6"
                          >
                            <p class="text-grey-darken-1 font-weight-bold">
                              # Floor - Unit No
                            </p>
                            <MazInput
                              class="mt-1 mb-2"
                              v-model="addressForm.unit"
                            />
                          </v-col>
                          <v-col v-if="addressForm.dwelling_id == 8" cols="6">
                            <p class="text-grey-darken-1 font-weight-bold">
                              Room Number
                            </p>
                            <MazInput
                              class="mt-1 mb-2"
                              v-model="addressForm.unit"
                            />
                          </v-col>
                          <v-col
                            v-if="
                              addressForm.dwelling_id != 3 &&
                              addressForm.dwelling_id != 7 &&
                              addressForm.dwelling_id != 8
                            "
                            cols="6"
                          >
                            <p class="text-grey-darken-1 font-weight-bold">
                              {{
                                addressForm.dwelling_id == 1
                                  ? "Lobby (A,B,C)"
                                  : "Lift Lobby"
                              }}
                            </p>
                            <MazInput
                              class="mt-1 mb-2"
                              :placeholder="
                                addressForm.dwelling_id == 1
                                  ? ''
                                  : 'Lobby A or 1'
                              "
                              v-model="addressForm.lift_lobby"
                            />
                          </v-col>
                          <v-col cols="12">
                            <template v-if="addressForm.dwelling_id == 1">
                              <p class="text-grey-darken-1 font-weight-bold">
                                Precinct / Estate / Cluster Name
                              </p>
                              <MazInput
                                disabled
                                class="mt-1 mb-2"
                                v-model="addressForm.building"
                              />
                            </template>
                            <template v-else-if="addressForm.dwelling_id == 2">
                              <p class="text-grey-darken-1 font-weight-bold">
                                Condo Name
                              </p>
                              <MazInput
                                class="mt-1 mb-2"
                                v-model="addressForm.building"
                                disabled
                              />
                            </template>
                            <template
                              v-else-if="
                                addressForm.dwelling_id == 4 ||
                                addressForm.dwelling_id == 5 ||
                                addressForm.dwelling_id == 6 ||
                                addressForm.dwelling_id == 9
                              "
                            >
                              <p class="text-grey-darken-1 font-weight-bold">
                                Building Name
                              </p>
                              <MazInput
                                class="mt-1 mb-2"
                                v-model="addressForm.building"
                                disabled
                              />
                            </template>
                          </v-col>
                          <v-col cols="12">
                            <p class="text-grey-darken-1 font-weight-bold">
                              Location Name
                            </p>
                            <v-combobox
                              class="mt-1"
                              v-model="addressForm.location_name"
                              :items="[
                                '---Select Location Name---',
                                ...locationNames,
                              ]"
                              placeholder="Select Location Name"
                              density="compact"
                              variant="outlined"
                              hide-details
                            ></v-combobox>
                          </v-col>
                        </v-row>

                        <!--  -->

                        <div>
                          <v-btn
                            @click="saveAddress()"
                            :loading="savingAddress"
                            :disabled="savingAddress"
                            color="primary"
                            variant="flat"
                            size="large"
                            block
                            >Save</v-btn
                          >
                        </div>
                      </div>
                    </v-card>
                  </v-dialog>
                </div>

                <!-- class="border-md bg-white mt-6" -->
                <div
                  v-for="(option, index) in addressesOptions"
                  class="cursor-pointer"
                  :class="{
                    'mt-6': true,
                    'pa-5': true,
                    'bg-teal-lighten-2': option.value == selectedAddress,
                    'rounded-lg': true,
                    'border-md': option.value != selectedAddress,
                  }"
                >
                  <!-- 'bg-white': option.primary_address, -->
                  <!-- 'border-md': !option.primary_address, -->
                  <v-row @click="selectAddress(option)">
                    <v-col cols="8">
                      <strong>{{ option.location_name }}</strong>
                    </v-col>
                    <v-col
                      v-if="option.primary_address"
                      col="4"
                      class="justify-end text-red-darken-1"
                    >
                      <strong>Primary</strong>
                    </v-col>
                  </v-row>
                  <v-divider
                    v-if="option.primary_address"
                    :thickness="2"
                    class="mt-2 mb-2 border-opacity-25"
                  />
                  <v-divider
                    v-else
                    :thickness="2"
                    class="mt-2 mb-2 border-opacity-15"
                  />
                  <v-row class="d-flex align-center">
                    <v-col @click="selectAddress(option)" cols="9">
                      <p
                        v-if="option?.full_address"
                        v-html="formatInfo(option.full_address)"
                      />
                    </v-col>
                    <v-col cols="3" class="d-flex align-center pa-0">
                      <!-- <v-btn
                        class=""
                        @click="handleEditLocation(option.value)"
                        color="lime"
                        icon="mdi-pencil-outline"
                        size="small"
                      ></v-btn> -->
                      <v-btn
                        class=""
                        @click="handleOpenDialog(option, index)"
                        color="red"
                        icon="mdi-trash-can"
                        size="small"
                      ></v-btn>
                    </v-col>
                    <v-col cols="12">
                      <p class="font-weight-bold">
                        Unit # :
                        <span class="text-blue-darken-4 mr-4">{{
                          option?.unit_number
                        }}</span>
                        {{ option?.building_no }} {{ option?.building_name }}
                      </p>
                    </v-col>
                  </v-row>
                </div>

                <!-- <v-row class="mt-4">
                <v-col>
                  <div>
                    <label class="text-grey-darken-1 font-weight-bold"
                      >Delivery Instructions</label
                    >
                    <MazTextarea
                      class="mt-1"
                      rows="4"
                      placeholder="Your Full Address"
                      v-model="deliveryInstructions"
                      @blur="changeDeliveryInstructions"
                    />
                  </div>
                </v-col>
              </v-row> -->
              </v-col>
              <v-col v-if="step == 3" class="pa-5" style="min-height: 75vh">
                <div class="my-3 text-h6 d-flex justify-space-between">
                  <div class="d-flex align-center mb-3">
                    <div class="flex-grow-0 flex-shrink-0">
                      <v-img
                        class="rounded-circle bg-white border"
                        :src="fileURL + cart[0]?.restaurant_logo"
                        width="50"
                        height="50"
                      >
                        <template v-slot:placeholder>
                          <div
                            class="d-flex align-center justify-center fill-height"
                          >
                            <v-progress-circular
                              color="grey-lighten-4"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                    </div>
                    <div class="ml-3 pa-0" style="min-width: 0">
                      <div
                        class="font-weight-bold text-black text-body-2"
                        style="line-height: 1.2"
                      >
                        {{ cart[0]?.restaurant_name || "" }}
                      </div>
                      <div
                        class="text-grey font-weight-medium text-caption mt-1"
                        style="line-height: 1.2"
                      >
                        {{ cart[0]?.town_name || "" }}
                      </div>
                    </div>
                  </div>
                  <v-btn
                    prepend-icon="mdi-arrow-left"
                    @click="step = 2"
                    color="grey"
                    variant="flat"
                    >Back</v-btn
                  >
                </div>
                <!-- <p class="font-weight-black mb-2 mt-6">Today</p>
                <p class="text-red-darken-4 font-weight-bold">
                  {{ currentTime }}
                </p>

                <MazRadioButtons
                  v-slot="{ option, selected }"
                  v-model="selectedDelivery"
                  :options="
                    deliveryOptions.filter((item) => item.same_day == 'S')
                  "
                  class="pt-5 d-flex flex-row"
                  color="secondary"
                  selector
                  block
                  @update:model-value="onSelectDelivery"
                >
                  <div style="display: flex; flex-direction: column">
                    <span class="text-blue-accent-4 font-weight-bold ml-2"
                      >{{ selectedCountry.currency_symbol }}
                      {{ option?.price ? option.price.toFixed(2) : "" }}</span
                    >
                    <div class="d-flex justify-space-between ma-2">
                      <strong>{{ option.label }}</strong>
                    </div>
                    <div class="ma-2">
                      <p
                        class="text-red-darken-4 font-weight-bold font-sm mb-2"
                      >
                        {{ option.description_2 }}
                      </p>
                      <p
                        v-if="option.cut_off"
                        class="text-red font-weight-bold font-sm"
                      >
                        Cut off Time ({{ option.cut_off }})
                      </p>
                    </div>
                  </div>
                </MazRadioButtons>
                <p class="font-weight-black mb-2 mt-6">Tomorrow Onwards</p>
                <MazRadioButtons
                  v-slot="{ option, selected }"
                  v-model="selectedDelivery"
                  :options="
                    deliveryOptions.filter((item) => item.same_day == 'A')
                  "
                  class="pt-5 d-flex flex-row"
                  color="secondary"
                  selector
                  block
                  @update:model-value="onSelectDelivery"
                >
                  <div style="display: flex; flex-direction: column">
                    <span class="text-blue-accent-4 font-weight-bold ml-2"
                      >{{ selectedCountry.currency_symbol }}
                      {{ option?.price ? option.price.toFixed(2) : "" }}</span
                    >
                    <div class="d-flex justify-space-between ma-2">
                      <strong>{{ option.label }}</strong>
                    </div>
                    <span class="text-red font-weight-bold font-sm ml-2">{{
                      option.description_1
                    }}</span>
                    <span class="text-red font-weight-bold font-sm ml-2">{{
                      option.description_2
                    }}</span>
                  </div>
                </MazRadioButtons> -->

                <div
                  class="w-100 d-flex justify-center align-center"
                  v-if="isLoadingBiryaniRunAddress"
                >
                  <v-progress-circular
                    indeterminate
                    :size="50"
                    :width="4"
                    color="primary"
                  ></v-progress-circular>
                </div>
                <template v-else>
                  <div
                    class="mt-4 mb-2 d-flex w-100 justify-center align-center"
                  >
                    <p class="text-subtitle-2 font-weight-bold">
                      <template v-if="isRestaurant24Hrs">
                        <span class="text-green-lighten-1">Open Now</span> |
                        24 Hours
                      </template>
                      <template v-else-if="restaurantOpenStatus === 'open'">
                        <span class="text-green-lighten-1">Open Now</span>
                        <template v-if="restaurantClosesInLabel">
                          |
                          Closes in
                          <span class="text-red-darken-2">{{
                            restaurantClosesInLabel
                          }}</span>
                        </template>
                      </template>
                      <template v-else-if="restaurantOpenStatus === 'closed'">
                        <span class="text-red-darken-2">Closed</span>
                      </template>
                    </p>
                  </div>
                  <!-- NEW UI -->
                  <div class="d-flex justify-space-between align-start">
                    <!-- Left Column -->
                    <div class="w-50 text-caption text-left">
                      <!-- Row 1: Delivery To -->
                      <div
                        class="font-weight-bold text-subtitle-2 mb-2 text-grey-darken-3"
                      >
                        Delivery To
                      </div>

                      <!-- Row 2: Location Name & Change -->
                      <div
                        class="d-flex justify-space-between align-center mb-1"
                      >
                        <strong
                          class="text-subtitle-1 text-black font-weight-black"
                          >{{ filteredAddress?.location_name }}</strong
                        >
                        <span
                          class="text-blue-lighten-1 cursor-pointer font-weight-bold"
                          @click="step = 2"
                          >Change</span
                        >
                      </div>

                      <!-- Divider -->
                      <v-divider
                        :thickness="1"
                        class="mt-1 mb-2 border-opacity-15"
                      />

                      <!-- Row 3: Full Address -->
                      <div class="mb-2">
                        <p
                          v-if="filteredAddress?.full_address"
                          v-html="formatInfo(filteredAddress.full_address)"
                          class="text-grey-darken-3 font-weight-medium"
                          style="line-height: 1.4"
                        />
                      </div>

                      <!-- Row 4: Unit # -->
                      <div>
                        <p class="font-weight-bold text-grey-darken-4">
                          Unit # :
                          <span class="text-blue-darken-4 mr-2">{{
                            filteredAddress?.unit_number
                          }}</span>
                          {{ filteredAddress?.building_no }}
                          {{ filteredAddress?.building_name }}
                        </p>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div
                      class="w-50 text-caption text-right d-flex flex-column align-end"
                    >
                      <!-- Total Distance -->
                      <div class="mb-3">
                        <p class="text-grey-darken-3 font-weight-bold mb-1">
                          <v-icon size="16" color="grey-darken-2" class="mr-1"
                            >mdi-map-marker-outline</v-icon
                          >
                          Total Distance :
                        </p>
                        <p class="text-black">
                          <span class="font-weight-bold text-red-darken-4">{{
                            filteredAddress?.distance
                          }}</span>
                          kms away
                        </p>
                      </div>

                      <template
                        v-if="
                          userEmail === 'charltonmendes@gmail.com' ||
                          userEmail === 'ajiprsty4713@gmail.com'
                        "
                      >
                        <!-- Extra Kms -->
                        <div class="mb-3" v-if="extraRateInfo">
                          <p class="text-grey-darken-3 font-weight-bold mb-1">
                            Extra Kms
                          </p>
                          <p class="text-black">
                            <span class="font-weight-bold text-red-darken-4">{{
                              Number(extraRateInfo.extraDistance).toFixed(2)
                            }}</span>
                            kms
                          </p>
                        </div>

                        <!-- Rate Per Kms -->
                        <div v-if="extraRateInfo">
                          <p class="text-grey-darken-3 font-weight-bold mb-1">
                            Rate Per Kms
                          </p>
                          <p>
                            <span
                              v-if="peakNonPeakInfo?.peak_non_peak == 'NP'"
                              class="font-weight-bold text-red-darken-4 mr-4"
                              >{{ extraRateInfo.per_km_rate_non_peak }}</span
                            >
                            <span
                              v-else-if="peakNonPeakInfo?.peak_non_peak == 'P'"
                              class="font-weight-bold text-red-darken-4"
                              >{{ extraRateInfo.per_km_rate_peak }}</span
                            >
                          </p>
                        </div>
                      </template>
                    </div>
                  </div>
                  <template
                    v-if="
                      userEmail === 'charltonmendes@gmail.com' ||
                      userEmail === 'ajiprsty4713@gmail.com'
                    "
                  >
                    <div class="w-100 d-flex justify-space-between align-end">
                      <!-- Row 5: Peak Rate Info (Bottom Left) -->
                      <div v-if="peakNonPeakInfo">
                        <span
                          class="text-blue-darken-1 font-weight-black text-caption"
                          >{{ peakNonPeakInfo.rate_name }}</span
                        >
                        <span
                          class="text-grey-darken-1 font-weight-black text-caption mx-1"
                          >|</span
                        >
                        <span
                          class="text-green-darken-2 font-weight-black text-caption"
                          >{{ peakNonPeakInfo.base_fee }} x
                          {{ peakNonPeakInfo.surge_multiplier }}</span
                        >
                      </div>
                      <!-- Surge Pricing -->
                      <div v-if="peakNonPeakInfo">
                        <p
                          class="text-green-darken-2 font-weight-black text-caption mb-1"
                        >
                          {{ peakNonPeakInfo.display_message }}
                        </p>
                        <p
                          class="text-purple-darken-3 font-weight-black text-body-2"
                        >
                          S$
                          {{
                            (
                              parseFloat(peakNonPeakInfo.base_fee || 0) *
                              parseFloat(peakNonPeakInfo.surge_multiplier || 1)
                            ).toFixed(2)
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="w-100">
                      <div v-if="extraRateInfo">
                        <span
                          class="text-red-darken-4 font-weight-black text-caption"
                          >Extra Kms Total :
                        </span>

                        <span
                          class="text-red-darken-1 font-weight-black text-caption"
                          >{{ Number(extraRateInfo.extraDistance).toFixed(2) }}
                          x
                          {{
                            peakNonPeakInfo?.peak_non_peak == "NP"
                              ? extraRateInfo.per_km_rate_non_peak
                              : extraRateInfo.per_km_rate_peak
                          }}</span
                        >
                        =
                        <span
                          class="text-red-darken-1 font-weight-black text-caption"
                          >S$
                          {{
                            (
                              Number(extraRateInfo.extraDistance) *
                              (peakNonPeakInfo?.peak_non_peak == "NP"
                                ? extraRateInfo.per_km_rate_non_peak
                                : extraRateInfo.per_km_rate_peak)
                            ).toFixed(2)
                          }}</span
                        >
                      </div>
                    </div>
                  </template>

                  <div class="mb-3 mt-8">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <span
                        class="font-weight-bold text-grey-darken-3 text-subtitle-2"
                        >When</span
                      >
                      <span class="text-caption text-grey">Select Date</span>
                    </div>

                    <div
                      class="d-flex ga-2 overflow-x-auto pb-2 hide-scrollbar"
                    >
                      <div
                        v-for="d in sevenDaysList"
                        :key="d"
                        @click="selectedDummyDate = d"
                        class="d-flex flex-column align-center justify-center rounded-lg cursor-pointer px-2 py-1 px-md-4 py-md-2 flex-shrink-0"
                        :style="
                          selectedDummyDate === d
                            ? {
                                backgroundColor: '#a03022',
                                color: '#ffffff',
                                border: '1.5px solid #a03022',
                              }
                            : {
                                backgroundColor: '#ffffff',
                                color: '#757575',
                                border: '1px solid #e0e0e0',
                              }
                        "
                      >
                        <span class="text-caption font-weight-medium">{{
                          d.split(" ")[0]
                        }}</span>
                        <span
                          class="text-caption font-weight-bold"
                          style="line-height: 1.1"
                          >{{ d.split(" ")[1] }}</span
                        >
                      </div>
                    </div>
                  </div>

                  <div
                    class="mb-3 mt-8"
                    v-if="selectedDummyDate !== sevenDaysList[0]"
                  >
                    <div class="font-weight-black text-subtitle-1 mb-4">
                      Order for
                    </div>
                    <div class="font-weight-bold text-subtitle-2 mb-2">
                      {{ formattedSelectedFullDate }}
                    </div>
                    <v-select
                      v-model="selectedDeliveryRate"
                      :items="deliveryRates"
                      item-title="rate_name"
                      item-value="dr_id"
                      placeholder="--- Select ---"
                      variant="outlined"
                      density="compact"
                      hide-details
                    ></v-select>
                  </div>

                  <div
                    class="mb-3 mt-8"
                    v-if="
                      selectedDummyDate === sevenDaysList[0] ||
                      (selectedDummyDate !== sevenDaysList[0] &&
                        selectedDeliveryRate)
                    "
                  >
                    <div
                      class="d-flex justify-start ga-10 font-weight-bold text-subtitle-2 text-grey-darken-3 mb-2"
                    >
                      <span>Delivery Options</span>
                      <p
                        class="text-red-darken-4 text-caption font-weight-bold"
                      >
                        {{ currentHourDisplay }}
                      </p>
                    </div>

                    <div class="d-flex flex-column" style="gap: 8px">
                      <!-- FOR TODAY -->
                      <template v-if="selectedDummyDate === sevenDaysList[0]">
                        <div
                          v-if="isLoadingDeliveryTiers"
                          class="d-flex justify-center pa-4"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </div>
                        <template v-else>
                          <div
                            v-for="tier in deliveryTiersList"
                            :key="tier.dt_id"
                          >
                          <div
                            @click="selectedDummyDeliveryOption = tier.dt_id"
                            class="d-flex align-center justify-space-between pa-3 rounded-lg cursor-pointer transition-all elevation-1 bg-white"
                            :style="
                              selectedDummyDeliveryOption === tier.dt_id
                                ? {
                                    border: '1.5px solid #a03022',
                                    backgroundColor: '#fbebe9',
                                  }
                                : {
                                    border: '1px solid #e0e0e0',
                                  }
                            "
                          >
                            <div class="d-flex align-center ga-2">
                              <img
                                v-if="tier.icon_image"
                                :src="tier.icon_image"
                                style="
                                  width: 24px;
                                  height: 24px;
                                  object-fit: contain;
                                "
                                class="mr-3"
                                alt="icon"
                              />
                              <v-icon
                                size="24"
                                :color="
                                  selectedDummyDeliveryOption === tier.dt_id
                                    ? 'red-darken-4'
                                    : 'grey-darken-1'
                                "
                                v-else
                              >
                                {{ getDeliveryIcon(tier.delivery_tier_name) }}
                              </v-icon>
                              <div>
                                <div
                                  class="font-weight-bold text-subtitle-2 text-black"
                                >
                                  {{ tier.delivery_tier_name }}
                                </div>
                                <div class="d-flex">
                                  <span class="text-caption text-grey-darken-1">
                                    By {{ tier.delivery_by }}
                                  </span>
                                  <div
                                    style="font-size: 11px"
                                    class="text-green-darken-1"
                                    v-if="
                                      userEmail ===
                                        'charltonmendes@gmail.com' ||
                                      userEmail === 'ajiprsty4713@gmail.com'
                                    "
                                  >
                                    (
                                    <span>
                                      S$
                                      {{
                                        (
                                          parseFloat(
                                            peakNonPeakInfo?.base_fee || 0,
                                          ) *
                                          parseFloat(
                                            peakNonPeakInfo?.surge_multiplier ||
                                              1,
                                          )
                                        ).toFixed(2)
                                      }}</span
                                    >
                                    +
                                    <span>
                                      S$
                                      {{
                                        (
                                          Number(
                                            extraRateInfo?.extraDistance || 0,
                                          ) *
                                          Number(
                                            peakNonPeakInfo?.peak_non_peak ==
                                              "NP"
                                              ? extraRateInfo?.per_km_rate_non_peak ||
                                                  0
                                              : extraRateInfo?.per_km_rate_peak ||
                                                  0,
                                          )
                                        ).toFixed(2)
                                      }}</span
                                    >
                                    +
                                    <span>
                                      S$ {{ getNonStackFee(tier?.dt_id) }}
                                    </span>
                                    )
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              class="font-weight-bold text-subtitle-2 text-blue-darken-3"
                            >
                              S$
                              {{
                                (
                                  parseFloat(peakNonPeakInfo?.base_fee || 0) *
                                    parseFloat(
                                      peakNonPeakInfo?.surge_multiplier || 1,
                                    ) +
                                  Number(extraRateInfo?.extraDistance || 0) *
                                    (peakNonPeakInfo?.peak_non_peak == "NP"
                                      ? Number(
                                          extraRateInfo?.per_km_rate_non_peak ||
                                            0,
                                        )
                                      : Number(
                                          extraRateInfo?.per_km_rate_peak || 0,
                                        )) +
                                  Number(getNonStackFee(tier?.dt_id) || 0)
                                ).toFixed(2)
                              }}
                            </div>
                          </div>
                          <div
                            class="px-1 pt-1"
                            style="color: #d32f2f; font-size: 11px; font-weight: 700; line-height: 1.3;"
                          >
                            {{ getTierBufferTestLabel(tier) }}
                          </div>
                          </div>
                        </template>
                        <div
                          v-if="isLoadingTimeSlots"
                          class="d-flex justify-center pa-4"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </div>
                        <div
                          v-for="slot in timeSlotsForRate"
                          :key="'today-' + slot.time_slot_id"
                          @click="selectedTimeSlotForRate = slot.time_slot_id"
                          class="d-flex align-center justify-space-between px-4 py-3 rounded cursor-pointer bg-white"
                          :style="
                            selectedTimeSlotForRate === slot.time_slot_id
                              ? 'border: 1.5px solid #a03022 !important'
                              : 'border: 1px solid #e0e0e0 !important'
                          "
                        >
                          <div class="text-body-2 font-weight-medium text-black">
                            {{ slot.slot_from_to }}
                          </div>
                        </div>
                      </template>

                      <!-- FOR DATES OTHER THAN TODAY -->
                      <template v-else>
                        <div
                          v-if="isLoadingTimeSlots"
                          class="d-flex justify-center pa-4"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </div>
                        <template v-else>
                          <div
                            v-for="slot in timeSlotsForRate"
                            :key="slot.time_slot_id"
                            @click="selectedTimeSlotForRate = slot.time_slot_id"
                            class="d-flex align-center justify-space-between px-4 py-3 rounded cursor-pointer bg-white"
                            :style="
                              selectedTimeSlotForRate === slot.time_slot_id
                                ? 'border: 1.5px solid #a03022 !important'
                                : 'border: 1px solid #e0e0e0 !important'
                            "
                          >
                            <div
                              class="text-body-2 font-weight-medium"
                              :class="
                                selectedTimeSlotForRate === slot.time_slot_id
                                  ? 'text-black'
                                  : slot.peak_non_peak === 'P'
                                    ? 'font-weight-bold text-black'
                                    : 'text-black'
                              "
                            >
                              {{ slot.slot_from_to }}
                            </div>
                            <div
                              class="text-body-2 font-weight-bold"
                              :class="
                                selectedTimeSlotForRate === slot.time_slot_id
                                  ? 'text-blue-darken-3'
                                  : slot.peak_non_peak === 'P'
                                    ? 'text-blue-darken-3'
                                    : 'text-black'
                              "
                            >
                              S$
                              {{
                                Number(slot.total_delivery_charges).toFixed(2)
                              }}
                            </div>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col v-if="step == 4" class="pa-5">
                <div class="my-3 text-h6 d-flex justify-space-between">
                  <span>Review Order</span>
                  <v-btn
                    prepend-icon="mdi-arrow-left"
                    @click="step = 3"
                    color="grey"
                    variant="flat"
                    >Back</v-btn
                  >
                </div>
                <p class="text-red-darken-3 font-weight-black text-caption">
                  (Please press Back button to Edit any changes required)
                </p>
                <template v-for="(product, index) in cart" :key="index">
                  <div class="d-flex align-center px-3 py-1">
                    <div class="flex-grow-0 flex-shrink-0">
                      <v-img
                        class="rounded bg-white"
                        :src="fileURL + product.dish_image"
                        width="65"
                        height="65"
                        cover
                      >
                        <template v-slot:placeholder>
                          <div
                            class="d-flex align-center justify-center fill-height"
                          >
                            <v-progress-circular
                              color="grey-lighten-4"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                    </div>
                    <div class="flex-grow-1 flex-shrink-0 ml-1 pa-2">
                      <div class="">
                        <div class="text-wrap product-name text-body-2">
                          {{
                            product?.actual_dish_name
                              ? product.actual_dish_name
                              : product?.dish_name
                                ? product.dish_name
                                : ""
                          }}
                        </div>
                        <span class="text-blue text-body-2">{{
                          product.quantity_name
                        }}</span>
                        <!-- <div class="text-body-2 text-end">
                          <strong
                            >{{ selectedCountry?.currency_symbol }}
                          </strong>
                          S{{
                            formatCurrency(product.price * product.quantity)
                          }}
                        </div> -->
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center ga-3 border">
                          <v-btn
                            size="xs"
                            color="black"
                            class="text-caption pa-1 rounded-0"
                            variant="flat"
                            icon
                            @click="handleUpdateQuantity(product, 'decrease')"
                          >
                            <v-icon>mdi-minus</v-icon>
                          </v-btn>
                          <span class="text-body-2">{{
                            product.quantity
                          }}</span>
                          <v-btn
                            size="xs"
                            color="black"
                            class="text-caption pa-1 rounded-0"
                            variant="flat"
                            icon
                            @click="handleUpdateQuantity(product, 'increase')"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </div>
                        <div class="text-body-2">
                          <strong class="text-red">{{
                            selectedCountry?.currency_symbol
                          }}</strong>
                          <strong class="text-red">S{{ product.price }}</strong>
                        </div>
                        <div>
                          <v-btn
                            @click="handleRemoveFromCart(product)"
                            color="red"
                            icon="mdi-trash-can"
                            size="x-small"
                          ></v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <v-card elevation="0">
                  <div
                    class="d-flex align-center justify-space-between pa-4 border-b"
                  >
                    <div><strong>Billing Summary</strong></div>
                  </div>
                  <v-table density="compact" class="custom-table">
                    <tbody class="text-caption">
                      <tr>
                        <td colspan="2">Sub Total</td>
                        <td colspan="2" class="text-end">
                          {{ selectedCountry.currency_symbol }}
                        </td>
                        <td colspan="2" class="text-end">
                          {{ Number(subTotal).toFixed(2) }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          Service Fee ({{ cart[0]?.service_percentage }}%)
                        </td>
                        <td colspan="2" class="text-end">
                          {{ selectedCountry.currency_symbol }}
                        </td>
                        <td colspan="2" class="text-end">
                          {{ cart[0]?.service_fee }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">Platform Fee</td>
                        <td colspan="2" class="text-end">
                          {{ selectedCountry.currency_symbol }}
                        </td>
                        <td colspan="2" class="text-end">
                          {{ cart[0]?.platform_fee }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">Delivery Charges</td>
                        <td colspan="2" class="text-end">
                          {{ selectedCountry.currency_symbol }}
                        </td>
                        <td colspan="2" class="text-end">
                          {{ cart[0]?.delivery_charges }}
                        </td>
                      </tr>

                      <tr>
                        <td colspan="2">
                          G.S.T
                          {{
                            taxAmount != null
                              ? "(" + taxAmount + "%)"
                              : "(Not Applicable)"
                          }}
                        </td>
                        <td colspan="2" class="text-end">
                          {{ selectedCountry.currency_symbol }}
                        </td>
                        <td colspan="2" class="text-end">
                          {{
                            taxAmount != null
                              ? (
                                  ((subTotal + selectedDeliveryPrice + 0.5) *
                                    taxAmount) /
                                  100
                                ).toFixed(2)
                              : "0.00"
                          }}
                        </td>
                      </tr>
                      <tr class="total-row">
                        <td colspan="2" class="border-none">
                          <strong>This is what you pay</strong>
                        </td>
                        <td colspan="2" class="border-none text-end">
                          <strong>{{ selectedCountry.currency_symbol }}</strong>
                        </td>
                        <td colspan="2" class="text-end border-none">
                          <strong>{{ finalCartTotal }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <div class="px-4 text-caption">
                    <v-row no-gutters class="font-weight-black mt-6">
                      <v-col cols="6"> Delivery to : </v-col>
                      <v-col cols="6"> Order Instructions </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-2 font-weight-bold">
                      <v-col cols="6">
                        <p
                          v-if="cart[0]?.delivery_address"
                          v-html="formatInfo(cart[0]?.delivery_address)"
                        />
                      </v-col>
                      <v-col cols="6">
                        <p
                          v-if="cart[0]?.order_instructions"
                          v-html="formatInfo(cart[0]?.order_instructions)"
                        />
                      </v-col>
                    </v-row>
                    <!-- <v-row no-gutters class="font-weight-black mt-6">
                    <v-col cols="6"> Order Status </v-col>
                    <v-col cols="6"> Delivery Status </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    class="mt-2 text-blue-darken-4 font-weight-bold"
                  >
                    <v-col cols="6"> {{ cart[0]?.order_status_name }} </v-col>
                    <v-col cols="6"> {{ cart[0]?.delivery_status }} </v-col>
                  </v-row> -->
                    <v-row no-gutters class="font-weight-black mt-6">
                      <v-col cols="6"> Delivery Date </v-col>
                      <v-col cols="6"> Time Slot </v-col>
                    </v-row>
                    <v-row
                      no-gutters
                      class="mt-2 text-blue-darken-4 font-weight-bold"
                    >
                      <v-col cols="6">
                        {{ formattedDeliveryDate }}
                      </v-col>
                      <v-col cols="6"> {{ formattedTimeSlot }} </v-col>
                    </v-row>
                    <!-- <v-row no-gutters class="font-weight-black mt-6">
                    <v-col cols="6"> Payment Status </v-col>
                    <v-col cols="6"> Payment By </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-2">
                    <v-col cols="6" class="text-blue-darken-4 font-weight-bold">
                      {{ cart[0]?.payment_status_name }}
                    </v-col>
                    <v-col cols="6" class="text-red-darken-1 font-weight-bold">
                      {{ cart[0]?.payment_type }}
                    </v-col>
                  </v-row> -->
                  </div>
                </v-card>
              </v-col>
              <v-col v-if="step == 5" class="pa-5">
                <div class="my-3 text-h6 d-flex justify-space-between">
                  <span>Payment Options</span>
                  <v-btn
                    prepend-icon="mdi-arrow-left"
                    @click="step = 4"
                    color="grey"
                    variant="flat"
                    >Back</v-btn
                  >
                </div>
                <MazRadioButtons
                  v-slot="{ option, selected }"
                  v-model="selectedPaymentMethod"
                  :options="paymentOptions"
                  @update:model-value="onSelectPayment"
                  orientation="col | row"
                  :selector="true"
                  color="info"
                  block
                  class=""
                >
                  <div class="d-flex align-center justify-start ga-3">
                    <div style="width: 20%">
                      <v-img
                        height="60"
                        width="60"
                        :src="option.payment_image"
                      />
                    </div>
                    <div style="width: 80%">
                      <p class="font-weight-bold">{{ option.payment_name }}</p>
                      <p
                        class="text-caption text-red-darken-1 mt-2 font-weight-bold"
                      >
                        {{ option.payment_desc }}
                      </p>
                    </div>
                  </div>
                </MazRadioButtons>
                <p
                  v-if="paymentOptions2.length > 0"
                  class="text-caption font-weight-bold mb-4 mt-10"
                >
                  More payment options coming soon ...
                </p>
                <MazRadioButtons
                  v-slot="{ option, selected }"
                  :options="paymentOptions2"
                  orientation="col | row"
                  :selector="true"
                  color="info"
                  block
                  class=""
                >
                  <div class="d-flex align-center justify-start ga-3">
                    <div style="width: 20%">
                      <v-img
                        height="60"
                        width="60"
                        :src="option.payment_image"
                      />
                    </div>
                    <div style="width: 80%">
                      <p class="font-weight-bold">{{ option.payment_name }}</p>
                      <p
                        class="text-caption text-red-darken-1 mt-2 font-weight-bold"
                      >
                        {{ option.payment_desc }}
                      </p>
                    </div>
                  </div>
                </MazRadioButtons>
              </v-col>
              <v-col v-if="step == 6" class="pa-5">
                <div class="mt-3 mb-6 text-h6 d-flex justify-space-between">
                  <span
                    >Pay using {{ orders?.payment_type?.payment_name }}</span
                  >
                  <v-btn
                    prepend-icon="mdi-arrow-left"
                    @click="step = 5"
                    color="grey"
                    variant="flat"
                    >Back</v-btn
                  >
                </div>
                <v-row>
                  <v-col cols="6">
                    <v-img
                      :src="
                        orders?.payment_type_id == 2
                          ? fileURL +
                            paymentTypes.find(
                              (item) =>
                                item.payment_type_id ===
                                orders?.payment_type_id,
                            )?.qr_code +
                            '.jpeg'
                          : fileURL +
                            paymentTypes.find(
                              (item) =>
                                item.payment_type_id ===
                                orders?.payment_type_id,
                            )?.qr_code
                      "
                      height="200"
                      width="200"
                    />
                  </v-col>
                  <v-col cols="6" class="d-flex align-center">
                    <div class="font-weight-bold mb-4">
                      <p>Please Pay Exactly</p>
                      <p class="text-h4 font-weight-black mt-6">
                        S$ {{ orders?.final_amount }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6"
                    ><div class="font-weight-bold mb-4">
                      <p>Paynow Number</p>
                      <p class="text-grey-darken-1 mt-2">
                        {{
                          paymentTypes.find(
                            (item) =>
                              item.payment_type_id === orders?.payment_type_id,
                          )?.mobile_number
                        }}
                      </p>
                    </div></v-col
                  >
                  <v-col cols="6">
                    <div class="font-weight-bold mb-4">
                      <p>Paynow Name</p>
                      <p class="text-grey-darken-1 mt-2">
                        {{
                          paymentTypes.find(
                            (item) =>
                              item.payment_type_id === orders?.payment_type_id,
                          )?.company
                        }}
                      </p>
                    </div></v-col
                  >
                </v-row>

                <div
                  class="d-flex w-100 align-center justify-space-between mt-10"
                >
                  <v-btn
                    @click="payLater = true"
                    variant="outlined"
                    size="large"
                    class="rounded-xl"
                    style="width: 46%"
                    >I will pay later</v-btn
                  >
                  <v-btn
                    @click="havePaid = true"
                    variant="outlined"
                    size="large"
                    class="rounded-xl"
                    style="width: 46%"
                    >I have Paid</v-btn
                  >
                </div>
              </v-col>
              <v-col v-if="step == 99" class="pa-5">
                <div class="my-3 text-h6 d-flex justify-space-between">
                  <span class="font-weight-bold text-blue-darken-2"
                    >Delivery Schedule</span
                  >
                  <v-btn
                    prepend-icon="mdi-arrow-left"
                    @click="step = 2"
                    color="grey"
                    variant="flat"
                    >Back</v-btn
                  >
                </div>
                <p class="text-red-darken-4 font-weight-bold mt-2">
                  {{ currentTime }}
                </p>
                <!-- <p class="font-weight-bold text-red-darken-4 mb-6">
                You Selected
                </p> -->
                <div style="border: 1.5px solid #daf4fd" class="px-4 py-3 my-4">
                  <div class="d-flex justify-space-between mb-3">
                    <strong>{{ selectedDeliveryObject?.label }}</strong>
                    <span v-if="selectedDeliveryObject?.price" class="price"
                      >{{ selectedCountry.currency_symbol }}
                      {{ selectedDeliveryObject?.price.toFixed(2) }}</span
                    >
                  </div>

                  <div class="">
                    <strong
                      v-if="selectedDeliveryObject?.same_day == 'S'"
                      class="text-red font-weight-bold font-sm"
                      >Cut off Time ({{
                        selectedDeliveryObject?.cut_off
                      }})</strong
                    >
                    <template v-else>
                      <span class="text-red font-weight-bold font-sm">{{
                        selectedDeliveryObject?.description_1
                      }}</span>
                      <span class="text-red font-weight-bold font-sm">{{
                        selectedDeliveryObject?.description_2
                      }}</span>
                    </template>
                  </div>
                </div>
                <div
                  class="w-75 mt-4"
                  v-if="selectedDeliveryObject?.same_day == 'A'"
                >
                  <!-- v-if="selectedDelivery == 5 || selectedDelivery == 6" -->
                  <!-- <VueDatePicker
                  style="font-size: 12px !important"
                  class="text-caption mb-4"
                  :disabled-week-days="selectedDeliveryObject?.allowedDays"
                  v-model="selectedDate"
                  :format="format"
                  :min-date="
                    new Date(new Date().setDate(new Date().getDate() + 1))
                  "
                  placeholder="Select Advance Delivery"
                  /> -->
                  <v-dialog v-model="dialog" width="300">
                    <template #activator="{ props }">
                      <v-btn
                        class="w-100 text-left text-blue-darken-2"
                        variant="outlined"
                        color="primary"
                        v-bind="props"
                      >
                        <span v-if="!selectedDate">
                          Select Advance Delivery
                        </span>
                        <span v-else>{{ format(selectedDate) }}</span>
                      </v-btn>
                    </template>

                    <v-card height="550">
                      <v-card-title>Select a Date</v-card-title>
                      <v-card-text>
                        <VueDatePicker
                          v-model="selectedDate"
                          :format="format"
                          :min-date="tomorrow"
                          placeholder="Select Advance Delivery"
                          style="font-size: 12px !important"
                          class="text-caption mb-4"
                          :disabled-week-days="
                            selectedDeliveryObject?.allowedDays
                          "
                          :enable-time-picker="false"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn text @click="cancelDate">Cancel</v-btn>
                        <v-btn text @click="confirmDate">OK</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-select
                    clearable
                    density="compact"
                    placeholder="Select Time Slot"
                    v-model="selectedTimeSlot"
                    :items="timeSlots"
                    class="border-sm text-blue-darken-2 mt-4"
                    variant="outlined"
                    item-title="slot_from_to"
                    item-value="slot_from_to"
                  >
                    <template #item="{ props, item }">
                      <p class="mb-2 text-sm cursor-pointer" v-bind="props">
                        {{ item.raw.slot_from_to }}
                        <span
                          v-if="item.raw.description"
                          class="font-weight-bold"
                          >({{ item.raw.description }})</span
                        >
                      </p>
                    </template>
                  </v-select>
                </div>
                <template v-else>
                  <!-- <p class="font-weight-bold text-red-darken-4 mt-10 mb-6">
                  This is your Delivery Schedule
                  </p> -->
                  <div class="d-flex justify-start align-center ga-8">
                    <div>
                      <label class="font-weight-bold text-caption"
                        >Today
                        <span class="text-blue-darken-2"
                          >({{ selectedDeliveryObject?.today_day }})</span
                        ></label
                      >
                      <MazInput
                        class="mt-1 text-blue-darken-2 font-weight-bold"
                        v-model="selectedDeliveryObject.today_date"
                        readonly
                      />
                    </div>
                    <div>
                      <label class="font-weight-bold text-caption"
                        >Approx Delivery Time</label
                      >
                      <MazInput
                        class="mt-1 text-blue-darken-2 font-weight-bold"
                        v-model="selectedDeliveryObject.time_slot"
                        readonly
                      />
                    </div>
                  </div>
                </template>
                <div class="mt-12">
                  <label class="text-red-darken-4 font-weight-bold"
                    >Delivery Order Instructions</label
                  >
                  <p class="text-caption">(Do not type address here)</p>
                  <MazTextarea
                    class="mt-1"
                    rows="4"
                    v-model="deliveryScheduleInstruction"
                    @update:model-value="changeDeliveryScheduleInstruction"
                  />
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- Fixed Checkout Button -->
          <div class="checkout-container border-t">
            <div
              class="d-flex align-center justify-center justify-space-between"
            >
              <div v-if="step == 1" class="d-flex align-center ga-4">
                <v-btn
                  @click="onlyDeliveryDialog = true"
                  variant="outlined"
                  size="md"
                  class="text-caption font-weight-black px-2 py-1"
                >
                  <v-img height="30" width="30" :src="pickup" />
                  Pick-Up
                </v-btn>
                <v-btn
                  @click="nextStep(2)"
                  variant="outlined"
                  size="md"
                  class="text-caption font-weight-black px-2 py-1"
                >
                  <v-img height="30" width="30" :src="delivery" />
                  Delivery</v-btn
                >
              </div>
              <v-btn
                v-else-if="step == 2"
                @click="nextStep(3)"
                color="#ff9800"
                variant="flat"
                size="large"
                >Delivery Options</v-btn
              >
              <!-- <v-btn
                v-else-if="step == 3"
                @click="whereToDeliver()"
                color="#ff9800"
                variant="flat"
                size="large"
                >Where to Deliver?</v-btn
              > -->
              <v-btn
                v-else-if="step == 3"
                @click="nextStep(4)"
                color="#ff9800"
                variant="flat"
                size="large"
                >Review Order</v-btn
              >
              <v-btn
                v-else-if="step == 4"
                @click="confirmOrder2 = true"
                color="#ff9800"
                variant="flat"
                :size="isSmall ? 'small' : 'large'"
                >Confirm Order</v-btn
              >
              <v-btn
                v-else-if="step == 5"
                @click="nextStep(6)"
                color="#ff9800"
                variant="flat"
                size="large"
                >Pay Now</v-btn
              >
              <v-btn
                v-else-if="step == 8"
                @click="confirmOrder = true"
                color="#1868C1"
                variant="flat"
                size="large"
                >CONFIRM ORDER</v-btn
              >
              <div v-if="step == 6" class="text-caption">
                <p>Change your mind?</p>
                <div
                  class="d-flex flex-column flex-md-row align-start align-md-center ga-0 ga-md-2 mt-2 mt-md-0"
                >
                  <button
                    @click="cancelOrderDialog = true"
                    class="text-red-darken-1"
                  >
                    Cancel Order
                  </button>
                  <span class="d-none d-md-block">|</span>
                  <hr
                    class="d-block d-md-none w-100 my-1 border-black border-sm"
                  />
                  <button
                    @click="isRestaurant = true"
                    class="text-blue-darken-1"
                  >
                    Add More
                  </button>
                </div>
              </div>
              <div>
                <v-icon
                  @click="
                    () => {
                      summaryDialog = true;
                      console.log(cart);
                    }
                  "
                  size="40"
                >
                  <v-img
                    src="@/assets/images/billing.png"
                    alt="Billing Summary"
                  />
                </v-icon>
                <v-dialog v-model="summaryDialog" max-width="500">
                  <v-card>
                    <div
                      class="d-flex align-center justify-space-between pa-4 border-b"
                    >
                      <div><strong>Billing Summary</strong></div>
                      <div>
                        <v-icon @click="summaryDialog = false"
                          >mdi-close-circle</v-icon
                        >
                      </div>
                    </div>
                    <v-table class="custom-table">
                      <tbody>
                        <tr>
                          <td>Sub Total</td>
                          <td>{{ selectedCountry.currency_symbol }}</td>
                          <td class="text-end">
                            {{ Number(subTotal).toFixed(2) }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Service Fee ({{ cart[0]?.service_percentage }}%)
                          </td>
                          <td>{{ selectedCountry.currency_symbol }}</td>
                          <td class="text-end">
                            {{ cart[0]?.service_fee }}
                          </td>
                        </tr>
                        <tr>
                          <td>Platform Fee</td>
                          <td>{{ selectedCountry.currency_symbol }}</td>
                          <td class="text-end">
                            {{ cart[0]?.platform_fee }}
                          </td>
                        </tr>
                        <tr>
                          <td>Delivery Charges</td>
                          <td>{{ selectedCountry.currency_symbol }}</td>
                          <td class="text-end">
                            {{ cart[0]?.delivery_charges }}
                          </td>
                        </tr>

                        <tr>
                          <td>
                            G.S.T
                            {{
                              taxAmount != null
                                ? "(" + taxAmount + "%)"
                                : "(Not Applicable)"
                            }}
                          </td>
                          <td>{{ selectedCountry.currency_symbol }}</td>
                          <td class="text-end">
                            {{
                              taxAmount != null
                                ? (
                                    ((subTotal + selectedDeliveryPrice + 0.5) *
                                      taxAmount) /
                                    100
                                  ).toFixed(2)
                                : "0.00"
                            }}
                          </td>
                        </tr>
                        <tr class="total-row">
                          <td><strong>This is what you pay</strong></td>
                          <td>
                            <strong>{{
                              selectedCountry.currency_symbol
                            }}</strong>
                          </td>
                          <td class="text-end">
                            <strong>{{ finalCartTotal }}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-dialog>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="cart-items flex-grow-1 overflow-y-auto">
            <v-row no-gutters>
              <v-col cols="12" class="px-3 py-2">
                <div
                  class="d-flex flex-column pa-3 bg-white rounded-lg"
                  style="border: 1px solid #e0e0e0 !important"
                >
                  <div class="d-flex align-start">
                    <div class="flex-grow-0 flex-shrink-0">
                      <v-img
                        class="rounded-circle bg-white border"
                        :src="fileURL + cart[0]?.restaurant_logo"
                        width="60"
                        height="60"
                      >
                        <template v-slot:placeholder>
                          <div
                            class="d-flex align-center justify-center fill-height"
                          >
                            <v-progress-circular
                              color="grey-lighten-4"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                    </div>
                    <div class="ml-3 pa-0 flex-grow-1" style="min-width: 0">
                      <!-- Row 1: Name + Open Now -->
                      <div class="d-flex align-start justify-space-between">
                        <div
                          class="font-weight-bold text-black text-subtitle-1 text-truncate pr-2"
                          style="
                            font-size: 1.1rem !important;
                            line-height: 1.2;
                          "
                        >
                          {{ cart[0]?.restaurant_name || "" }}
                        </div>
                        <div
                          v-if="isRestaurant24Hrs"
                          class="font-weight-bold text-red flex-shrink-0"
                          style="font-size: 0.85rem; line-height: 1.2"
                        >
                          24 Hrs
                        </div>
                        <div
                          v-else-if="restaurantOpenStatus === 'open'"
                          class="font-weight-bold flex-shrink-0 text-end"
                          style="
                            font-size: 0.85rem;
                            line-height: 1.2;
                            color: #2e7d32;
                          "
                        >
                          Open Now
                        </div>
                        <div
                          v-else-if="restaurantOpenStatus === 'closed'"
                          class="font-weight-bold text-red flex-shrink-0"
                          style="font-size: 0.85rem; line-height: 1.2"
                        >
                          Closed Now
                        </div>
                      </div>

                      <!-- Row 2: Town + distance (left) | Accepting (right) -->
                      <div
                        class="mt-1 d-flex align-start justify-space-between"
                        style="gap: 8px"
                      >
                        <div
                          class="text-grey font-weight-medium d-flex align-center"
                          style="
                            font-size: 0.9rem;
                            line-height: 1.25;
                            min-width: 0;
                            gap: 6px;
                          "
                        >
                          <span class="text-truncate">{{
                            cart[0]?.town_name || ""
                          }}</span>
                          <span
                            v-if="cart[0]?.distance"
                            class="flex-shrink-0"
                            style="font-size: 0.75rem; line-height: 1.2"
                          >
                            <span class="text-red font-weight-bold">{{
                              cart[0].distance
                            }}</span>
                            <span class="text-grey"> kms away</span>
                          </span>
                        </div>
                        <div
                          v-if="acceptingOrdersLabel"
                          class="font-weight-bold flex-shrink-0 text-end"
                          :style="{
                            fontSize: '0.72rem',
                            lineHeight: '1.2',
                            color: acceptingOrdersLabel.color,
                            maxWidth: '42%',
                          }"
                        >
                          {{ acceptingOrdersLabel.text }}
                        </div>
                      </div>

                      <!-- Row 3: Tagline | Since -->
                      <div
                        v-if="cart[0]?.tag_line || cart[0]?.since"
                        class="mt-2 font-weight-bold"
                        style="font-size: 0.72rem; line-height: 1.25"
                      >
                        <span
                          v-if="cart[0]?.tag_line"
                          style="color: #2e7d32"
                          >{{ cart[0].tag_line }}</span
                        ><span
                          v-if="cart[0]?.tag_line && cart[0]?.since"
                          class="text-black"
                        >
                          | </span
                        ><span v-if="cart[0]?.since" class="text-black"
                          >Since
                          <span style="color: #7b1fa2">{{
                            cart[0].since
                          }}</span></span
                        >
                      </div>

                      <!-- Row 4: Hours -->
                      <div
                        v-if="restaurantOperatingHoursLabel"
                        class="mt-2 font-weight-bold"
                        style="
                          color: #1976d2;
                          font-size: 0.82rem;
                          line-height: 1.3;
                        "
                      >
                        {{ restaurantOperatingHoursLabel }}
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-divider></v-divider>
              <v-col cols="12" class="py-1">
                <div
                  class="d-flex align-center ga-3 overflow-x-auto px-3 py-2 hide-scrollbar"
                  style="white-space: nowrap"
                >
                  <v-btn
                    v-for="cat in categories.slice(0, 2)"
                    :key="cat.name"
                    variant="outlined"
                    rounded="pill"
                    class="text-none font-weight-black flex-shrink-0"
                    style="
                      border-width: 1.5px;
                      height: 38px;
                      min-width: auto;
                      letter-spacing: 0;
                      font-size: 10px;
                    "
                    :style="{
                      color:
                        activeCategory === cat.name
                          ? '#8b0000 !important'
                          : '#3F51B5 !important',
                      borderColor:
                        activeCategory === cat.name
                          ? '#8b0000 !important'
                          : '#3F51B5 !important',
                      backgroundColor: '#ffffff !important',
                    }"
                    @click="activeCategory = cat.name"
                  >
                    {{ cat.name
                    }}<span v-if="cat.count !== undefined"
                      >({{ cat.count }})</span
                    >
                  </v-btn>

                  <v-menu v-if="categories.length > 2">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        variant="outlined"
                        rounded="pill"
                        class="text-none font-weight-black flex-shrink-0"
                        style="
                          border-width: 1.5px;
                          height: 38px;
                          min-width: auto;
                          letter-spacing: 0;
                          font-size: 12px;
                        "
                        :style="{
                          color:
                            selectedMoreCategoryLabel !== 'More'
                              ? '#3F51B5 !important'
                              : '#000000 !important',
                          borderColor:
                            selectedMoreCategoryLabel !== 'More'
                              ? '#3F51B5 !important'
                              : '#e0e0e0 !important',
                          backgroundColor: '#ffffff !important',
                        }"
                        append-icon="mdi-chevron-down"
                      >
                        {{ selectedMoreCategoryLabel }}
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="cat in categories.slice(2)"
                        :key="cat.name"
                        @click="activeCategory = cat.name"
                        :active="activeCategory === cat.name"
                      >
                        <v-list-item-title class="text-caption font-weight-bold"
                          >{{ cat.name
                          }}<span v-if="cat.count !== undefined"
                            >({{ cat.count }})</span
                          ></v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </v-col>
              <v-col cols="12" class="px-3 pb-2">
                <form
                  class="navbar__search cart-menu-dish-search"
                  @submit.prevent
                >
                  <input
                    v-model="menuDishSearch"
                    type="text"
                    placeholder="Type a Dish Name"
                    aria-label="Search dishes"
                  />
                  <button
                    v-if="menuDishSearch"
                    type="button"
                    class="cart-menu-dish-clear"
                    aria-label="Clear search"
                    @click="menuDishSearch = ''"
                  >
                    <v-icon size="14" color="white">mdi-close</v-icon>
                  </button>
                  <button class="btn btn--search" type="submit">
                    <v-icon color="white" size="20">mdi-magnify</v-icon>
                  </button>
                </form>
                <div
                  class="mt-2 text-caption font-weight-bold d-flex align-center flex-wrap"
                  style="line-height: 1.3"
                >
                  <span class="text-black">Add more Dishes and press --- &gt;</span>
                  <span
                    class="text-blue cursor-pointer ml-1"
                    @click="isRestaurant = false"
                  >
                    Return to Cart
                  </span>
                </div>
              </v-col>
              <v-col
                class="d-flex flex-column justify-space-between align-content-space-between"
              >
                <div class="">
                  <template
                    v-for="{ isHeader, category, product, key } in menuDisplayRows"
                    :key="key"
                  >
                    <div
                      v-if="isHeader"
                      class="font-weight-bold mt-3 mb-1 px-3"
                      style="
                        color: #8b0000;
                        font-size: 1.15rem;
                        line-height: 1.2;
                      "
                    >
                      {{ category }}
                    </div>
                    <div
                      v-else
                      class="w-100 d-flex align-center justify-space-between px-3 py-1 ga-4"
                    >
                      <div class="d-flex align-center" style="width: 90%">
                        <div class="flex-grow-0 flex-shrink-0">
                          <v-img
                            class="rounded bg-white"
                            :src="fileURL + product.dish_image"
                            width="80"
                            height="60"
                            cover
                          >
                            <template v-slot:placeholder>
                              <div
                                class="d-flex align-center justify-center fill-height"
                              >
                                <v-progress-circular
                                  color="grey-lighten-4"
                                  indeterminate
                                ></v-progress-circular>
                              </div>
                            </template>
                          </v-img>
                        </div>
                        <div class="ml-1 pa-2 w-100">
                          <span
                            class="text-wrap font-weight-black product-name text-body-2 mb-2"
                          >
                            {{ product.dish_name }}
                          </span>
                          <!-- <div style="font-size: 9px">
                            <v-icon color="#F63F17"> mdi-star </v-icon>
                            <v-icon color="#F63F17"> mdi-star </v-icon>
                            <v-icon color="#F63F17"> mdi-star </v-icon>
                            <v-icon color="#F63F17"> mdi-star </v-icon>
                            <v-icon color="#F63F17"> mdi-star-outline </v-icon>
                            <span class="ml-2 text-grey"> 132 votes </span>
                          </div> -->
                          <p class="text-blue text-caption">
                            {{ product.quantity_name }}
                          </p>

                          <div
                            class="d-flex justify-space-between w-100 align-center"
                          >
                            <span class="text-body-2 text-red">
                              <strong
                                >{{ selectedCountry?.currency_symbol }}
                                {{ product.rate }}</strong
                              >
                            </span>
                            <!-- <span
                              class="text-blue-darken-3 font-weight-bold text-caption cursor-pointer"
                              @click="
                                openWhatsIncluded(
                                  product.pq_description ||
                                    product.dish_description,
                                )
                              "
                              >What's Included ?</span
                            > -->
                          </div>

                          <div class="d-flex align-center flex-wrap mt-2 ga-1">
                            <div
                              v-if="product.dish_description"
                              class="d-flex align-center cursor-pointer pa-1 rounded bg-orange-lighten-5 border text-caption text-grey-darken-4 font-weight-medium cursor-pointer"
                              @click="
                                showInformationModal(
                                  `How is it made?`,
                                  product.dish_description,
                                )
                              "
                              style="
                                border-color: #ffe0b2 !important;
                                border-radius: 6px !important;
                                font-size: 8px !important;
                              "
                            >
                              <span>How is it made?</span>
                              <v-icon
                                size="12"
                                class="ml-1"
                                color="grey-darken-3"
                                >mdi-information-outline</v-icon
                              >
                            </div>
                            <div
                              v-if="product.pq_description"
                              class="d-flex align-center cursor-pointer pa-1 rounded bg-orange-lighten-5 border text-caption text-grey-darken-4 font-weight-medium"
                              style="
                                border-color: #ffe0b2 !important;
                                border-radius: 6px !important;
                                font-size: 8px !important;
                              "
                              @click="
                                showInformationModal(
                                  `What's Included?`,
                                  product.pq_description,
                                )
                              "
                            >
                              <span>What's Included?</span>
                              <v-icon
                                size="12"
                                class="ml-1"
                                color="grey-darken-3"
                                >mdi-information-outline</v-icon
                              >
                            </div>
                            <div
                              v-if="product.whats_free"
                              class="d-flex align-center cursor-pointer pa-1 rounded bg-orange-lighten-5 border text-caption text-grey-darken-4 font-weight-medium"
                              @click="
                                showInformationModal(
                                  `What's Free?`,
                                  product.whats_free,
                                )
                              "
                              style="
                                border-color: #ffe0b2 !important;
                                border-radius: 6px !important;
                                font-size: 8px !important;
                              "
                            >
                              <span>What's Free?</span>
                              <v-icon
                                size="12"
                                class="ml-1"
                                color="grey-darken-3"
                                >mdi-information-outline</v-icon
                              >
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style="width: 10%">
                        <v-btn
                          v-if="!isInCart2(product)"
                          @click="addToCartData(product)"
                          size="xs"
                          color="black"
                          class="text-caption py-1 px-4"
                          variant="flat"
                          >Add</v-btn
                        >

                        <span
                          v-else="isInCart2(product)"
                          class="text-red text-caption font-weight-bold"
                        >
                          In Cart
                        </span>
                      </div>
                    </div>
                  </template>
                </div>
              </v-col>
            </v-row>
          </div>
        </template>
      </div>
    </template>
  </MazDrawer>
  <v-dialog v-model="informationModal" width="auto">
    <v-card width="350">
      <v-card-title>{{ informationModalTitle }}</v-card-title>
      <v-card-text>
        {{ informationModalContent }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="informationModal = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="openDialog" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Do you wish to Delete . ?</h4>
        <div class="w-100 d-flex align-center justify-space-around">
          <v-btn class="mb-4 w-33 bg-primary" @click="handleDeleteAddress()">
            Yes
          </v-btn>
          <v-btn class="mb-4 w-33 bg-primary" @click="openDialog = false">
            No
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="cancelOrderDialog" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Cancel this Order . ?</h4>
        <div class="w-100 d-flex align-center justify-space-around">
          <v-btn class="mb-4 w-33 bg-primary" @click="cancelOrder()">
            Yes
          </v-btn>
          <v-btn
            class="mb-4 w-33 bg-primary"
            @click="cancelOrderDialog = false"
          >
            No
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isEmptyAddress" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Please add at least one address</h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="isEmptyAddress = false">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="onlyDeliveryDialog" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Only Delivery Option</h4>
        <v-btn
          class="mb-4 w-100 bg-primary"
          @click="onlyDeliveryDialog = false"
        >
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isEmptyPayment" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Please add at least one option</h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="isEmptyPayment = false">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="payLater" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">
          Once Payment is made pls what's app us to 89102000
        </h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="handlePayLater">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="havePaid" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">
          Thanks !!! for Payment we will check and update your payment status
          for your current Order
        </h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="handleHavePaid">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="acceptCash" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">
          We will accept cash option once you address is Verified
        </h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="handleAcceptCash()">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="orderConfirmed" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">
          Your Order has been confirmed . someone will get in touch with you
          very shortly.
        </h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="handleOrderConfirmed()">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="confirmOrder2" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Confirm this Order . ?</h4>
        <div class="w-100 d-flex align-center justify-space-around">
          <v-btn class="mb-4 w-33 bg-primary" @click="updateCartOrderStatus()">
            Yes
          </v-btn>
          <v-btn class="mb-4 w-33 bg-primary" @click="confirmOrder2 = false">
            No
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="whatsIncludedDialog" width="auto" max-width="400">
    <v-card rounded="lg" class="pa-4">
      <div class="d-flex align-center justify-space-between mb-2">
        <h3 class="text-blue-darken-3 font-weight-bold text-subtitle-1">
          What's Included
        </h3>
        <v-btn
          icon="mdi-close"
          size="x-small"
          color="grey-darken-2"
          variant="flat"
          class="text-white rounded-circle"
          @click="whatsIncludedDialog = false"
        ></v-btn>
      </div>
      <v-divider class="mb-4"></v-divider>
      <v-card-text
        class="pa-0 text-body-1 font-weight-medium text-black"
        style="line-height: 1.5"
      >
        {{ selectedPqDescription }}
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- <v-dialog v-model="confirmOrder" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Confirm this Order . ?</h4>
        <div class="w-100 d-flex align-center justify-space-around">
          <v-btn class="mb-4 w-33 bg-primary" @click="handleConfirmOrder()">
            Yes
          </v-btn>
          <v-btn class="mb-4 w-33 bg-primary" @click="confirmOrder = false">
            No
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog> -->
</template>

<script setup>
import {
  ref,
  reactive,
  watch,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  nextTick,
} from "vue";
import moment from "moment-timezone";
import axios from "@/util/axios";
import { useStore } from "vuex";
import "maz-ui/styles";
import MazDrawer from "maz-ui/components/MazDrawer";
import MazInput from "maz-ui/components/MazInput";
import MazTextarea from "maz-ui/components/MazTextarea";
import MazRadioButtons from "maz-ui/components/MazRadioButtons";
// import { Loader } from "@googlemaps/js-api-loader";
import { useCart } from "@/composables/useCart";
import { useGlobalSnackbar } from "@/composables/useGlobalSnackbar";
import { fileURL } from "@/util/variables";
import qris from "@/assets/images/payment/qris-example.png";
import pickup from "@/assets/images/logo/pick-up.png";
import delivery from "@/assets/images/logo/delivery.png";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const { snackbarVisible, snackbarMessage, snackbarColor } = useGlobalSnackbar();
const { addToCart, updateQuantity, addToCartMenuRatePrice } = useCart();
const store = useStore();

const COUNTRY_TIMEZONES = {
  Nepal: "Asia/Kathmandu",
  "United Arab Emirates": "Asia/Dubai",
  "United Kingdom": "Europe/London",
  "United States": "America/New_York",
  India: "Asia/Kolkata",
  Germany: "Europe/Berlin",
  France: "Europe/Paris",
  Australia: "Australia/Sydney",
  Canada: "America/Toronto",
  Japan: "Asia/Tokyo",
  China: "Asia/Shanghai",
  Singapore: "Asia/Singapore",
  Malaysia: "Asia/Kuala_Lumpur",
  Indonesia: "Asia/Jakarta",
};

const getDeliveryTimezone = () => {
  const cartTimezone = store.state.cart?.[0]?.timezone;
  if (cartTimezone) return cartTimezone;
  const name = store.state.selectedCountry?.country_name;
  return COUNTRY_TIMEZONES[name] || "Asia/Singapore";
};

let autocomplete;
const allDays = [0, 1, 2, 3, 4, 5, 6];
const authToken = localStorage.getItem("token");

const props = defineProps({
  viewCart: Boolean,
});
const emit = defineEmits(["update:viewCart"]);

const currentTime = ref("");
const currentHour = ref("");
const searchRef = ref(null);
const openDialog = ref(false);
const informationModal = ref(false);
const informationModalContent = ref("");
const informationModalTitle = ref("");
const cancelOrderDialog = ref(false);
const deliveryType = ref("delivery"); // 'pickup' or 'delivery'
const sevenDaysList = computed(() => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(moment().tz(getDeliveryTimezone()).add(i, "days").format("ddd DD"));
  }
  return days;
});
const selectedDummyDate = ref(moment().tz(getDeliveryTimezone()).format("ddd DD"));
const selectedDummyAddressChip = ref("Home");
const selectedDummyDeliveryOption = ref(null);
const deliveryTiersList = ref([]);
const isLoadingDeliveryTiers = ref(false);

const deliveryRates = ref([]);
const selectedDeliveryRate = ref(null);

const formattedSelectedFullDate = computed(() => {
  const index = sevenDaysList.value.findIndex(
    (d) => d === selectedDummyDate.value,
  );
  if (index !== -1) {
    return moment()
      .tz(getDeliveryTimezone())
      .add(index, "days")
      .format("dddd , Do MMMM YYYY");
  }
  return "";
});

const getDeliveryIcon = (name) => {
  const lowerName = (name || "").toLowerCase();
  if (
    lowerName.includes("instant") ||
    lowerName.includes("priority") ||
    lowerName.includes("flash")
  ) {
    return "mdi-clock-fast";
  } else if (
    lowerName.includes("no hurry") ||
    lowerName.includes("saver") ||
    lowerName.includes("walk") ||
    lowerName.includes("relaxed")
  ) {
    return "mdi-walk";
  }
  return "mdi-truck-delivery-outline";
};

const selectDefaultDeliveryTier = () => {
  if (!deliveryTiersList.value.length) return;
  const instant = deliveryTiersList.value.find((tier) =>
    String(tier.delivery_tier_name || "")
      .toLowerCase()
      .includes("instant"),
  );
  selectedDummyDeliveryOption.value = (instant || deliveryTiersList.value[0])
    .dt_id;
};

const getDeliveryTiers = async (restaurantId) => {
  isLoadingDeliveryTiers.value = true;
  try {
    const response = await axios.get(`/list-delivery-tiers/7/${restaurantId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = response.data?.data;
    deliveryTiersList.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching delivery tiers:", error);
    deliveryTiersList.value = [];
  } finally {
    isLoadingDeliveryTiers.value = false;
  }
};

const getDeliveryRates = async () => {
  try {
    const response = await axios.get("/list-delivery-rates", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    deliveryRates.value = response.data?.data || [];
  } catch (error) {
    console.error("Error fetching delivery rates:", error);
    deliveryRates.value = [];
  }
};

const timeSlotsForRate = ref([]);
const selectedTimeSlotForRate = ref(null);
const isLoadingTimeSlots = ref(false);
let timeSlotsRequestId = 0;

const getTimeSlotsForRate = async () => {
  const isToday = selectedDummyDate.value === sevenDaysList.value[0];
  const drId = selectedDeliveryRate.value;
  if (!isToday && (!drId || !filteredAddress.value?.distance)) {
    return;
  }

  const requestId = ++timeSlotsRequestId;
  isLoadingTimeSlots.value = true;
  try {
    const dateIndex = sevenDaysList.value.findIndex(
      (d) => d === selectedDummyDate.value,
    );
    const formattedDate = moment()
      .tz(getDeliveryTimezone())
      .add(dateIndex !== -1 ? dateIndex : 0, "days")
      .format("DD/MM/YYYY");
    const restaurantId = cart.value[0]?.restaurant_id;
    const requestConfig = {
      headers: { Authorization: `Bearer ${authToken}` },
      params: {
        restaurant_id: restaurantId || undefined,
        delivery_date: formattedDate,
        app_id: 7,
      },
    };
    const response = isToday
      ? await axios.get(`/get-time-slots/7`, requestConfig)
      : await axios.get(
          `/list-time-slots-by-dr-id/${drId}/${filteredAddress.value.distance}`,
          requestConfig,
        );
    if (requestId !== timeSlotsRequestId) return;
    const slots = Array.isArray(response.data?.data) ? response.data.data : [];
    timeSlotsForRate.value = isToday
      ? filterSlotsByEndTime(slots)
      : filterSlotsByCheckoutBuffer(slots, false);
    const picked = pickSlotForCutoff(timeSlotsForRate.value);
    const stillValid = timeSlotsForRate.value.some(
      (slot) => slot.time_slot_id === selectedTimeSlotForRate.value,
    );
    if (picked && (isToday || !stillValid)) {
      selectedTimeSlotForRate.value = picked.time_slot_id;
    }
  } catch (error) {
    if (requestId !== timeSlotsRequestId) return;
    console.error("Error fetching time slots:", error);
    timeSlotsForRate.value = [];
  } finally {
    if (requestId === timeSlotsRequestId) {
      isLoadingTimeSlots.value = false;
    }
  }
};

const getSelectedDeliveryTier = () => {
  return (deliveryTiersList.value || []).find(
    (tier) => Number(tier.dt_id) === Number(selectedDummyDeliveryOption.value),
  );
};

const SLOT_LOOKUP_BUFFER_MINUTES = 15;

const getCheckoutBufferMinutes = () => {
  const selectedBuffer = Number(getSelectedDeliveryTier()?.buffer_minutes);
  if (!Number.isNaN(selectedBuffer) && selectedBuffer > 0) {
    return selectedBuffer;
  }
  const buffers = (deliveryTiersList.value || [])
    .map((tier) => Number(tier.buffer_minutes))
    .filter((mins) => !Number.isNaN(mins) && mins > 0);
  return buffers.length ? buffers[0] : SLOT_LOOKUP_BUFFER_MINUTES;
};

const getSlotLookupBufferMinutes = () => SLOT_LOOKUP_BUFFER_MINUTES;

const getTierLookupHms = (tier) => {
  const deliveryByLabel = tier?.delivery_by;
  if (!deliveryByLabel) return null;
  const deliveryBy = moment(
    deliveryByLabel,
    ["hh:mm A", "h:mm A", "HH:mm:ss", "HH:mm"],
    true,
  );
  if (!deliveryBy.isValid()) return null;
  return addMinutesToHms(
    deliveryBy.format("HH:mm:ss"),
    SLOT_LOOKUP_BUFFER_MINUTES,
  );
};

const formatHmsToAmPm = (hms) => {
  if (!hms) return "—";
  const parsed = moment(hms, "HH:mm:ss", true);
  return parsed.isValid() ? parsed.format("hh:mm A") : hms;
};

const getTierBufferTestLabel = (tier) => {
  const dbBuffer = Number(tier?.buffer_minutes);
  const dbBufferText = Number.isNaN(dbBuffer) ? "n/a" : `${dbBuffer} min`;
  const lookup = getTierLookupHms(tier);
  const slot = (timeSlotsForRate.value || []).find((s) => {
    const start = toHms(s.start_time);
    const end = toHms(s.end_time);
    return start && end && lookup && lookup >= start && lookup <= end;
  });
  return `TEST: DB buffer ${dbBufferText} | By ${tier?.delivery_by || "—"} + ${SLOT_LOOKUP_BUFFER_MINUTES} = ${formatHmsToAmPm(lookup)} → ${slot?.slot_from_to || "no slot"}`;
};

const toHms = (value) => {
  if (value == null || value === "") return null;
  const match = String(value).match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  const hour = Number(match[1]);
  if (Number.isNaN(hour) || hour > 23) return null;
  return `${String(hour).padStart(2, "0")}:${match[2]}:${match[3] || "00"}`;
};

const addMinutesToHms = (hms, minutes) => {
  if (!hms) return null;
  const [hour, min, sec] = hms.split(":").map(Number);
  let total = hour * 60 + min + Number(minutes || 0);
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const nextHour = Math.floor(total / 60);
  const nextMin = total % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMin).padStart(2, "0")}:${String(sec || 0).padStart(2, "0")}`;
};

const parseSlotStart = (slot) => {
  if (slot?.start_time) {
    return moment.tz(
      slot.start_time,
      ["HH:mm:ss", "HH:mm", "hh:mm A"],
      getDeliveryTimezone(),
    );
  }
  const label = slot?.slot_from_to || "";
  const match = label.match(/^(\d{1,2}:\d{2}\s*(?:am|pm))/i);
  if (!match) return null;
  return moment.tz(match[1], ["hh:mm A", "h:mm A", "HH:mm"], getDeliveryTimezone());
};

const parseSlotEnd = (slot) => {
  if (slot?.end_time) {
    return moment.tz(
      slot.end_time,
      ["HH:mm:ss", "HH:mm", "hh:mm A"],
      getDeliveryTimezone(),
    );
  }
  const label = slot?.slot_from_to || "";
  const match = label.match(/to\s+(\d{1,2}:\d{2}\s*(?:am|pm))/i);
  if (!match) return null;
  return moment.tz(match[1], ["hh:mm A", "h:mm A", "HH:mm"], getDeliveryTimezone());
};

const getCheckoutCutoff = () => {
  return moment()
    .tz(getDeliveryTimezone())
    .add(getCheckoutBufferMinutes(), "minutes");
};

const filterSlotsByCheckoutBuffer = (slots, isToday) => {
  if (!isToday || !Array.isArray(slots)) return slots || [];
  const cutoff = getCheckoutCutoff();
  return slots.filter((slot) => {
    const end = parseSlotEnd(slot);
    if (end && end.isValid()) return !end.isBefore(cutoff);
    const start = parseSlotStart(slot);
    return start && start.isValid() && !start.isBefore(cutoff);
  });
};

const nowHms = () => moment().tz(getDeliveryTimezone()).format("HH:mm:ss");

const filterSlotsByEndTime = (slots) => {
  if (!Array.isArray(slots)) return [];
  const cutoff = addMinutesToHms(nowHms(), getCheckoutBufferMinutes());
  return slots.filter((slot) => {
    const end = toHms(slot.end_time);
    return end && cutoff && end >= cutoff;
  });
};

const getSlotLookupHms = () => {
  const selectedTier = getSelectedDeliveryTier();
  const deliveryByLabel = selectedTier?.delivery_by;
  if (deliveryByLabel) {
    const deliveryBy = moment(
      deliveryByLabel,
      ["hh:mm A", "h:mm A", "HH:mm:ss", "HH:mm"],
      true,
    );
    if (deliveryBy.isValid()) {
      return addMinutesToHms(
        deliveryBy.format("HH:mm:ss"),
        getSlotLookupBufferMinutes(),
      );
    }
  }
  return addMinutesToHms(nowHms(), getCheckoutBufferMinutes());
};

const pickSlotForCutoff = (slots) => {
  if (!Array.isArray(slots) || !slots.length) return null;
  const isToday = selectedDummyDate.value === sevenDaysList.value[0];
  if (!isToday) {
    return slots[0];
  }

  const lookup = getSlotLookupHms();
  if (!lookup) return null;

  // WHERE lookup BETWEEN start_time AND end_time
  return (
    slots.find((slot) => {
      const start = toHms(slot.start_time);
      const end = toHms(slot.end_time);
      return start && end && lookup >= start && lookup <= end;
    }) || null
  );
};

watch(selectedDeliveryRate, (rateId) => {
  selectedTimeSlotForRate.value = null;
  timeSlotsForRate.value = [];
  if (rateId) {
    getTimeSlotsForRate();
  }
});

watch(selectedDummyDeliveryOption, (dtId) => {
  if (!dtId) return;
  if (selectedDummyDate.value !== sevenDaysList.value[0]) return;
  if (timeSlotsForRate.value.length) {
    const picked = pickSlotForCutoff(timeSlotsForRate.value);
    selectedTimeSlotForRate.value = picked ? picked.time_slot_id : null;
    return;
  }
  getTimeSlotsForRate();
});
const payLater = ref(false);
const havePaid = ref(false);
const confirmOrder = ref(false);
const confirmOrder2 = ref(false);
const isEmptyAddress = ref(false);
const isEmptyPayment = ref(false);
const acceptCash = ref(false);
const orderConfirmed = ref(false);
const addressIndex = ref(null);
const addressId = ref(null);
const addressName = ref(null);
const modalText = ref(null);
const isEditAddressForm = ref(false);
const addressID = ref("");
const step = ref(1);
const snackbar = ref(false);
const onlyDeliveryDialog = ref(false);
const message = ref({
  text: "",
  color: "success",
});
const addressDialog = ref(false);
const summaryDialog = ref(false);
const selectedDelivery = ref(
  // store.state.selectedDelivery ??
  //   (localStorage.getItem("selectedDelivery") !== null
  //     ? Number(localStorage.getItem("selectedDelivery"))
  //     : null),
  null,
);
const selectedPaymentMethod = ref(null);
const dialog = ref(false);
const paymentTypes = ref([]);
const paymentOptions = ref([
  // {
  //   value: 1,
  //   payment_name: "Cash",
  //   payment_desc: "Cash on Delivery",
  //   payment_image: cash,
  // },
]);
const paymentOptions2 = ref([
  // {
  //   value: 1,
  //   payment_name: "Cash",
  //   payment_desc: "Cash on Delivery",
  //   payment_image: cash,
  // },
]);
const search = ref("");
const searchResults = ref([]);
const isLoadingAddress = ref(false);
const isLoadingBiryaniRunAddress = ref(false);
let searchTimeout = null;

const toTitleCase = (str) => {
  if (!str || str === "NIL") return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
};

const formatAddressToTitleCase = (item) => {
  const blk = item.BLK_NO && item.BLK_NO !== "NIL" ? item.BLK_NO : "";
  const road = toTitleCase(item.ROAD_NAME);
  const building = toTitleCase(item.BUILDING);
  const postal = item.POSTAL && item.POSTAL !== "NIL" ? item.POSTAL : "";

  let formatted = [];

  // Baris 1: Blk No + Road Name
  const line1 = `${blk} ${road}`.trim();
  if (line1) formatted.push(line1);

  // Baris 2: Building
  if (building) formatted.push(building);

  // Baris 3: Singapore + Postal Code
  const line3 = `Singapore ${postal}`.trim();
  if (line3 !== "Singapore") formatted.push(line3);

  return formatted.join("\n");
};

const onAddressSelected = (selectedItem) => {
  if (selectedItem) {
    addressForm.full_address = formatAddressToTitleCase(selectedItem);
    addressForm.blk_no = selectedItem.BLK_NO;
    addressForm.street_name = toTitleCase(selectedItem.ROAD_NAME);
    addressForm.postal_code = selectedItem.POSTAL;
    addressForm.x_coordinate = selectedItem.X;
    addressForm.y_coordinate = selectedItem.Y;
    addressForm.latitude = selectedItem.LATITUDE;
    addressForm.longitude = selectedItem.LONGITUDE;

    if (selectedItem.BUILDING && selectedItem.BUILDING !== "NIL") {
      addressForm.building = toTitleCase(selectedItem.BUILDING);
    } else {
      addressForm.building = "";
    }
  }
};

watch(search, (newVal) => {
  if (!newVal || newVal.length < 3) {
    searchResults.value = [];
    return;
  }

  if (addressForm.full_address === newVal) {
    return;
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    isLoadingAddress.value = true;
    try {
      const response = await axios.get(`/get-one-map-address/${newVal}`);
      if (response.data && response.data.results) {
        searchResults.value = response.data.results;
      } else {
        searchResults.value = [];
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      searchResults.value = [];
    } finally {
      isLoadingAddress.value = false;
    }
  }, 500);
});
const addresses = ref([]);
const selectedAddress = ref(null);
const savingAddress = ref(false);
const addressExpanded = ref({});
const taxAmount = ref(null);
// const platformFee = ref(null);
const timeSlots = ref([]);
const isRestaurant = ref(false);
const restaurantDish = ref([]);

const activeCategory = ref("Biryani Menu");
const categories = ref([{ name: "Biryani Menu" }]);
const categoryDishes = ref([]);
const menuDishSearch = ref("");
const allCategoryDishesCache = ref({}); // mcId -> dishes[]
const menuItemsLoadTick = ref(0);

const selectedMoreCategoryLabel = computed(() => {
  const activeCat = categories.value.find(
    (cat) => cat.name === activeCategory.value,
  );
  if (!activeCat) return "More";
  const isVisible = categories.value
    .slice(0, 2)
    .some((cat) => cat.name === activeCategory.value);
  if (isVisible) return "More";
  return activeCat.count !== undefined
    ? `${activeCat.name} (${activeCat.count})`
    : activeCat.name;
});

const whatsIncludedDialog = ref(false);
const selectedPqDescription = ref("");

const openWhatsIncluded = (description) => {
  selectedPqDescription.value = description || "No description available.";
  whatsIncludedDialog.value = true;
};

const mapMenuCategoryItem = (item) => ({
  ...item,
  dish_image: item.main_image,
  pq_description: item.whats_included,
});

const getCategoryItems = async (restaurantId, mcId) => {
  try {
    const response = await axios.get(
      `/list-menu-rate-prices-items-to-add/${restaurantId}/${mcId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    const mapped = (response.data.data || []).map(mapMenuCategoryItem);
    categoryDishes.value = mapped;
    allCategoryDishesCache.value = {
      ...allCategoryDishesCache.value,
      [mcId]: mapped,
    };
    menuItemsLoadTick.value += 1;
  } catch (error) {
    console.error("Error fetching category items:", error);
  }
};

const ensureAllMenuItemsLoaded = async () => {
  const restaurantId = cart.value[0]?.restaurant_id;
  if (!restaurantId) return;

  const missing = categories.value.filter(
    (cat) => cat.mcId && !allCategoryDishesCache.value[cat.mcId],
  );
  if (!missing.length) return;

  await Promise.all(
    missing.map(async (cat) => {
      try {
        const response = await axios.get(
          `/list-menu-rate-prices-items-to-add/${restaurantId}/${cat.mcId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        );
        allCategoryDishesCache.value = {
          ...allCategoryDishesCache.value,
          [cat.mcId]: (response.data.data || []).map(mapMenuCategoryItem),
        };
      } catch (error) {
        console.error(
          `Error fetching items for category ${cat.name}:`,
          error,
        );
      }
    }),
  );
  menuItemsLoadTick.value += 1;
};

watch(activeCategory, (newCategory) => {
  menuDishSearch.value = "";
  if (newCategory !== "Biryani Menu") {
    const category = categories.value.find((c) => c.name === newCategory);
    if (category && category.mcId) {
      getCategoryItems(cart.value[0]?.restaurant_id, category.mcId);
    }
  }
});

watch(menuDishSearch, (query) => {
  if (query && query.trim()) {
    ensureAllMenuItemsLoaded();
  }
});

const dishMatchesSearch = (dish, query) => {
  if (!query) return true;
  const dishName = (dish.dish_name || "").toLowerCase();
  const actualName = (dish.actual_dish_name || "").toLowerCase();
  return dishName.includes(query) || actualName.includes(query);
};

const sortDishesByCart = (list) =>
  [...list].sort((a, b) => {
    const inCartA = cart.value.some((item) =>
      a?.mrp_id
        ? item.mrp_id === a.mrp_id
        : item.brp_id === a.brp_id && !item.mrp_id,
    );
    const inCartB = cart.value.some((item) =>
      b?.mrp_id
        ? item.mrp_id === b.mrp_id
        : item.brp_id === b.brp_id && !item.mrp_id,
    );
    if (inCartA && !inCartB) return -1;
    if (!inCartA && inCartB) return 1;
    return 0;
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
  return String(name)
    .replace(/\s*Menu\s*$/i, "")
    .trim();
};

// Browse = selected category only; Search = all menu categories with headers
const menuDisplayRows = computed(() => {
  menuItemsLoadTick.value; // depend on cache loads
  const query = menuDishSearch.value.trim().toLowerCase();
  const rows = [];

  if (query) {
    const biryaniMatches = sortDishesByCart(
      getBiryaniMenuDishes().filter((dish) => dishMatchesSearch(dish, query)),
    );
    if (biryaniMatches.length) {
      rows.push({
        isHeader: true,
        category: "Biryani",
        product: null,
        key: "header-Biryani",
      });
      biryaniMatches.forEach((product, index) => {
        rows.push({
          isHeader: false,
          category: "Biryani",
          product,
          key: `Biryani-${product.brp_id || product.mrp_id || index}`,
        });
      });
    }

    categories.value.forEach((cat) => {
      if (!cat.mcId) return;
      const label = formatMenuCategoryLabel(cat.name) || cat.name;
      // Avoid duplicate Biryani section if a menu category is also named Biryani
      if (label.toLowerCase() === "biryani") return;

      const matches = sortDishesByCart(
        (allCategoryDishesCache.value[cat.mcId] || []).filter((dish) =>
          dishMatchesSearch(dish, query),
        ),
      );
      if (!matches.length) return;

      rows.push({
        isHeader: true,
        category: label,
        product: null,
        key: `header-${label}-${cat.mcId}`,
      });
      matches.forEach((product, index) => {
        rows.push({
          isHeader: false,
          category: label,
          product,
          key: `${cat.mcId}-${product.brp_id || product.mrp_id || index}`,
        });
      });
    });

    return rows;
  }

  let result = [];
  if (activeCategory.value === "Biryani Menu") {
    result = getBiryaniMenuDishes();
  } else {
    result = categoryDishes.value;
  }

  return sortDishesByCart(result).map((product, index) => ({
    isHeader: false,
    category: null,
    product,
    key: `browse-${product.brp_id || product.mrp_id || index}`,
  }));
});

const filteredRestaurantDish = computed(() =>
  menuDisplayRows.value
    .filter((row) => !row.isHeader && row.product)
    .map((row) => row.product),
);

const addressForm = reactive({
  full_address: "",
  location_name: "",
  dwelling_id: null,
  unit: "",
  lift_lobby: "",
  country_id: 1,
  city_id: 1,
  blk_no: "",
  building: "",
  postal_code: "",
  street_name: "",
  x_coordinate: "",
  y_coordinate: "",
  latitude: "",
  longitude: "",
});

const dwellingTypes = ref([]);
const locationNames = ref([]);

const selectedDwellingName = computed(() => {
  const activeDwelling = dwellingTypes.value.find(
    (d) => d.dwelling_id === addressForm.dwelling_id,
  );
  if (!activeDwelling) return "More";
  const isFirstThree = dwellingTypes.value
    .slice(0, 3)
    .some((d) => d.dwelling_id === addressForm.dwelling_id);
  return isFirstThree ? "More" : activeDwelling.dwelling_name;
});

watch(
  () => addressForm.dwelling_id,
  (newVal) => {
    if (newVal === 1 || newVal === 2) {
      if (!addressForm.unit) {
        addressForm.unit = "#";
      }
    } else {
      if (addressForm.unit === "#") {
        addressForm.unit = "";
      }
    }

    const activeDwelling = dwellingTypes.value.find(
      (d) => d.dwelling_id === newVal,
    );
    if (
      activeDwelling &&
      (activeDwelling.dwelling_name.toUpperCase() === "HDB" ||
        activeDwelling.dwelling_name.toUpperCase() === "CONDO")
    ) {
      if (addressForm.full_address) {
        let lines = addressForm.full_address.split("\n");
        if (lines.length > 0 && !lines[0].startsWith("Block ")) {
          lines[0] = "Block " + lines[0];
          addressForm.full_address = lines.join("\n");
        }
      }
    } else {
      if (addressForm.full_address) {
        let lines = addressForm.full_address.split("\n");
        if (lines.length > 0 && lines[0].startsWith("Block ")) {
          lines[0] = lines[0].substring(6);
          addressForm.full_address = lines.join("\n");
        }
      }
    }
  },
);

watch(addressDialog, async (isOpen) => {
  if (isOpen) {
    if (dwellingTypes.value.length === 0) {
      try {
        const response = await axios.get("/list-dwelling-master");
        if (response.data && response.data.data) {
          dwellingTypes.value = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching dwelling master:", error);
      }
    }

    if (locationNames.value.length === 0) {
      try {
        const response = await axios.get("/list-location-name");
        if (response.data && response.data.data) {
          locationNames.value = response.data.data.map(
            (item) => item.location_name,
          );
        }
      } catch (error) {
        console.error("Error fetching location names:", error);
      }
    }
  }
});
const selectedDate = ref(null);
const selectedTimeSlot = ref(null);
const deliveryScheduleInstruction = ref(null);

const orders = ref([]);

const isSmall = computed(() => {
  return window.innerWidth < 600;
});

const addressesOptions = computed(() => {
  return addresses.value.map((address) => ({
    value: address.ga_id,
    full_address: address.full_address,
    // main_address: address.main_address,
    // landmark: address.landmark,
    location_name: address.location_name,
    primary_address: address.primary_address,
    unit_number: address.unit_number,
    building_no: address.building_no,
    building_name: address.building_name,
  }));
});

const isLoading = computed(() => {
  return store.state.isLoading;
});

const isEmptyCart = computed(() => {
  return store.state.isEmptyCart;
});

const isSameDelivery = computed(() => {
  return localStorage.getItem("isSameDelivery");
});

const userEmail = computed(() => {
  return store.state.userEmail || localStorage.getItem("email");
});

const selectedCountry = computed(() => {
  return store.state.selectedCountry;
});

const formattedDeliveryDate = computed(() => {
  const item = cart.value?.[0];
  if (!item) return "";
  const day = item.delivery_day;
  const date = item.delivery_date;
  if (day && date) return `${day}, ${date}`;
  return date || "";
});

const formattedTimeSlot = computed(() => {
  const item = cart.value?.[0];
  if (!item) return "";
  if (item.time_slot) return item.time_slot;
  if (item.delivery_by) {
    const by = moment(item.delivery_by, ["HH:mm:ss", "hh:mm A", "h:mm A"], true);
    return by.isValid() ? `By ${by.format("hh:mm A")}` : `By ${item.delivery_by}`;
  }
  const selectedSlot = timeSlotsForRate.value.find(
    (slot) => slot.time_slot_id === selectedTimeSlotForRate.value,
  );
  return selectedSlot?.slot_from_to || "";
});

const deliveryOptions = computed(() => {
  return store.state.deliveryCharges.map((item) => {
    return {
      ...item,
      allowedDays: allDays.filter((day) => !item.allowed_days.includes(day)),
    };
  });
});

// const deliveryOptions = ref([
//   { label: "Standard Delivery Fee", value: "standard", price: 12.0 },
//   { label: "Express (1.5 Hours)", value: "express", price: 15.0 },
//   { label: "Super Express (3 Hours)", value: "super_express", price: 25.0 },
// ]);
const selectedDeliveryPrice = computed(() => {
  const option = deliveryOptions.value.find(
    (opt) => opt.value === selectedDelivery.value,
  );
  return option ? option.price : 0;
});

const selectedDeliveryId = computed(() => {
  const option = deliveryOptions.value.find(
    (opt) => opt.value === selectedDelivery.value,
  );
  return option ? option.id : 0;
});

const selectedDeliveryObject = computed(() => {
  const option = deliveryOptions.value.find(
    (opt) => opt.value === selectedDelivery.value,
  );
  return option;
});

// Get cart items
const detailsCart = computed(() => {
  return store.state.detailsCart;
});

// Get total quantity of all cart items
const cartQuantity = computed(() =>
  store.state.cart.reduce((total, item) => total + item.quantity, 0),
);

const subTotal = computed(() =>
  store.state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  ),
);

const finalCartTotal = computed(() => {
  const sub = Number(subTotal.value) || 0;
  const delivery = Number(selectedDeliveryPrice.value) || 0;
  const platform = Number(cart.value[0]?.platform_fee) || 0;
  const tax = Number(taxAmount.value) || 0;
  let serviceFee = 0;
  if (cart.value && cart.value.length > 0) {
    serviceFee = Number(cart.value[0]?.service_fee) || 0;
  }
  const result = cart.value[0]?.final_amount
    ? cart.value[0]?.final_amount
    : (
        sub +
        delivery +
        platform +
        serviceFee +
        ((sub + delivery + 0.5) * tax) / 100
      ).toFixed(2);
  return result;
});

// Get cart items
const cart = computed(() => {
  return store.state.cart;
});

const isRestaurant24Hrs = computed(() => {
  const value = cart.value?.[0]?.["24_hrs"];
  return value === "Y" || value === "y" || value === 1 || value === true;
});

const restaurantOpenStatus = computed(() => {
  if (isRestaurant24Hrs.value) return "open"; // 24 Hrs counts as open
  const value = cart.value?.[0]?.is_open_now;
  if (value === true || value === 1 || value === "1") return "open";
  if (value === false || value === 0 || value === "0") return "closed";
  return null;
});

const nowTick = ref(Date.now());

const restaurantTimeLeftLabel = computed(() => {
  nowTick.value; // reactive refresh with system clock (every second)
  if (isRestaurant24Hrs.value) return "";
  if (restaurantOpenStatus.value !== "open") {
    return "";
  }

  const opening = cart.value?.[0]?.opening_time;
  const lastOrder =
    cart.value?.[0]?.last_order_time || cart.value?.[0]?.closing_time;
  if (!lastOrder) {
    return cart.value?.[0]?.time_left?.countdown || "";
  }

  const now = moment().tz(getDeliveryTimezone());
  const current = now.format("HH:mm:ss");
  let deadline = moment.tz(
    `${now.format("YYYY-MM-DD")} ${lastOrder}`,
    "YYYY-MM-DD HH:mm:ss",
    getDeliveryTimezone(),
  );

  // Overnight: last order is next day when current is after opening
  if (opening && opening > lastOrder && current >= opening) {
    deadline = deadline.add(1, "day");
  }

  let secondsLeft = deadline.diff(now, "seconds");
  if (secondsLeft < 0) secondsLeft = 0;

  const hours = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
});

const restaurantClosesInLabel = computed(() => {
  nowTick.value;
  if (isRestaurant24Hrs.value) return "";
  if (restaurantOpenStatus.value !== "open") return "";

  const countdown = restaurantTimeLeftLabel.value;
  if (!countdown) return "";
  const parts = countdown.split(":").map((part) => Number(part));
  const hours = parts[0] || 0;
  const mins = parts[1] || 0;
  if (hours <= 0 && mins <= 0) return "";
  if (hours >= 1 && mins === 0) {
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }
  if (hours >= 1) {
    return `${hours} hr${hours === 1 ? "" : "s"} ${mins} min`;
  }
  return `${mins} min`;
});

const currentHourDisplay = computed(() => {
  nowTick.value;
  return moment().tz(getDeliveryTimezone()).format("hh:mm:ss A");
});

const acceptingCurrentPreOrders = computed(() => {
  const value = cart.value?.[0]?.accepting_current_pre_orders;
  return value === true || value === "Y" || value === 1 || value === "1";
});

const acceptingOrdersLabel = computed(() => {
  if (!acceptingCurrentPreOrders.value) return null;
  if (restaurantOpenStatus.value === "closed") {
    return {
      color: "#2e7d32",
      text: "Accepting Pre-Orders",
    };
  }
  // Open (or 24 Hrs): single line
  return {
    color: "#d32f2f",
    text: "Accepting Current & Pre-Orders",
  };
});

const restaurantPromoMessage = computed(() => {
  const message = cart.value?.[0]?.promo_message;
  return message ? String(message).trim() : "";
});

const formatRestaurantTime = (timeValue) => {
  if (!timeValue) return "";
  const parsed = moment(timeValue, ["HH:mm:ss", "HH:mm"], true);
  if (!parsed.isValid()) return "";
  // Match mock: "10 : 30 am"
  return parsed.format("h : mm a");
};

const restaurantOperatingHoursLabel = computed(() => {
  if (isRestaurant24Hrs.value) {
    const closedOn = cart.value?.[0]?.closed_on;
    return closedOn ? `24 Hours | ${closedOn} Closed` : "24 Hours";
  }

  const opening = formatRestaurantTime(cart.value?.[0]?.opening_time);
  const closing = formatRestaurantTime(cart.value?.[0]?.closing_time);
  if (!opening || !closing) return "";

  const closedOn = cart.value?.[0]?.closed_on;
  let label = `${opening} to ${closing}`;
  if (closedOn) {
    label += ` | ${closedOn} Closed`;
  }
  return label;
});

const promoExpanded = ref(false);
const menuPromoExpanded = ref(false);
const promoMessageRef = ref(null);
const showPromoMore = ref(false);

const checkPromoOverflow = async () => {
  await nextTick();
  const el = promoMessageRef.value;
  if (!el || !restaurantPromoMessage.value) {
    showPromoMore.value = false;
    return;
  }
  // Temporarily clamp to measure overflow against 2 lines
  const wasExpanded = promoExpanded.value;
  if (wasExpanded) {
    el.classList.add("promo-message-clamped");
  }
  showPromoMore.value = el.scrollHeight > el.clientHeight + 1;
  if (wasExpanded) {
    el.classList.remove("promo-message-clamped");
  }
};

watch(
  () => restaurantPromoMessage.value,
  () => {
    promoExpanded.value = false;
    menuPromoExpanded.value = false;
    checkPromoOverflow();
  },
  { immediate: true },
);

watch(
  () => props.viewCart,
  (open) => {
    if (open) {
      checkPromoOverflow();
    }
  },
);

const flatGroupedCart = computed(() => {
  const result = [];
  const categoryGroups = {};

  if (!cart.value) return [];

  const mcgKey = (item) =>
    item.mcg_id != null && item.mcg_id !== ""
      ? Number(item.mcg_id)
      : Number.MAX_SAFE_INTEGER;

  cart.value.forEach((item) => {
    const isBiryani =
      !item.menu_category || item.menu_category === "Biryani Menu";
    const category = isBiryani ? "__biryani__" : item.menu_category;

    if (!categoryGroups[category]) {
      categoryGroups[category] = {
        mcgId: mcgKey(item),
        items: [],
        isBiryani,
        name: isBiryani ? null : item.menu_category,
      };
    }
    categoryGroups[category].items.push(item);
    if (item.mcg_id != null && item.mcg_id !== "") {
      categoryGroups[category].mcgId = Math.min(
        categoryGroups[category].mcgId,
        Number(item.mcg_id),
      );
    }
  });

  Object.values(categoryGroups)
    .sort((a, b) => a.mcgId - b.mcgId)
    .forEach((group) => {
      if (!group.isBiryani) {
        result.push({
          isHeader: true,
          category: group.name,
          key: `header-${group.name}`,
        });
      }
      group.items.forEach((item) => {
        result.push({
          isHeader: false,
          product: item,
          key: `item-${item.cart_id || item.mrp_id || item.dish_id}-${item.brp_id || ""}-${item.brp_id_2 || ""}`,
        });
      });
    });

  return result;
});

const isInCart2 = (product) => {
  return cart.value.some((item) => {
    if (product?.mrp_id) {
      return item.mrp_id === product.mrp_id;
    }
    return item.brp_id === product.brp_id && !item.mrp_id;
  });
};

const addToCartData = (data) => {
  // Route by item type (not active tab). Search mixes biryani + menu
  // categories; mrp_id items must hit add-to-cart-menu-rate-price.
  if (data?.mrp_id) {
    addToCartMenuRatePrice(data);
  } else {
    addToCart(data);
  }
};

const format = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const tomorrow = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
});

const parse = (dateStr) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day); // month is 0-based
};

const cancelDate = () => {
  selectedDate.value = null;
  dialog.value = false;
};

const confirmDate = () => {
  dialog.value = false;
};

// const onDateSelected = (newDate) => {
//   const day = newDate.getDate();
//   const month = newDate.getMonth() + 1;
//   const year = newDate.getFullYear();

//   selectedDate.value = `${day}/${month}/${year}`;
//   // console.log(`${day}/${month}/${year}`);
// };

const formatInfo = (info) => {
  return info.replace(/\n/g, "<br>");
};

const getDeliveryCharges = () => {
  store.dispatch(
    "getDeliveryCharges",
    selectedCountry.value ? selectedCountry.value.country_id : 1,
  );
};

const openAddressDialog = () => {
  resetForm();
  addressDialog.value = true;
};

const resetForm = () => {
  // addressForm.main_address = "";
  addressForm.full_address = "";
  addressForm.unit = "";
  addressForm.building = "";
  addressForm.dwelling_id = null;
  addressForm.lift_lobby = "";
  // addressForm.postal_code = "";
  // addressForm.town = "";
  // addressForm.city = "";
  // addressForm.country = "";
  // addressForm.condo_name = "";
  // addressForm.landmark = "";
  addressForm.location_name = "---Select Location Name---";
  search.value = "";
};

// const formatCurrency = (amount) =>
//   new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(amount);

const handleClearCart = async () => {
  try {
    await store.dispatch("clearCart");
    emit("update:viewCart", false);
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

// Remove item from cart
const handleRemoveFromCart = (product) => {
  const data = {
    cart_id: cart.value[0]?.cart_id,
  };

  if (product?.mrp_id) {
    // Jika item adalah dari Category Dishes
    data.is_mrp = true;
    data.mrp_id = product.mrp_id;
  } else {
    // Jika item adalah Biryani Menu (default lama)
    data.is_mrp = false;
    data.brp_id = product?.brp_id;
    if (product?.brp_id_2) {
      data.brp_id_2 = product?.brp_id_2;
    }
  }

  store.dispatch("removeFromCart", data);
};

const handleUpdateQuantity = (product, change) => {
  const data = {
    cart_id: cart.value[0]?.cart_id,
    change: change,
  };

  if (product?.mrp_id) {
    // Jika item adalah Category Dishes
    data.is_mrp = true;
    data.mrp_id = product.mrp_id;
  } else {
    // Jika item adalah Biryani Menu
    data.is_mrp = false;
    data.brp_id = product?.brp_id;
    if (product?.brp_id_2) {
      data.brp_id_2 = product?.brp_id_2;
    }
  }

  store.dispatch("updateCart", data);
};

const onSelectDelivery = (selectedId) => {
  try {
    const selectedOption = deliveryOptions.value.find(
      (opt) => opt.dc_id === selectedId,
    );
    if (selectedOption) {
      const payload = {
        cart_id: cart.value[0]?.cart_id,
        dc_id: selectedOption.dc_id,
        delivery_rate: selectedOption.price,
        same_day: selectedOption.same_day,
      };
      store.dispatch("updateDeliveryChargesInCart", payload);
      // console.log("Delivery option deliveryOptions:", payload);
    }
  } catch (error) {
    console.error("Error saving delivery option:", error);
  }
};

const getRestaurantDish = async (restaurantId) => {
  try {
    const response = await axios.get(
      `/list-biryani-run-items-to-add/${restaurantId}/${selectedCountry.value ? selectedCountry.value.city_id : 1}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    const data = response.data.data;
    restaurantDish.value = data;
  } catch (error) {
    console.error(error);
  }
};

const getMenuCategories = async (restaurantId) => {
  if (!restaurantId) return;
  try {
    const response = await axios.get(
      `/list-menu-rate-prices-menu-categories/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
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
        const aId =
          a.mcgId != null && a.mcgId !== ""
            ? Number(a.mcgId)
            : Number.MAX_SAFE_INTEGER;
        const bId =
          b.mcgId != null && b.mcgId !== ""
            ? Number(b.mcgId)
            : Number.MAX_SAFE_INTEGER;
        return aId - bId;
      });
    }
    categories.value = [biryaniCategory, ...otherCategories];
    // Preload all category dishes so search can show every menu with headers
    ensureAllMenuItemsLoaded();
  } catch (error) {
    console.error("Error fetching menu categories:", error);
  }
};

const onSelectPayment = async (selectedId) => {
  // console.log(selectedId);
  console.log(cart.value);
  try {
    const response = await axios.put(
      `/update-cart-payment-type`,
      {
        cart_id: cart.value[0]?.cart_id,
        payment_type_id: selectedId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // getAddress();
    const data = response.data.data;
    // console.log(data);
    selectedPaymentMethod.value = data.payment_type_id;
    if (data.payment_type_id == 1) {
      acceptCash.value = true;
    }
    // console.log(selectedAddress.value);
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    console.log(error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
  // finally {
  //   savingAddress.value = false;
  // }
};

const showInformationModal = (title, description) => {
  informationModalTitle.value = title;
  informationModalContent.value = description;
  informationModal.value = true;
};

// Open Confirmation Modal
const handleOpenDialog = (option, index) => {
  addressIndex.value = index;
  addressId.value = option.value;
  addressName.value = option.location_name;
  modalText.value = `Do you surely want to delete the address "${addressName.value}"?`;
  openDialog.value = true;
};

// Delete address from the DB & the list
const handleDeleteAddress = async () => {
  const response = await axios.delete("/delete-address/" + addressId.value, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  getAddress();
  snackbar.value = true;
  message.value = {
    text: response.data.message,
    color: "success",
  };
  addresses.value.splice(addressIndex.value, 1);
  openDialog.value = false;
};

const handlePayLater = async () => {
  try {
    const response = await axios.put(
      `/update-cart-status`,
      {
        cart_id: cart.value[0].cart_id,
        order_status: "CPP",
        payment_status: "PP",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // const data = response.data.data;
    // console.log(data);
    payLater.value = false;
    emit("update:viewCart", false);
    getCartData();
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
};
const handleHavePaid = async () => {
  try {
    const response = await axios.put(
      `/update-cart-status`,
      {
        cart_id: cart.value[0].cart_id,
        order_status: "CPP",
        payment_status: "PP",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // const data = response.data.data;
    // console.log(data);
    havePaid.value = false;
    emit("update:viewCart", false);
    getCartData();
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
};

const handleAcceptCash = async () => {
  acceptCash.value = false;
  orderConfirmed.value = true;
};
const handleOrderConfirmed = async () => {
  try {
    const response = await axios.put(
      `/update-cart-status`,
      {
        cart_id: cart.value[0].cart_id,
        order_status: "CPP",
        payment_status: "PP",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // const data = response.data.data;
    // console.log(data);
    orderConfirmed.value = false;
    emit("update:viewCart", false);
    getCartData();
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
};

// Edit Address
const handleEditLocation = async (address_id) => {
  isEditAddressForm.value = true;
  addressID.value = address_id;
  axios
    .get("/get-address/" + address_id)
    .then((response) => {
      let formData = response.data.data;
      // (addressForm.main_address = formData.address_master?.street_address),
      (addressForm.full_address = formData.full_address),
        (addressForm.unit = formData.unit_number),
        // (addressForm.postal_code = formData.address_master?.postal_code),
        // (addressForm.town = formData.address_master?.town.town_name),
        // (addressForm.city = formData.address_master?.city.city_name),
        // (addressForm.country = formData.address_master?.country.country_name),
        // (addressForm.condo_name = formData?.condo_name || ""),
        // (addressForm.landmark = formData.landmark),
        (addressForm.location_name = formData.location_name);
      addressForm.lift_lobby = formData.lift_lobby;
      addressForm.dwelling_id = formData?.address_master?.dwelling_id;
      addressForm.building = formData?.address_master?.condo_name;
      addressForm.city_id = formData?.address_master?.city_id;
      addressForm.country_id = formData?.address_master?.country_id;
      addressForm.blk_no = formData?.address_master?.building_no;

      addressForm.street_name = formData?.street_name;
      addressForm.postal_code = formData?.address_master?.postal_code;
      addressForm.x_coordinate = formData?.address_master?.x_coordinate;
      addressForm.y_coordinate = formData?.address_master?.y_coordinate;
      addressForm.latitude = formData?.address_master?.latitude;
      addressForm.longitude = formData?.address_master?.longitude;

      addressDialog.value = true;
    })
    .catch((error) => {
      console.error(error);
    });
};

const whereToDeliver = async () => {
  try {
    const response = await axios.put(
      `/update-delivery-schedule-in-cart`,
      {
        cart_id: cart.value[0].cart_id,
        dc_id: selectedDeliveryObject.value.dc_id,
        delivery_date:
          selectedDeliveryObject.value.same_day == "A" && selectedDate.value
            ? format(selectedDate.value)
            : selectedDeliveryObject.value.today_date,
        // delivery_day: selectedDeliveryObject.value.today_day,
        same_day: selectedDeliveryObject.value.same_day,
        time_slot:
          selectedDeliveryObject.value.same_day == "A"
            ? selectedTimeSlot.value
            : selectedDeliveryObject.value.time_slot,
        order_instructions: deliveryScheduleInstruction.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // const data = response.data.data;
    // console.log(data);
    nextStep(4);
    getCartData();
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    console.log(error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
};

const updateCartOrderStatus = async () => {
  try {
    const response = await axios.put(
      `/update-cart-order-status`,
      {
        cart_id: cart.value[0].cart_id,
        order_status: "C",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // const data = response.data.data;
    // console.log(data);
    confirmOrder2.value = false;
    nextStep(5);
    getCartData();
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
};

const cancelOrder = async () => {
  try {
    const response = await axios.post(
      `/remove-order`,
      {
        cart_id: cart.value[0].cart_id,
        app_id: 7,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // const data = response.data.data;
    // console.log(data);
    getCartData();
    cancelOrderDialog.value = false;
    emit("update:viewCart", false);
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
};

const nextStep = async (value) => {
  if (value === 7) {
    snackbar.value = false;
    message.value = {
      text: "",
      color: "success",
    };

    if (!selectedPaymentMethod.value) {
      isEmptyPayment.value = true;

      return;
    } else if (selectedPaymentMethod.value == 1) {
      return;
    } else {
      getPaymentOrder();
      // getPaymentTypes();
      // getOrder();
    }
  } else if (value === 5) {
    snackbar.value = false;
    message.value = {
      text: "",
      color: "success",
    };
    await getPaymentTypes();
  } else if (value === 6) {
    snackbar.value = false;
    message.value = {
      text: "",
      color: "success",
    };
    if (!selectedPaymentMethod.value) {
      isEmptyPayment.value = true;
      return;
    }
    if (selectedPaymentMethod.value == 1) {
      return;
    }
    await getPaymentOrder();
  } else if (value == 4) {
    snackbar.value = false;
    message.value = {
      text: "",
      color: "success",
    };
    console.log(selectedDelivery.value, cart.value[0]?.dc_id);

    if (authToken == "null") {
      store.commit("setIsNotLoggedIn", true);

      return;
    }

    const isToday = selectedDummyDate.value === sevenDaysList.value[0];
    if (isToday && !selectedDummyDeliveryOption.value) {
      snackbar.value = true;
      message.value = {
        text: "Please select a delivery option",
        color: "error",
      };
      return;
    }
    if (!isToday && !selectedTimeSlotForRate.value) {
      snackbar.value = true;
      message.value = {
        text: "Please select a time slot",
        color: "error",
      };
      return;
    }

    const saved = await updateCartDeliveryInfo();
    if (!saved) {
      return;
    }

    if (selectedDelivery.value != cart.value[0]?.dc_id) {
      console.log("execute");
      selectedDate.value = null;
      selectedTimeSlot.value = null;
      deliveryScheduleInstruction.value = null;
    }
  } else if (value == 3) {
    if (addresses.value.length == 0) {
      isEmptyAddress.value = true;

      return;
    } else if (!selectedAddress.value) {
      snackbar.value = true;
      message.value = {
        text: "You must select address",
        color: "error",
      };
      return;
    }
    await initializeStep3Delivery();
  }
  step.value = value;
};

const toggleAddressDetails = (ga_id) => {
  if (
    Object.keys(addressExpanded.value).find(
      (key) => addressExpanded.value[key] === true,
    ) != ga_id
  ) {
    addressExpanded.value[
      Object.keys(addressExpanded.value).find(
        (key) => addressExpanded.value[key] === true,
      )
    ] = false; // close other opened details
  }
  addressExpanded.value[ga_id] = !addressExpanded.value[ga_id]; // Toggle true/false
};

const biryaniRunAddresses = ref([]);
const filteredAddress = computed(() => {
  return (
    biryaniRunAddresses.value.find(
      (item) => item.ga_id === selectedAddress.value,
    ) || null
  );
});

const extraRateInfo = ref(null);
const peakNonPeakInfo = ref(null);

const fetchExtraPerKmRate = async (distance) => {
  if (!distance) return;
  try {
    const response = await axios.get(`/get-extra-per-km-rate/${distance}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    extraRateInfo.value = response.data?.data;
  } catch (error) {
    console.error("Error fetching extra per km rate:", error);
  }
};

const fetchPeakNonPeakInfo = async (restaurantId) => {
  try {
    const response = await axios.get(
      `/get-peak-non-peak-info/${restaurantId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    peakNonPeakInfo.value = response.data?.data;
    if (selectedDummyDate.value === sevenDaysList.value[0]) {
      await getTimeSlotsForRate();
    }
  } catch (error) {
    console.error("Error fetching peak non peak info:", error);
  }
};

const initializeStep3Delivery = async () => {
  const restaurantId = cart.value[0]?.restaurant_id;
  selectedDummyDate.value = moment()
    .tz(getDeliveryTimezone())
    .format("ddd DD");
  selectedDeliveryRate.value = null;
  selectedTimeSlotForRate.value = null;
  selectedDummyDeliveryOption.value = null;
  timeSlotsForRate.value = [];

  await Promise.all([
    getDeliveryTiers(restaurantId),
    getDeliveryRates(),
    getBiryaniRunAddress(),
  ]);

  if (restaurantId && filteredAddress.value?.distance) {
    await fetchPeakNonPeakInfo(restaurantId);
  }

  selectDefaultDeliveryTier();

  if (selectedDummyDate.value === sevenDaysList.value[0]) {
    await getTimeSlotsForRate();
  }
};

const updateCartDeliveryInfo = async () => {
  if (!cart.value[0]?.cart_id) return false;

  const isToday = selectedDummyDate.value === sevenDaysList.value[0];
  if (isToday && !selectedDummyDeliveryOption.value) return false;
  if (!isToday && !selectedTimeSlotForRate.value) return false;

  try {
    const index = sevenDaysList.value.findIndex(
      (d) => d === selectedDummyDate.value,
    );
    const formattedDate = moment()
      .tz(getDeliveryTimezone())
      .add(index !== -1 ? index : 0, "days")
      .format("DD/MM/YYYY");

    const payload = {
      cart_id: cart.value[0]?.cart_id,
      total_distance: filteredAddress.value?.distance
        ? Number(filteredAddress.value.distance)
        : 0,
      delivery_date: formattedDate,
    };

    if (isToday) {
      payload.dt_id = selectedDummyDeliveryOption.value;
      if (selectedTimeSlotForRate.value) {
        payload.time_slot_id = selectedTimeSlotForRate.value;
        const selectedSlot = timeSlotsForRate.value.find(
          (slot) => slot.time_slot_id === selectedTimeSlotForRate.value,
        );
        if (selectedSlot?.slot_from_to) {
          payload.time_slot = selectedSlot.slot_from_to;
        }
      }
    } else {
      payload.time_slot_id = selectedTimeSlotForRate.value;
      payload.dr_id = selectedDeliveryRate.value;
      const selectedSlot = timeSlotsForRate.value.find(
        (slot) => slot.time_slot_id === selectedTimeSlotForRate.value,
      );
      if (selectedSlot?.slot_from_to) {
        payload.time_slot = selectedSlot.slot_from_to;
      }
    }

    const response = await axios.post(
      "/update-cart-master-delivery-info",
      payload,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    console.log(response.data.message);
    await getCartData();
    return true;
  } catch (error) {
    console.error("Error updating cart master delivery info:", error);
    snackbar.value = true;
    message.value = {
      text: "Failed to update delivery info",
      color: "error",
    };
    return false;
  }
};

watch(
  [selectedDummyDeliveryOption, selectedDummyDate, selectedTimeSlotForRate],
  () => {
    updateCartDeliveryInfo();
  },
);

watch(step, (newStep) => {
  if (newStep === 3) {
    selectedDummyDate.value = moment().tz(getDeliveryTimezone()).format("ddd DD");
    selectedDeliveryRate.value = null;
  }
});

watch(selectedDummyDate, () => {
  selectedDeliveryRate.value = null;
  selectedTimeSlotForRate.value = null;
  timeSlotsForRate.value = [];
  if (selectedDummyDate.value === sevenDaysList.value[0]) {
    getTimeSlotsForRate();
  }
});

const getCalculatedDeliveryPrice = (dt_id) => {
  if (!peakNonPeakInfo.value || !peakNonPeakInfo.value.delivery_tiers) {
    return "0.00";
  }
  const tierData = peakNonPeakInfo.value.delivery_tiers.find(
    (t) => t.dt_id === dt_id,
  );
  if (tierData) {
    const totalCharges = parseFloat(tierData.total_delivery_charges || 0);
    const nonStackFee = parseFloat(tierData.non_stack_fee || 0);
    return (totalCharges + nonStackFee).toFixed(2);
  }
  return "0.00";
};

const getNonStackFee = (dt_id) => {
  if (!peakNonPeakInfo.value || !peakNonPeakInfo.value.delivery_tiers) {
    return "0.00";
  }
  const tierData = peakNonPeakInfo.value.delivery_tiers.find(
    (t) => t.dt_id === dt_id,
  );
  if (tierData) {
    const nonStackFee = parseFloat(tierData.non_stack_fee || 0);
    return nonStackFee.toFixed(2);
  }
  return "0.00";
};

watch(
  filteredAddress,
  (newAddress) => {
    if (newAddress && newAddress.distance) {
      fetchExtraPerKmRate(newAddress.distance);
      fetchPeakNonPeakInfo(cart.value[0]?.restaurant_id);
      if (
        selectedDummyDate.value === sevenDaysList.value[0] ||
        selectedDeliveryRate.value
      ) {
        getTimeSlotsForRate();
      }
    }
  },
  { immediate: true },
);

const getBiryaniRunAddress = async () => {
  isLoadingBiryaniRunAddress.value = true;
  try {
    const restaurantId = cart.value[0]?.restaurant_id;
    if (!restaurantId) return;

    const headers = { Authorization: `Bearer ${authToken}` };
    let data = null;

    try {
      const drivingResponse = await axios.get(
        `/get-address-biryani-run-driving/${restaurantId}`,
        { headers },
      );
      data = drivingResponse.data?.data;
    } catch (drivingError) {
      // Production may not have the new route yet — keep cart usable
      console.warn(
        "Driving distance API unavailable, falling back to straight-line distance",
        drivingError,
      );
      const fallbackResponse = await axios.get(
        `/get-address-biryani-run/${restaurantId}`,
        { headers },
      );
      data = fallbackResponse.data?.data;
    }

    biryaniRunAddresses.value = Array.isArray(data) ? data : [];
    if (
      selectedDummyDate.value === sevenDaysList.value[0] ||
      selectedDeliveryRate.value
    ) {
      getTimeSlotsForRate();
    } else {
      updateCartDeliveryInfo();
    }
  } catch (error) {
    console.error("Error fetching biryani run addresses:", error);
    biryaniRunAddresses.value = [];
  } finally {
    isLoadingBiryaniRunAddress.value = false;
  }
};

const getAddress = async () => {
  try {
    const response = await axios.get(`/get-address`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    // Ambil data dari response dan pastikan array
    const data = response.data?.data;
    addresses.value = Array.isArray(data) ? data : [];

    // Cari alamat utama (primary address)
    const primaryAddressIndex = addresses.value.findIndex(
      (address) => address.primary_address === true,
    );

    if (primaryAddressIndex !== -1) {
      const [primaryAddress] = addresses.value.splice(primaryAddressIndex, 1);
      addresses.value.unshift(primaryAddress); // Pindahkan ke paling atas

      // Set selectedAddress dengan ga_id
      // selectedAddress.value = primaryAddress.ga_id ?? null;

      if (primaryAddress.ga_id) {
        addressExpanded.value[primaryAddress.ga_id] = true;
      }
    }
    // else {
    //   selectedAddress.value = null;
    // }
  } catch (error) {
    console.error("Error fetching addresses:", error);
    // alert(error.response?.data?.message || "Something went wrong!");
  }
};

const saveAddress = async () => {
  savingAddress.value = true;
  try {
    const payload = {
      full_address: addressForm.full_address,
      location_name:
        addressForm.location_name === "---Select Location Name---"
          ? ""
          : addressForm.location_name,
      dwelling_id: addressForm.dwelling_id,
      unit_number: addressForm.unit == "#" ? "" : addressForm.unit,
      country_id: addressForm.country_id,
      city_id: addressForm.city_id,
      building_no: addressForm.blk_no,
      lift_lobby: addressForm.lift_lobby,
      condo_name: addressForm.building,
      postal_code: addressForm.postal_code,
      street_name: addressForm.street_name,
      x_coordinate: addressForm.x_coordinate,
      y_coordinate: addressForm.y_coordinate,
      latitude: addressForm.latitude,
      longitude: addressForm.longitude,
    };

    if (!isEditAddressForm.value) {
      const response = await axios.post(`/save-address-biryani-run`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // ✅ Push the new address into `addresses.value`
      addresses.value.unshift(response.data.data); // Ensure `addresses` is a reactive array
      // const primaryAddressIndex = addresses.value.findIndex(address => address.primary_address)
      // selectedAddress.value = response.data.data.ga_id;
      toggleAddressDetails(response.data.data.ga_id);
      addresses.value = addresses.value.map((address) => ({
        ...address,
        // primary_address: address.ga_id === selectedAddress.value,
      }));
      getAddress();
      snackbar.value = true;
      message.value = {
        text: response.data.message,
        color: "success",
      };
    } else {
      // console.log("isEditAddressForm", addressForm);
      const response = await axios.put(
        `/update-address/` + addressID.value,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      getAddress();
      snackbar.value = true;
      message.value = {
        text: response.data.message,
        color: "success",
      };
    }
    // ✅ Optionally, reset form after successful save
    resetForm();
    isEditAddressForm.value = false;
    addressDialog.value = false;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  } finally {
    savingAddress.value = false;
  }
};

const selectAddress = async (item) => {
  // console.log(cart.value[0].cart_id);
  // console.log(item);
  // return false;
  // savingAddress.value = true;
  try {
    const response = await axios.put(
      `/update-cart-address`,
      {
        cart_id: cart.value[0].cart_id,
        ga_id: item.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    getAddress();
    getCartData();
    const data = response.data.data;
    selectedAddress.value = data.ga_id;
    // console.log(selectedAddress.value);
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
  // finally {
  //   savingAddress.value = false;
  // }
};

let instructionTimeout = null;

const changeDeliveryScheduleInstruction = async () => {
  if (instructionTimeout) clearTimeout(instructionTimeout);
  instructionTimeout = setTimeout(async () => {
    if (cart.value && cart.value.length > 0) {
      try {
        const response = await axios.put(
          `/update-delivery-order-instructions`,
          {
            cart_id: cart.value[0].cart_id,
            dc_id: selectedDelivery.value || cart.value[0].dc_id,
            order_instructions: deliveryScheduleInstruction.value,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        snackbar.value = true;
        message.value = {
          text: response.data.message,
          color: "success",
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong!";
        snackbar.value = true;
        message.value = {
          text: errorMessage,
          color: "error",
        };
      }
    }
  }, 1000);
};

const getTaxAmount = async () => {
  // let data = null;

  try {
    // await axios
    //   .get(`/gypsy-user`, { headers: { Authorization: `Bearer ${authToken}` } })
    //   .then((response) => {
    //     data = response.data.data?.country_current;
    //   })
    //   .catch((_) => {});

    const response = await axios.get(`/get-tax-amount`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        country_id: selectedCountry.value.country_id,
        app_id: 7,
      },
    });
    if (response.data.data?.applicable === "Y") {
      taxAmount.value = response.data.data?.tax_rate;
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
};

function getOrder() {
  // loading.value = true;
  axios
    .get(`/get-orders/all/7`)
    .then((response) => {
      const data = response.data.data;
      // console.log(data);

      orders.value = data.filter(
        (item) => item.cart_id == cart.value[0]?.cart_id,
      )[0];
      console.log(orders.value);
      // let itemFinal = [];
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
  // .finally(() => {
  //   loading.value = false;
  // });
}

const getCartData = async () => {
  await store.dispatch("getCartItems");
};

// const getPlatformFee = async () => {
//   let data = null;

//   try {
//     await axios
//       .get(`/get-app-id`, {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//         params: {
//           company_name: "Biryani Run",
//         },
//       })
//       .then((response) => {
//         data = response.data.data?.app_id;
//       })
//       .catch((error) => {
//         // eslint-disable-next-line
//         console.log(error);
//       });

//     const response = await axios.get(`/get-platform-fee`, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//       params: {
//         app_id: data,
//       },
//     });

//     platformFee.value = parseFloat(response.data.data?.platform_fee);
//   } catch (error) {
//     console.error("Error getting tax rate:", error);
//     // const message = error.response?.data?.message || "Something went wrong!";
//     // snackbar.value = true;
//     // message.value = {
//     //     text: message,
//     //     color: "error"
//     // };
//   } finally {
//     // savingAddress.value = false;
//   }
// };

const getTimeSlots = async () => {
  try {
    const response = await axios.get(`/get-time-slots/7`, {
      headers: { Authorization: `Bearer ${authToken}` },
      params: {
        restaurant_id: cart.value[0]?.restaurant_id || undefined,
        delivery_date: moment().tz(getDeliveryTimezone()).format("DD/MM/YYYY"),
        app_id: 7,
      },
    });

    const data = response.data?.data;
    const slots = Array.isArray(data) ? data : [];
    timeSlots.value = filterSlotsByCheckoutBuffer(slots, true);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    // alert(error.response?.data?.message || "Something went wrong!");
  }
};

const getPaymentOrder = async () => {
  try {
    await getPaymentTypes();
    await getOrder();
  } catch (error) {
    console.error("Error fetching payment types or orders:", error);
  }
};

const getPaymentTypes = async () => {
  try {
    const response = await axios.get(`/payment-type-list`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    // Ambil data dari response dan pastikan array
    const data = response.data?.data;
    const result = Array.isArray(data)
      ? data.filter(
          (item) => item.country_id == selectedCountry.value.country_id,
        )
      : [];
    paymentTypes.value = result;
    paymentOptions.value = result
      .filter((item) => item.active == "Y")
      .map((pay) => {
        return {
          ...pay,
          value: pay?.payment_type_id || 0,
          payment_name: pay?.payment_name || "",
          payment_desc: pay?.description || "",
          payment_image: pay?.image ? fileURL + pay.image : "",
        };
      });
    paymentOptions2.value = result
      .filter((item) => item.active != "Y")
      .map((pay) => {
        return {
          ...pay,
          value: pay?.payment_type_id || 0,
          payment_name: pay?.payment_name || "",
          payment_desc: pay?.description || "",
          payment_image: pay?.image ? fileURL + pay.image : "",
        };
      });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    // alert(error.response?.data?.message || "Something went wrong!");
  }
};

watch(selectedCountry, async () => {
  await getTaxAmount();
  await getPaymentTypes();
  getDeliveryCharges();
  if (
    authToken &&
    authToken != null &&
    authToken != "" &&
    authToken != "null"
  ) {
    getCartData();
  }
});

watch(cart, async (newCart) => {
  // console.log(newCart);
  if (newCart.length > 0) {
    selectedAddress.value = newCart[0]?.ga_id;
    selectedPaymentMethod.value = newCart[0]?.payment_type_id;
    deliveryScheduleInstruction.value = newCart[0]?.order_instructions;
    selectedDate.value = newCart[0]?.delivery_date
      ? parse(newCart[0]?.delivery_date)
      : null;
    selectedTimeSlot.value = newCart[0]?.time_slot;
  }
  // console.log(selectedAddress.value);
});

watch(
  () => props.viewCart, // Watch for changes in viewCart prop
  (newValue) => {
    if (newValue) {
      getRestaurantDish(cart.value[0]?.restaurant_id);
      getMenuCategories(cart.value[0]?.restaurant_id);
      getDeliveryRates();
      //getBiryaniRunAddress();
      // console.log(
      //   "open cart",
      //   store.state.selectedDelivery ||
      //     localStorage.getItem("selectedDelivery"),
      // );
      step.value = 1; // Set step to 1 when viewCart changes
      // selectedDelivery.value = null;
      selectedDate.value = cart.value[0]?.delivery_date
        ? parse(cart.value[0]?.delivery_date)
        : null;
      selectedTimeSlot.value = cart.value[0]?.time_slot;
      deliveryScheduleInstruction.value = cart.value[0]?.order_instructions;
      if (cart.value[0]?.delivery_charges != "0.00") {
        selectedDelivery.value = cart.value[0]?.dc_id
          ? Number(cart.value[0]?.dc_id)
          : null;
      } else {
        selectedDelivery.value = null;
      }
      // selectedDelivery.value = null;
    }
  },
);

const updateTime = () => {
  const singaporeTime = moment().tz(getDeliveryTimezone());

  const day = singaporeTime.format("dddd"); // e.g., Wednesday
  const date = singaporeTime.format("DD/MM/YYYY"); // e.g., 21/05/2025
  const time = singaporeTime.format("HH:mm:ss"); // e.g., 16:49

  currentTime.value = `${day} (Today) | ${date} | ${time}`;
  currentHour.value = time;
  nowTick.value = Date.now();
};

onMounted(() => {
  if (
    authToken &&
    authToken != null &&
    authToken != "" &&
    authToken != "null"
  ) {
    // getTaxAmount();
    getAddress();
    //getBiryaniRunAddress();
    // getPaymentTypes();
    getTimeSlots();
    // getPlatformFee();
    // getCartData();
  }

  updateTime();
  setInterval(updateTime, 1000);
});
</script>

<style>
.font-sm {
  font-size: 10px;
}
.cart-drawer {
  width: 100%; /* Ensures the parent takes the full width of its container */
  display: flex; /* Helps manage layout */
  flex-direction: column; /* Ensures proper stacking of elements */
  overflow-x: hidden; /* Prevents horizontal scrolling */
  max-height: 100dvh;
}

.cart-items {
  width: 100%; /* Makes the child take the full width of the parent */
  max-width: 100%; /* Ensures it doesn’t exceed parent width */
  white-space: normal; /* Allows text to wrap instead of overflowing */
  word-break: break-word; /* Breaks long words if needed */
  overflow-wrap: break-word; /* Prevents text overflow */
  overflow-y: auto;
  background: #ffff;
  min-height: 0;
}

.product-name {
  width: 17rem; /* Ensures the div takes up to 75% of the space */
  white-space: normal; /* Allows text to wrap */
  word-break: break-word; /* Ensures words break if too long */
  overflow-wrap: break-word; /* Prevents overflow */
}

.no-header {
  height: 100dvh !important;
  min-height: 100dvh !important;
}

.no-header .m-drawer-content-wrap {
  min-height: 100dvh !important;
  max-height: 100dvh !important;
  display: flex;
  flex-direction: column;
}

.no-header .m-drawer-header {
  display: none !important;
}

.fill-height {
  height: 100%;
}
.checkout-container {
  position: sticky;
  bottom: 0;
  background: #ffff;
  padding: 20px;
  z-index: 10; /* Ensures it stays above other content */
}

/* .maz-elevation {
  border: 1px solid #00aaff !important;
} */

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table td {
  border-bottom: 1px solid #ddd;
}

.total-row td {
  font-weight: bold;
  padding-top: 10px;
}

.pac-container {
  z-index: 99999 !important; /* Ensure autocomplete appears above modal */
}

@media (max-width: 768px) {
  .product-name {
    width: 45vw !important;
  }
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.promo-message-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-menu-dish-search {
  height: 40px !important;
  margin: 0 !important;
}

.cart-menu-dish-search input {
  height: 40px !important;
  min-width: 0 !important;
  padding-right: 78px !important;
  color: #00aeef !important;
  font-weight: 700 !important;
  font-size: 15px !important;
}

.cart-menu-dish-search input::placeholder {
  color: #9e9e9e !important;
  font-weight: 500 !important;
}

.cart-menu-dish-clear {
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 50%;
  background: #757575;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  z-index: 2;
}
</style>
