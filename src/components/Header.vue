<template>
  <v-app-bar
    v-if="(isDesktop && !isHeader) || (isSmall && !isHeader)"
    :class="{
      'px-8': isHeader || isProfile,
    }"
    color="white"
    elevation="1"
    fixed
  >
    <router-link to="/">
      <div class="logo-img-container ml-4">
        <v-img
          class="logo-img"
          :src="$fileURL + logo"
          height="35"
          transition="fade-transition"
        >
          <template #placeholder>
            <v-skeleton-loader type="image"></v-skeleton-loader>
          </template>
        </v-img>
      </div>
    </router-link>

    <v-menu v-if="!isProfile && !isMobileProduct">
      <template #activator="{ props }">
        <v-btn
          class="ml-4 location-selector"
          v-bind="props"
          variant="text"
          color="#494949"
          append-icon="mdi-chevron-down"
        >
          <div class="d-flex align-center gap-2">
            <v-avatar size="24" v-if="selectedLocation.country">
              <v-img
                :src="
                  $fileURL +
                  locationDropdown.find(
                    (l) => l.country === selectedLocation.country,
                  )?.flagUrl
                "
                cover
              ></v-img>
            </v-avatar>
            <span class="searchCityName">{{ selectedLocation.city }}</span>
          </div>
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-card-title>
          <span class="text-subtitle-2">Choose Your Location</span>
        </v-card-title>

        <v-list>
          <template v-for="(location, index) in locationDropdown" :key="index">
            <!-- Country Header -->
            <v-list-subheader>
              <div class="d-flex align-center gap-2">
                <v-avatar size="24">
                  <v-img :src="$fileURL + location.flagUrl" cover></v-img>
                </v-avatar>
                <span class="text-subtitle-1 font-weight-medium">
                  {{ location.country }}
                </span>
              </div>
            </v-list-subheader>

            <!-- Cities -->
            <v-list-item
              v-for="(city, cityIndex) in location.cities"
              :key="`${index}-${cityIndex}`"
              :value="city.name"
              :active="selectedLocation.city === city.name"
              variant="text"
              active-color="primary"
              @click="selectLocation(location, city)"
              class="pl-7"
            >
              <template #prepend>
                <v-avatar size="24" class="">
                  <v-img :src="$fileURL + city.imageUrl" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title
                >{{ city.name }}
                <span class="font-weight-bold"
                  >(<span class="text-blue-darken-4">{{ city.count }}</span>
                  Dishes)</span
                ></v-list-item-title
              >
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-menu>

    <form
      v-if="!isDesktop && isProduct"
      class="navbar__search ml-2"
      :class="
        isMobileProduct ? 'mobile__navbar__search' : 'navbar__search__desktop'
      "
    >
      <v-autocomplete
        id="product_name"
        v-model="search"
        class="form-control mr-sm-2 ml-md-n3 search-input"
        item-title="product_name"
        item-value="product_id"
        :items="activeMalls"
        :custom-filter="filterMalls"
        style="font-style: italic"
        placeholder="Chicken, Mutton ,  Prawn"
        density="compact"
        color="blue-grey-lighten-2"
      >
        <template #item="{ props, item }">
          <div
            v-if="item.raw.ranges.length > 0"
            class="mb-4 px-2"
            v-bind="props"
          >
            <p
              v-if="item.raw.showBrandName"
              style="font-size: 12px"
              class="font-weight-bold text-red-darken-4 mb-2"
            >
              {{ item.raw.brand_name }}
            </p>
            <div
              v-for="range in item.raw.ranges"
              class="d-flex align-center w-100 mb-2"
            >
              <div style="width: 15%" class="mr-2">
                <div
                  style="
                    height: 45px;
                    width: 100%;
                    object-fit: cover;
                    object-position: center;
                  "
                >
                  <v-img
                    height="45"
                    cover
                    :src="
                      range.image_1
                        ? $fileURL + range.image_1
                        : $fileURL + item.raw.image
                    "
                  >
                    <template #placeholder>
                      <div class="skeleton" />
                    </template>
                  </v-img>
                </div>
              </div>
              <div
                class="d-flex align-center justify-space-between"
                style="font-size: 12px; width: 85%"
              >
                <div class="w-100">
                  <a
                    class="text-decoration-none text-black font-weight-bold"
                    :href="`/product/${item.raw.encrypted_id}?range_id=${range.range_id}`"
                  >
                    <!-- @click="
                      getProductDetailsLink(
                        item.raw.product_id,
                        item.raw.encrypted_id,
                        range.range_id,
                      )
                    " -->
                    <p class="mb-1 font-weight-regular">
                      {{
                        `${item?.raw?.product_name} ${range?.quantity?.quantity_name}`
                      }}
                    </p>
                    <p class="font-weight-regular">
                      <span>{{
                        item.raw.percentage && item.raw.country_name
                          ? `${item.raw.percentage}% | ${item.raw.country_name}`
                          : item.raw.percentage
                            ? `${item.raw.percentage}%`
                            : item.raw.country_name
                              ? `${item.raw.country_name}`
                              : ""
                      }}</span>
                    </p>
                  </a>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-red-darken-1 font-weight-bold">
                      <template v-if="range?.price_list?.rate">
                        {{ selectedCountry.currency_symbol }}
                        {{ range?.price_list?.rate }}
                      </template>
                    </span>
                    <!-- <span v-show="range?.price_list?.rate">
                      <v-btn
                        v-if="!isInCart(item.raw, range)"
                        @click.stop.prevent="addToCartData(item.raw, range)"
                        size="xs"
                        color="black"
                        class="text-caption py-1 px-8"
                        variant="flat"
                        >Add</v-btn
                      >
                      <div
                        v-else="isInCart(item.raw, range)"
                        class="d-flex align-center ga-2"
                      >
                        <v-btn
                          size="xs"
                          color="black"
                          class="text-caption pa-1 rounded-0"
                          variant="flat"
                          icon
                          @click.stop.prevent="
                            updateQuantity(item.raw, 'decrease')
                          "
                        >
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>

                        <span>
                          {{ cartQuantity(item.raw, range) }}
                        </span>

                        <v-btn
                          size="xs"
                          color="black"
                          class="text-caption pa-1 rounded-0"
                          variant="flat"
                          icon
                          @click.stop.prevent="
                            updateQuantity(item.raw, 'increase')
                          "
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </span> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </v-autocomplete>
      <button class="btn btn--search search-button" type="submit">
        <v-icon color="white"> mdi-magnify </v-icon>
      </button>
    </form>

    <div
      v-if="!isDesktop && !isProfile && !isProduct"
      @click="toggleMobileSearchBar()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="currentColor"
        class="bi bi-search"
        viewBox="0 0 16 16"
      >
        <path
          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
        />
      </svg>
    </div>

    <div
      v-if="isHeader || isProfile"
      class="ml-6 d-flex navbar-header"
      :class="{ 'navbar-header-mobile': !isDesktop && isProfile }"
    >
      <div class="divider" :class="{ 'd-none': !isDesktop && isProfile }" />
      <h1 v-if="isDekstop">{{ titleHeader }}</h1>
      <h2 v-else>{{ titleHeader }}</h2>
    </div>

    <v-spacer v-if="isHeader || isProfile" />

    <form
      v-if="!isHeader && !isProfile && !isBatamProperties"
      class="navbar__search navbar__search__desktop"
    >
      <v-autocomplete
        id="product_name"
        v-model="search"
        class="form-control mr-sm-2 ml-md-n3 search-input"
        item-title="product_name"
        item-value="product_id"
        :items="activeMalls"
        :custom-filter="filterMalls"
        style="font-style: italic"
        placeholder="Chicken, Mutton , Prawn"
        density="compact"
        color="blue-grey-lighten-2"
      >
        <template #item="{ props, item }">
          <div
            v-if="item.raw.ranges.length > 0"
            class="mb-4 px-2"
            v-bind="props"
          >
            <p
              v-if="item.raw.showBrandName"
              style="font-size: 12px"
              class="font-weight-bold text-red-darken-4 mb-2"
            >
              {{ item.raw.brand_name }}
            </p>
            <div
              v-for="range in item.raw.ranges"
              class="d-flex align-center w-100 mb-2"
            >
              <div style="width: 15%" class="mr-2">
                <div
                  style="
                    height: 45px;
                    width: 100%;
                    object-fit: cover;
                    object-position: center;
                  "
                >
                  <v-img
                    height="45"
                    cover
                    :src="
                      range.image_1
                        ? $fileURL + range.image_1
                        : $fileURL + item.raw.image
                    "
                  >
                    <template #placeholder>
                      <div class="skeleton" />
                    </template>
                  </v-img>
                </div>
              </div>
              <div
                class="d-flex align-center justify-space-between"
                style="font-size: 12px; width: 85%"
              >
                <div class="w-100">
                  <div
                    class="text-decoration-none text-black font-weight-bold"
                    :href="`/product/${item.raw.encrypted_id}?range_id=${range.range_id}`"
                  >
                    <!-- @click="
                      getProductDetailsLink(
                        item.raw.product_id,
                        item.raw.encrypted_id,
                        range.range_id,
                      )
                    " -->
                    <p class="mb-1 font-weight-regular">
                      {{
                        `${item?.raw?.product_name} ${range?.quantity?.quantity_name}`
                      }}
                    </p>

                    <p class="font-weight-regular">
                      <span>{{
                        item.raw.percentage && item.raw.country_name
                          ? `${item.raw.percentage}% | ${item.raw.country_name}`
                          : item.raw.percentage
                            ? `${item.raw.percentage}%`
                            : item.raw.country_name
                              ? `${item.raw.country_name}`
                              : ""
                      }}</span>
                    </p>
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-red-darken-1 font-weight-bold">
                      <template v-if="range?.price_list?.rate">
                        {{ selectedCountry.currency_symbol }}
                        {{ range?.price_list?.rate }}
                      </template>
                    </span>
                    <!-- <span v-show="range?.price_list?.rate">
                      <v-btn
                        v-if="!isInCart(item.raw, range)"
                        @click.stop.prevent="addToCartData(item.raw, range)"
                        size="xs"
                        color="black"
                        class="text-caption py-1 px-8"
                        variant="flat"
                        >Add</v-btn
                      >
                      <div
                        v-else="isInCart(item.raw, range)"
                        class="d-flex align-center ga-2"
                      >
                        <v-btn
                          size="xs"
                          color="black"
                          class="text-caption pa-1 rounded-0"
                          variant="flat"
                          icon
                          @click.stop.prevent="
                            updateQuantity(item.raw, 'decrease')
                          "
                        >
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>

                        <span>
                          {{ cartQuantity(item.raw, range) }}
                        </span>

                        <v-btn
                          size="xs"
                          color="black"
                          class="text-caption pa-1 rounded-0"
                          variant="flat"
                          icon
                          @click.stop.prevent="
                            updateQuantity(item.raw, 'increase')
                          "
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </span> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </v-autocomplete>
      <button class="btn btn--search" type="submit">
        <v-icon color="white"> mdi-magnify </v-icon>
      </button>
    </form>

    <!-- if NOT mobile view -->
    <div
      v-if="!isHeader && !isProfile && !userName && !isSmall"
      class="btn_sign__up-cont"
    >
      <v-btn
        elevation="0"
        class="btn_sign__up"
        @click="$router.push('/sign-in')"
      >
        <span> Sign Up / Sign In</span>
      </v-btn>
      <div class="btn_sign__up-hover" />
    </div>

    <v-btn
      v-if="!isHeader && !isProfile && !isSmall && userName"
      elevation="0"
      class="btn_log__out"
      :class="{ 'mr-6': tokenStart }"
      @click="logout"
    >
      Logout
    </v-btn>

    <!-- if NOT mobile view -->
    <div>
      <div v-if="!isSmall" class="cart d-flex align-center">
        <div class="cart-line mr-2" />
        <v-icon size="35" color="black"> mdi mdi-cart-variant </v-icon>
        <span>S$ 0</span>
      </div>
    </div>

    <!-- <div>
      <div
        v-if="!isSmall && !isProfile"
        @click="viewCartClick"
        class="cart d-flex align-center"
      >
        <div class="cart-line mr-2" />
        <v-badge
          :content="cartTotalQuantity"
          color="red"
          offset-x="10"
          offset-y="10"
        >
          <v-icon size="45">mdi mdi-cart-variant</v-icon>
        </v-badge>
        <span class="ml-2" v-if="subTotal > 0">
          {{ selectedCountry.currency_symbol }} {{ finalCartTotal }}
        </span>
        <Cart :viewCart="viewCart" @update:viewCart="viewCart = $event" />
      </div>
    </div> -->

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
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </template>
      </v-img>
      <img
        v-else-if="userImage == null && !isLoading"
        :src="images.user"
        cover
        height="48"
        style="height: 100%; width: 100%"
      />
    </div>

    <template v-if="!isProfile" #extension>
      <div class="mobile__app text-center w-100">
        <template v-if="activeLocationButton && isSmall">
          <v-menu v-if="locationPlaceholder" v-model="userLocation">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="text"
                v-bind="props"
                color="#494949"
                append-icon="mdi-chevron-down"
              >
                <template v-slot:prepend>
                  <v-avatar
                    :image="$fileURL + itemSelectedComplete?.flag"
                    size="x-small"
                  ></v-avatar>
                </template>

                {{ locationPlaceholder }}
              </v-btn>
            </template>

            <v-card min-width="300">
              <v-card-title>
                <div class="d-flex align-center ga-2">
                  <v-icon size="small">mdi-map-marker</v-icon>
                  <p class="text-subtitle-2">Choose Your Location</p>
                </div>
              </v-card-title>

              <v-list>
                <template
                  v-for="(location, index) in locationDropdown"
                  :key="index"
                >
                  <!-- Country Header -->
                  <v-list-subheader>
                    <div class="d-flex align-center gap-2">
                      <v-avatar size="24">
                        <v-img :src="$fileURL + location.flagUrl" cover></v-img>
                      </v-avatar>
                      <span class="text-subtitle-1 font-weight-medium">
                        {{ location.country }} ({{ location.properties }}
                        Properties)
                      </span>
                    </div>
                  </v-list-subheader>

                  <!-- Cities -->
                  <v-list-item
                    v-for="(city, cityIndex) in location.cities"
                    :key="`${index}-${cityIndex}`"
                    :value="city.name"
                    :active="selectedLocation.city === city.name"
                    variant="text"
                    active-color="primary"
                    @click="selectLocation(location, city)"
                    class="pl-7"
                  >
                    <template #prepend>
                      <v-avatar size="24" class="mr-2">
                        <v-img :src="$fileURL + city.imageUrl" cover></v-img>
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ city.name }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </v-card>
          </v-menu>

          <v-skeleton-loader
            width="200"
            v-else
            type="list-item-two-line"
          ></v-skeleton-loader>
        </template>

        <!-- if NOT mobile view -->
        <div
          v-if="!isHeader && !isProfile && !userName && isSmall"
          class="btn_sign__up-cont mx-auto my-4"
        >
          <v-btn
            elevation="0"
            class="btn_sign__up d-flex align-center"
            @click="$router.push('/sign-in')"
          >
            <span> Sign Up / Sign In</span>
          </v-btn>
          <div class="btn_sign__up-hover" />
        </div>
        <v-btn
          v-if="!isHeader && !isProfile && !isSmall && userName"
          elevation="0"
          class="btn_log__out"
          :class="{ 'mr-6': tokenStart }"
          @click="logout"
        >
          Logout
        </v-btn>

        <div v-if="isSmall && !isProduct" class="ma-4">
          <form v-if="openMobileSearchBar" class="navbar__search mx-auto">
            <v-autocomplete
              id="product_name"
              v-model="search"
              class="form-control mr-sm-2 ml-md-n3 search-input"
              item-title="product_name"
              item-value="product_id"
              :items="activeMalls"
              :custom-filter="filterMalls"
              style="font-style: italic"
              placeholder="Chicken, Mutton , Prawn"
              density="compact"
              color="blue-grey-lighten-2"
            >
              <template #item="{ props, item }">
                <div
                  v-if="item.raw.ranges.length > 0"
                  class="mb-4 px-2"
                  v-bind="props"
                >
                  <p
                    v-if="item.raw.showBrandName"
                    style="font-size: 12px"
                    class="font-weight-bold text-red-darken-4 mb-2"
                  >
                    {{ item.raw.brand_name }}
                  </p>
                  <div
                    v-for="range in item.raw.ranges"
                    class="d-flex align-center w-100 mb-2"
                  >
                    <div style="width: 15%" class="mr-2">
                      <div
                        style="
                          height: 45px;
                          width: 100%;
                          object-fit: cover;
                          object-position: center;
                        "
                      >
                        <v-img
                          height="45"
                          cover
                          :src="
                            range.image_1
                              ? $fileURL + range.image_1
                              : $fileURL + item.raw.image
                          "
                        >
                          <template #placeholder>
                            <div class="skeleton" />
                          </template>
                        </v-img>
                      </div>
                    </div>
                    <div
                      class="d-flex align-center justify-space-between"
                      style="font-size: 12px; width: 85%"
                    >
                      <div class="w-100">
                        <div
                          class="text-decoration-none text-black font-weight-bold"
                          @click="
                            getProductDetailsLink(
                              item.raw.product_id,
                              item.raw.encrypted_id,
                              range.range_id,
                            )
                          "
                        >
                          <!-- :href="`/product/${item.raw.encrypted_id}?range_id=${range.range_id}`" -->
                          <p class="mb-1 font-weight-regular">
                            {{
                              `${item?.raw?.product_name} ${range?.quantity?.quantity_name}`
                            }}
                          </p>
                          <p class="font-weight-regular">
                            <span>{{
                              item.raw.percentage && item.raw.country_name
                                ? `${item.raw.percentage}% | ${item.raw.country_name}`
                                : item.raw.percentage
                                  ? `${item.raw.percentage}%`
                                  : item.raw.country_name
                                    ? `${item.raw.country_name}`
                                    : ""
                            }}</span>
                          </p>
                        </div>
                        <div class="d-flex justify-space-between align-center">
                          <span class="text-red-darken-1 font-weight-bold">
                            <template v-if="range?.price_list?.rate">
                              {{ selectedCountry.currency_symbol }}
                              {{ range?.price_list?.rate }}
                            </template>
                          </span>
                          <!-- <span v-show="range?.price_list?.rate">
                            <v-btn
                              v-if="!isInCart(item.raw, range)"
                              @click.stop.prevent="
                                addToCartData(item.raw, range)
                              "
                              size="xs"
                              color="black"
                              class="text-caption py-1 px-8"
                              variant="flat"
                              >Add</v-btn
                            >
                            <div
                              v-else="isInCart(item.raw, range)"
                              class="d-flex align-center ga-2"
                            >
                              <v-btn
                                size="xs"
                                color="black"
                                class="text-caption pa-1 rounded-0"
                                variant="flat"
                                icon
                                @click.stop.prevent="
                                  updateQuantity(item.raw, 'decrease')
                                "
                              >
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>

                              <span>
                                {{ cartQuantity(item.raw, range) }}
                              </span>

                              <v-btn
                                size="xs"
                                color="black"
                                class="text-caption pa-1 rounded-0"
                                variant="flat"
                                icon
                                @click.stop.prevent="
                                  updateQuantity(item.raw, 'increase')
                                "
                              >
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </div>
                          </span> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </v-autocomplete>
            <button class="btn btn--search" type="submit">
              <v-icon color="white"> mdi-magnify </v-icon>
            </button>
          </form>
          <ExploreOurMenuList :desktop="false" v-if="!isProduct" />
        </div>

        <div id="trending-container" class="d-sm-none"></div>

        <div
          v-if="
            $route.name == 'Trending-buy' ||
            $route.name == 'Trending-rent' ||
            $route.name == 'Trending-roommates' ||
            $route.name == 'Trending-staycation' ||
            $route.name == 'Trending-vacation' ||
            $route.name == 'Trending-co-living' ||
            $route.name == 'Trending-co-working'
          "
          class="d-md-none mx-auto pt-md-0 px-4 medium:px-20"
          style="max-width: 1200px; overflow-x: auto"
        >
          <div
            class="d-flex justify-center ga-6 my-5"
            style="min-width: fit-content"
          >
            <template v-for="n in trendings" :key="n">
              <v-btn
                @click="goToPath(n)"
                elevation="0"
                class="pa-2"
                style="min-width: 100px; min-height: 70px"
              >
                <div class="d-flex flex-column align-center ga-3 text-caption">
                  <v-responsive>
                    <v-img
                      :src="$fileURL + n.icon"
                      cover
                      style="height: 25px; width: 25px"
                      aspect-ratio="1"
                    ></v-img>
                  </v-responsive>
                  {{ n.title }}
                </div>
              </v-btn>
            </template>
          </div>
        </div>
        <!-- <div>TEST</div>
        <div>TEST</div> -->
      </div>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="right">
    <div
      class="drawer__top"
      :class="{ 'py-6': userName == null, 'py-2': userName != null }"
    >
      <div v-if="userName == null" class="btn_sign__up-cont-drawer">
        <v-btn
          elevation="0"
          class="btn_sign__up"
          @click="$router.push('/sign-in')"
        >
          <span> Sign Up / Sign In</span>
        </v-btn>
        <div class="btn_sign__up-drawer-hover" />
      </div>
      <div v-else class="d-flex align-center">
        <div style="width: 55px; height: 55px; border-radius: 50%">
          <v-img
            cover
            style="border-radius: 50%; width: 100%; height: 100%"
            :src="
              userImage != null
                ? userImage
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            "
          >
            <template #placeholder>
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </template>
          </v-img>
        </div>

        <v-list-item>
          <v-list-item-title style="font-size: 14px">
            {{ userName }}
          </v-list-item-title>
          <v-list-item-subtitle style="font-size: 10px" class="mt-1">
            Last Login: {{ userDated }}
          </v-list-item-subtitle>
          <div
            class="text-red mt-1"
            style="font-size: 12px; cursor: pointer"
            @click="logout"
          >
            Logout
          </div>
        </v-list-item>
      </div>
    </div>
    <div class="drawer__heading">
      <div class="drawer-logo">
        <v-img height="35" width="80" :src="$fileURL + logo" />
      </div>
      <v-menu contained style="z-index: 1000">
        <template #activator="{ props }">
          <v-btn
            style="background: #f4f5f7; color: black"
            variant="text"
            color="black"
            icon="mdi-share-outline"
            width="30"
            height="30"
            class="mx-4"
            v-bind="props"
          >
            <v-icon color="rgb(38, 38, 38)" size="15">
              mdi-share-outline
            </v-icon>
          </v-btn>
        </template>
        <v-list style="z-index: 1000">
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" color="black" size="18">
                mdi-email-outline </v-icon
              >Email
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" size="18">
                <i class="fa-brands fa-facebook-f" /> </v-icon
              >Facebook
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" color="black" size="18"> mdi-twitter </v-icon
              >Twitter
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" size="18">
                <i class="fa-brands fa-linkedin-in" /> </v-icon
              >Linkedin
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="text-muted" style="font-size: 10px">Version 1.0</div>
    </div>
    <v-divider />
    <ul class="pt-1" nav dense>
      <li class="v-list-item">
        <div class="v-list-item__icon">
          <v-img height="20" width="30" :src="images.home" />
        </div>
        <v-list-item-title style="font-size: 12px"> Home </v-list-item-title>
      </li>

      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img height="18" width="25" :src="images.shopper" />
        </div>
        <router-link class="text-decoration-none text-black" to="/my-profile">
          <v-list-item-title style="font-size: 12px">
            My Profile
          </v-list-item-title>
        </router-link>
      </li>

      <li class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img height="18" width="25" :src="images.shop" />
        </div>
        <v-list-item-title style="font-size: 12px"> My Cart </v-list-item-title>
      </li>

      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>
        <v-list-item-title style="font-size: 12px">
          My Vouchers
        </v-list-item-title>
      </li>
      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <router-link
          v-if="isSmall"
          class="text-decoration-none text-black"
          to="/my-favorites"
        >
          <v-list-item-title style="font-size: 12px">
            My Favorites
          </v-list-item-title>
        </router-link>
        <v-list-item-title
          v-else
          @click="isBestViewed = true"
          class="cursor-pointer"
          style="font-size: 12px"
        >
          My Favorites
        </v-list-item-title>
      </li>

      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <v-list-item-title class="cursor-pointer" style="font-size: 12px">
          QR Code - For Payments
        </v-list-item-title>
      </li>
      <li v-if="userName == null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>
        <router-link
          class="text-decoration-none text-black"
          to="/privacy-policy"
        >
          <v-list-item-title style="font-size: 12px">
            Privacy Policy
          </v-list-item-title>
        </router-link>
      </li>
      <li v-if="userName == null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <router-link class="text-decoration-none text-black" to="/our-terms">
          <v-list-item-title style="font-size: 12px">
            Terms & Conditions
          </v-list-item-title>
        </router-link>
      </li>
    </ul>
    <div class="drawer__bottom">
      <div class="text-center" style="width: 100%">
        <p style="font-size: 13px" class="mb-1">Made in Singapore</p>
        <h3 style="font-size: 13px">Get connected</h3>
        <v-row
          class="d-flex justify-center mt-1"
          :class="{ 'mb-2': userName == null }"
        >
          <v-col cols="3" class="d-flex justify-end">
            <a :href="footerData?.facebook">
              <v-img :src="images.facebook" height="40" width="32" />
            </a>
          </v-col>
          <v-col class="d-flex justify-center" cols="3">
            <a :href="footerData?.instagram">
              <v-img :src="images.instagram" height="40" width="32" />
            </a>
          </v-col>
          <v-col class="d-flex justify-start" cols="3">
            <a :href="footerData?.tiktok">
              <v-img :src="images.tiktok" class="mt-1" height="35" width="35" />
            </a>
          </v-col>
          <v-col
            class="d-flex justify-center flex-column align-center"
            cols="12"
          >
            <p class="text-caption">Wha'ts App Support (24 hrs)</p>
            <a
              :href="`https://api.whatsapp.com/send?phone=${footerData?.whats_app}&text=The Gypsy Support here - How may I help you. ?`"
            >
              <v-img
                :src="images.whatsapp"
                class="mt-1"
                height="35"
                width="35"
              />
            </a>
          </v-col>
        </v-row>
        <div
          v-if="userName != null"
          style="font-size: 12px"
          class="text-grey my-4"
        >
          <router-link
            class="text-decoration-none text-grey"
            to="/privacy-policy"
          >
            Privacy
          </router-link>
          |
          <router-link class="text-decoration-none text-grey" to="/our-terms">
            Terms
          </router-link>
        </div>
        <!-- <div class="drawer-social d-flex" style="width: 100%">
          <div>
            <h5>WhatsApp</h5>
            <a
              style="text-decoration: none; font-size: 10px"
              :href="`https://api.whatsapp.com/send?phone=${footerData?.whats_app}&text=Hello!`"
            >
              {{ footerData?.whats_app }}
            </a>
          </div>
          <div>
            <h5>Contact us</h5>
            <a
              style="text-decoration: none; font-size: 10px"
              :href="`mailto:${footerData?.email_id}`"
              >{{ footerData?.email_id }}</a
            >
          </div>
        </div> -->
        <v-divider class="mt-2 mb-n2" />
        <v-container class="footer-bottom pb-2 d-flex justify-center">
          <div class="d-flag d-flex justify-space-between w-100 align-center">
            <img
              style="max-width: 40px; border: 1px solid black"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAjVBMVEX////tKTnsFSr2q6/tJTbsABvtHjDtIDLsAB/tIjTzfITsDSbsAB7sGCzxbHXsAyL1n6T96+z+8vP4ur771tj++PnrAAD84eP5x8r3sLT2panuO0n5wcTuQE3vRlLwWGLuMUDxZW7zhYzydHzvUl30jpT6ztH0lJr3tbn7293vTlnrABTzh47wXmj1mJ0I+eUlAAAGKklEQVR4nO2ci3KiMBSGEWO4RIzXta1Wsd5b9f0fbxOtliQEaLduG+b/ZnaGhewO/ZqcnBwCXgPoeD99A78QODGBExM4MYETEzgxgRMTODGBExM4MfmCExIkjIchl3+YT8n339QP81knkd9udLrTYW8k6O0fmi+vtZPyKSfE58fHnpdhtFum97q1H+MTTghPn/pZId702PKD+93bT1HZCWGTqSLEa6ashkIa1Z0k0UA1MghY7QLJO9WckNaLaqS34nU1UtFJkGy0YcPzRg0bsG++u5+hipPkVQ2tXifMa0Ya3nMtOk8FJ6yjGhnNktx29OB18684RrkTFqtK+inNb8iH3rj9zbf3I5Q68XUljchoQwIBpeLqhMpDs4VTlDmhC1WJNzGjKzkuO53OoiuuPi7E0XLhtpQSJ9GzpmSeM3BIOlTajB0PtSVOWE9Vss6dbUlrnWnTbbmtpMRJqCWvm5aloT+7yuvPnU9SCp1QbRb2iLUHRG/ji5KW+2ugQidMy9UOBelH8t6m4fjAaRQ78buqkt6bvS1digYjGXEs2YtDFDghgTZyOuqPqwwS9iAm4j9C4pBnT0cu9poCJ/6TqkRLUtM4K4UJZbzB5n1l8EQLFyuTBU7YSHUSK92EHh4yEwyNx0Repv5mm2nmD1xcAdmdUK1kMlIGRYNvvIwTMn+vMBE2z/SMsL/PXUL/buxOQjU59XZq3iHmmU5m8JCco0a0cnIesjohqRZh58oihoqlYWkJyW963ta9ecjqxBg6twjrtwR/xDwz+iOPcsuyhJ0bieR2eG7k3+Xm74TVCdOq9LeIGuy06WhiStFXhd7Dve7/HlidhFoO+zEG+DJ7vhnm9pOWku8dbOukX4nNCYns4SRJ97cRteCW/4CtblJ7M6eGjtVJoNeSsvPHrRcMA3sEDWRqK9m1HCsx2ZzQg6qkr/SHa/WtWTTz+KdLo9i1mcfmRE6jSiRVnLBBnimN8FI98DZFjX4jVifa7LJRegQXaf/gxdOTFgUykZFZrplcKzLZnFinYokMNnHbf+55TXv0TE5ef8X4YuTc4LE6eShwwqa9VKztIj4Y2ZczYe9BbsSg0XDoWEf5kpPo9J6UhPHMupyZrC+1atLaftvd/h+sTvTqtPK7vg2Got1s1DhwBGuMfVSdDF2bPP4Bm5NEr8U6WAf5KtacTXtMPHIrPf8nrOudmeqkJltLKmFdF3PNydISKUn+XtDUsTVOFruTverEkp2R16e8KjQ9Oby3wOrEeJKRH2STbi9vHw4f7twNQFYn0VEbPPmPr8RCL82ps0Ve390tS/a6PdcKbbkPPWUl+2QOHlnMXTk7eOxO9Kxtr/3iqYRvxYW38yHJnG5tZFHyfHjHe78XdiclszF5iQVLWSORB/HhsvKZrM+nZZa3PJ++8/3fg4Jno8UPvaKj+uj0dOkRen2u4+B2lAInhSVZcdnPlFh6r9dpJpmMP05vCuq1v5ei/SdtLUV51Oog7Vv+P8i8oUHCW9ly7ebOtiIn8nGvgj7r+u8h50ndrHPd8Xd0rJZ0pXDvFi/Z4ncNHloV+lq3zJmknaB436Ovb0FRf0ouo7BsopaW5L+SZ13daV7shOrJrDJ65Oau0ZyJXOSQDaVBR+QsDbk51NG1dNmeYa20NM6OHpGtbkSu1t6qVTgxdLptErCBq4OnbL99S6tVTzNS2PAysfizfrb/JP1LcG3HezeDbOl7GaE2IT99BAlyTUoiki3fT64vs9DZt97qf6PUCfHHqpTTR0/J3bCV+Yub4aTCO01Ery49ObWZ5AtUePeNhNpz0qmb6WllKr03KmYWdfZJ3ZxQKlLt/WL2qr3HE9e5q1R8Dz3gWqKymdT2NfTq3ytgqRZVHkldrVT/rgXhE21JuHsOXSyPlPKZ758QRg9q7W14oDXsLJ/8Tg7lfrxTkrjpqnZSPv89Jepz9nyM19vtOl7MEr92Sr743S0SnJ9T0KB+Qhr4FlkecGICJyZwYgInJnBiAicmcGICJyaeD3S8JtDxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwN34C1LFl4jt93CzAAAAAElFTkSuQmCC"
              alt="Singapore"
            />
            <div id="footerCurrentTime" style="font-size: 0.7rem">
              {{ currentTime }}
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </v-navigation-drawer>

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

  <v-dialog
    v-model="dialog2"
    fullscreen
    persistent
    height="90vh"
    class="mt-16"
    z-index="1000000"
  >
    <v-card
      height="90vh"
      class="mt-16"
      style="border-top-left-radius: 30px; border-top-right-radius: 30px"
    >
      <v-card-title
        class="pt-10 d-flex justify-space-between position-fixed bg-white"
        style="z-index: 1000"
      >
        <div class="navbar__search navbar__search__mobile w-100">
          <v-text-field
            id="product_name"
            v-model="search"
            class="form-control mr-sm-2 ml-md-n3 search-input"
            style="font-style: italic"
            placeholder="Explore Properties"
            density="compact"
            color="blue-grey-lighten-2"
            clearable
          />
          <button class="btn btn--search">
            <v-icon color="white"> mdi-magnify </v-icon>
          </button>
        </div>
        <v-btn
          variant="text"
          icon="mdi-close"
          text="Ok"
          @click="dialog2 = false"
        />
      </v-card-title>

      <v-card-text
        class="px-4"
        style="padding-bottom: 100px; padding-top: 120px"
      >
        <div v-for="(item, index) in filteredMalls" :key="index" class="mb-2">
          <div
            v-if="!item?.mmo_id"
            class="text-black font-weight-bold"
            style="font-size: 12px"
            @click="gotoMallDetail(item)"
          >
            <div class="d-flex align-center" style="width: 100%">
              <div style="width: 20% !important" class="py-1">
                <v-img
                  height="40"
                  style="
                    width: 100% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                  "
                  :src="item?.mainImage"
                >
                  <template #placeholder>
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </template>
                </v-img>
              </div>
              <div style="width: 80% !important" class="pl-2">
                <p class="mb-1">
                  {{ `${item?.name} (${item?.subIndustryName})` }}
                </p>
                <p class="text-grey">
                  <span>{{ `${item?.town}` }}</span> (<span class="text-red">{{
                    `${item?.distanceText}`
                  }}</span
                  ><span class="text-black"> away</span>)
                </p>
              </div>
            </div>
          </div>
          <div
            v-else
            class="mb-2 text-black font-weight-bold"
            style="font-size: 12px"
            @click="gotoMerchantDetail(item)"
          >
            <div class="d-flex align-center" style="width: 100%">
              <div style="width: 20% !important" class="py-1">
                <v-img
                  height="40"
                  style="
                    width: 100% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                  "
                  :src="item?.image"
                >
                  <template #placeholder>
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </template>
                </v-img>
              </div>
              <div style="width: 80% !important" class="pl-2">
                <p class="mb-1">
                  {{ item?.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import moment from "moment-timezone";
import { setAuthHeader } from "@/util/axios";
import axios from "@/util/axios";
import app from "@/util/eventBus";
// import app from "@/util/eventBus";
export default {
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: "Header",
  props: [
    "isWelcome",
    "titleHeader",
    "isHeader",
    "isDesktop",
    "isProfile",
    "isSignin",
    "isBatamProperties",
  ],
  data() {
    return {
      platformFee: null,
      taxAmount: null,
      isBestViewed: false,
      isQRCode: false,
      viewCart: false,
      isApply: false,
      isEmployment: false,
      isCheck: false,
      path: "",
      footerData: {
        company_name: "",
        location: "",
        mobile_number: "",
        whats_app: "",
        email_id: "",
        copyright: "",
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
      },
      trendingBtn: [],
      isDetail: false,
      logo: null,
      tokenStart: null,
      userImage: null,
      userName: null,
      userDated: null,
      isLoading: false,
      dialog: false,
      dialog2: false,
      drawer: false,
      openMobileSearchBar: false,
      headerData: {},
      search: null,
      activeMalls: [],
      countryId: null,
      currentTime: "",
      screenWidth: window.innerWidth,
      selectedPlace: null,
      selectedCountry: "Singapore",
      selectedLocation: {
        country_id: 1,
        currency_symbol: "S$",
        country: "Singapore",
        city: "Singapore City",
      },
      locationDropdown: [],
      isTrending: false,
      trendings: [],
      trendingCard: [],
    };
  },
  watch: {
    $route() {
      this.search = null;
    },
  },
  computed: {
    ...mapState(["itemSelected"]),
    ...mapState(["itemSelected2"]),
    ...mapState(["itemSelectedComplete"]),
    ...mapState(["itemSelected2Complete"]),
    ...mapState(["detailHeader"]),
    ...mapState(["countryRecognised"]),
    ...mapState(["idCountryRecognised"]),
    ...mapState(["skillRecognised"]),
    ...mapState(["idSkillRecognised"]),
    ...mapState(["selectedCountry"]),
    ...mapState(["activeTag"]),
    latitude() {
      return localStorage.getItem("latitude");
    },
    longitude() {
      return localStorage.getItem("longitude");
    },
    countryDevice() {
      return localStorage.getItem("countryDevice");
    },
    isSmall() {
      return this.screenWidth < 640;
    },
    filteredMalls() {
      if (!this.search) return this.activeMalls;
      return this.activeMalls.filter((item) =>
        item.brand_name.toLowerCase().includes(this.search.toLowerCase()),
      );
    },
    tokenProvider() {
      // Mendapatkan URL dari browser
      const url = new URL(window.location.href);

      // Mendapatkan nilai token dari parameter query 'token'
      const tokenParam = url.searchParams.get("token");
      if (tokenParam) {
        localStorage.setItem("token", tokenParam);
      }

      // Mengupdate data 'token' dalam komponen dengan nilai yang ditemukan
      return tokenParam;
    },
    token() {
      return localStorage.getItem("token");
    },
    authToken() {
      return localStorage.getItem("token");
    },
    isPrivacy() {
      return this.$route.path == "/privacy-policy";
    },
    isFavorites() {
      return this.$route.path == "/my-favorites";
    },
    isTerms() {
      return this.$route.path == "/our-terms";
    },
    isMyProfile() {
      return this.$route.path == "/my-profile";
    },
    isProduct() {
      return this.$route.path.includes("product");
    },
    isMobileProduct() {
      return this.screenWidth < 640 && this.$route.path.includes("product");
    },
    isResumeProfile() {
      return this.$route.path == "/resume-profile";
    },
    isHome() {
      return this.$route.path === "/";
    },
    isSpecific() {
      return this.$route.params.name;
    },
    isRecognised() {
      return this.$route.path === "/recognised-qualifications";
    },
    isDetailPage() {
      return this.$route.path.includes("detail");
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    setInterval(this.updateTime, 1000);
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (this.tokenProvider != null) {
      setAuthHeader(this.tokenProvider);
      this.getHeaderUserData();
    } else if (token) {
      setAuthHeader(token);
      this.getHeaderUserData();
    }
    this.search = null;
    this.getAppContact();
    this.getTrendingCardData();
    this.getLocationDropDownData();
    this.getLogo();
    this.getProductCategoryListData();

    app.config.globalProperties.$eventBus.$on(
      "changeHeaderPath",
      this.changeHeaderPath,
    );
    app.config.globalProperties.$eventBus.$on(
      "getTokenStart",
      this.getTokenStart,
    );
    app.config.globalProperties.$eventBus.$on(
      "getTrendingCardData2",
      this.getTrendingCardData2,
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderImage",
      this.changeHeaderImage,
    );
    app.config.globalProperties.$eventBus.$on(
      "getHeaderUserData",
      this.getHeaderUserData,
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderWelcome3",
      this.changeHeaderWelcome3,
    );

    // this.isTrending = this.$route.name.includes("Trending");
  },
  beforeUnmount() {
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderPath",
      this.changeHeaderPath,
    );
    app.config.globalProperties.$eventBus.$off(
      "getTokenStart",
      this.getTokenStart,
    );
    app.config.globalProperties.$eventBus.$off(
      "getTrendingCardData2",
      this.getTrendingCardData2,
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderImage",
      this.changeHeaderImage,
    );
    app.config.globalProperties.$eventBus.$off(
      "getHeaderUserData",
      this.getHeaderUserData,
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderWelcome3",
      this.changeHeaderWelcome3,
    );
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapMutations([
      "setActiveTag",
      "setItemSelected",
      "setItemSelectedComplete",
      "setItemSelected2",
      "setItemSelected2Complete",
      "setSelectedTrending",
      "setCountryRecognised",
      "setSkillRecognised",
      "setIdCountryRecognised",
      "setIdSkillRecognised",
      "setFooterData",
      "setCategoryData",
      "setSelectedCountry",
      "setIsCartEmpty",
      "setUserName",
    ]),
    capitalizeFirstLetter(sentence) {
      const words = sentence.split(" ");
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
      }
      const capitalizedSentence = words.join(" ");
      return capitalizedSentence;
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    toggleMobileSearchBar() {
      this.openMobileSearchBar = !this.openMobileSearchBar;
    },
    changeHeaderPath(path) {
      //console.log(image)
      this.path = path;
    },
    getTokenStart(tokenParam) {
      this.tokenStart = tokenParam;
    },
    getTrendingCardData2() {
      this.tokenStart = null;
    },
    changeHeaderImage(image) {
      // console.log(image);
      this.userImage = this.$fileURL + image;
    },

    changeHeaderWelcome3() {
      this.getHeaderUserData2();
      // this.titleWelcome = title;
    },
    getAppContact() {
      // this.isLoading = true;
      axios
        .get(`/app/contact/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          this.setFooterData(data);
          this.footerData = {
            company_name: data.company_name || "",
            location: data.location || "",
            mobile_number: data.mobile_number || "",
            whats_app: data.whats_app || "",
            email_id: data.email_id || "",
            copyright: data.copyright || "",
            facebook: data.facebook || "",
            twitter: data.twitter || "",
            instagram: data.instagram || "",
            youtube: data.youtube || "",
          };
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    loginGypsy() {
      this.$router.push("/sign-in");
    },

    logout() {
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          localStorage.setItem("name", null);
          localStorage.setItem("userName", null);
          localStorage.setItem("g_id", null);
          localStorage.setItem("user_image", null);
          localStorage.setItem("token", null);
          app.config.globalProperties.$eventBus.$emit("getUserName");
          this.path = "/";
          window.location.href = "/";
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getHeaderUserData() {
      this.isLoading = true;
      //console.log(this.tokenProvider);
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-user`, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          //console.log(data);

          this.userName = data.name;
          localStorage.setItem("userName", data.name);
          this.userDated = data.last_login;
          this.userImage =
            data.image != null ? this.$fileURL + data.image : null;
          app.config.globalProperties.$eventBus.$emit("getUserName");
          // this.userImage = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status == 401);
          if (error.response.status == 401) {
            localStorage.setItem("name", null);
            localStorage.setItem("userName", null);
            localStorage.setItem("g_id", null);
            localStorage.setItem("user_image", null);
            localStorage.setItem("token", null);
            app.config.globalProperties.$eventBus.$emit("getUserName");
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getHeaderUserData2() {
      this.isLoading = true;
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          console.log(data);

          this.userName = data.name;
          this.userDated = data.last_login;
          this.userImage =
            data.image != null ? this.$fileURL + data.image : null;
          // this.userImage = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    gotoMallDetail(item) {
      this.dialog2 = false;
      this.$router.push(`/mall-id/${item?.id}`);
      localStorage.setItem("mallDetailData", JSON.stringify(item));
    },
    gotoMerchantDetail(item) {
      this.dialog2 = false;
      this.$router.push(`/merchant-id/${item?.merchant_id}`);
      localStorage.setItem("merchantDetailData", JSON.stringify(item));
    },
    async getProductCategoryListData() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/categories-with-products/app/${this.$appId}`,
        );
        const data = response.data.data;
        this.setCategoryData(data);
        // Flatten data dan kelompokkan berdasarkan brand_id
        const groupedBrands = {};
        const processedMalls = [];

        data.forEach((category) => {
          category.brands.forEach((brand) => {
            brand.products.forEach((product, index) => {
              const key = brand.brand_id;
              if (!groupedBrands[key]) {
                groupedBrands[key] = true; // Tandai bahwa brand ini sudah muncul
                processedMalls.push({
                  ...product,
                  brand_id: brand.brand_id,
                  brand_name: brand.brand_name,
                  product_id: product.product_id,
                  category_id: category.category_id,
                  slug: product.product_name.toLowerCase().replace(/\s+/g, "-"),
                  country_id: brand?.country?.country_id,
                  country_name: brand?.country?.country_name,
                  showBrandName: true, // Hanya produk pertama dalam brand yang menampilkan nama brand
                  isCount: false,
                  count: 1,
                });
              } else {
                processedMalls.push({
                  ...product,
                  brand_id: brand.brand_id,
                  brand_name: brand.brand_name,
                  product_id: product.product_id,
                  category_id: category.category_id,
                  slug: product.product_name.toLowerCase().replace(/\s+/g, "-"),
                  country_id: brand?.country?.country_id,
                  country_name: brand?.country?.country_name,
                  showBrandName: false, // Produk lainnya tidak menampilkan nama brand
                  isCount: false,
                  count: 1,
                });
              }
            });
          });
        });

        this.activeMalls = processedMalls;
        // console.log("iniii", this.activeMalls);
      } catch (error) {
        console.error("Error fetching product categories:", error);
      } finally {
        this.isLoading = false;
      }
    },
    updateTime() {
      // Ambil zona waktu Singapore
      const singaporeTime = moment().tz("Asia/Singapore");
      // Format waktu dalam hh:mm:ss
      this.currentTime = singaporeTime.format("HH:mm:ss");
    },
    getLogo() {
      axios
        .get(`/app/logo/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.logo = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getTrendingCardData() {
      // this.isLoading = true;
      axios
        .get(`/skillgroups/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.trendingCard = data.map((item) => {
            return {
              id: item.sgm_id || 1,
              img: item.image || "",
              title: item.group_name || "",
              tag: item.group_name || "",
              desc: item.description || "",
            };
          });
          this.trendingBtn = data.map((item) => {
            return {
              id: item.sgm_id || 1,
              title: item.group_name || "",
              tag: item.group_name || "",
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getLocationDropDownData() {
      this.isLoading = true;
      axios
        .get(`/app-city-list/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          // console.log("country: ", data);
          this.locationDropdown = data.map((country) => {
            return {
              country_id: country.country_id,
              currency_symbol: country.currency_symbol,
              country: country.country_name,
              flagUrl: country.flag,
              cities: [
                {
                  city_id: country.city_id,
                  country_id: country.country_id,
                  currency_symbol: country.currency_symbol,
                  name: country.city_name,
                  imageUrl: country.city_image,
                  count: country.product_count,
                },
              ],
            };
          });
          const defaultCountry = this.locationDropdown[0];
          const defaultCity = defaultCountry.cities[0];
          this.selectLocation(defaultCountry, defaultCity);
          // console.log("country: ", this.locationDropdown);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log("country", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    selectLocation(country, city) {
      // console.log(country.currency_symbol);
      this.selectedLocation = {
        ...city,
        currency_symbol: country.currency_symbol ?? "S$",
        country_id: country.country_id,
        country: country.country,
        city: city.name,
      };
      this.setSelectedCountry(this.selectedLocation);
      // this.$store.dispatch(
      //   "getDeliveryCharges",
      //   this.selectedLocation.country_id,
      // );
      // console.log("selected: ", this.selectedLocation);
    },
    goToPath(data) {
      this.setSelectedTrending(data);
      this.$router.push(data.to);
    },
    filterMalls(value, query, item) {
      if (!query) return true;
      const text = query.toLowerCase();
      return (
        item.raw.brand_name.toLowerCase().includes(text) ||
        item.raw.product_name.toLowerCase().includes(text)
      );
    },
  },
};
</script>

<script setup>
// import { useStore } from "vuex";
// import { useCart } from "@/composables/useCart";
// import { watch, computed } from "vue";

// Import images
import homeIcon from "@/assets/images/icons/home.png";
import shopperIcon from "@/assets/images/icons/menu-shopper.png";
import shopIcon from "@/assets/images/icons/shop.png";
import userIcon from "@/assets/images/icons/user_icon.png";
import facebookIcon from "@/assets/images/icons/facebook.png";
import instaIcon from "@/assets/images/icons/insta.png";
import tiktokIcon from "@/assets/images/icons/tiktok.png";
import whatsappIcon from "@/assets/whatsapp.svg";

// Make images available to template
const images = {
  home: homeIcon,
  shopper: shopperIcon,
  shop: shopIcon,
  user: userIcon,
  facebook: facebookIcon,
  instagram: instaIcon,
  tiktok: tiktokIcon,
  whatsapp: whatsappIcon,
};

// const store = useStore();
// const { isInCart, cartQuantity, addToCart, updateQuantity } = useCart();

// const token = computed(() => {
//   return localStorage.getItem("token");
// });

// const getDeliveryCharges = () => {
//   store.dispatch("getDeliveryCharges", 1);
// };

// const addToCartData = (data, range) => {
//   // console.log(token.value);
//   if (token.value == "null") {
//     store.commit("setIsNotLoggedIn", true);
//   } else {
//     addToCart(data, range);
//   }
// };

// watch(() => {
//   getDeliveryCharges();
// });
</script>

<style scoped>
.app-bar-mobile-start {
  height: 28vh !important;
}

header.v-sheet.v-app-bar {
  height: 172px !important;
}

.v-app-bar.v-toolbar {
  max-width: 100%;
}

.logo-img-container {
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  /* set to whatever value suits your needs */
}

@media (max-width: 599px) {
  .logo-img-container {
    min-height: 50px;
    /* set to whatever value suits your needs */
    min-width: 50px;
    /* set to whatever value suits your needs */
  }
}

.logo-img {
  width: 100%;
  height: 100%;
}

.divider {
  background: black;
  width: 2px;
  height: 80px;
}

.navbar-header {
  align-items: center;
  gap: 25px;
  font-size: 20px;
  color: black;
  font-weight: 700;
}

.navbar-header-mobile {
  font-size: 12px;
  /* display: grid !important;
  grid-template-columns: 1fr 1fr !important; */
}

.btn_sign__up-cont {
  position: relative;
  overflow: hidden;
  background: #0197d5;
  width: min-content;
  box-sizing: border-box;
}

.btn_sign__up-cont:hover {
  outline: 2px #eeeeee solid;
}

.btn_sign__up-cont-drawer {
  position: relative;
  overflow: hidden;
  background: #0197d5;
  width: min-content;
  box-sizing: border-box;
}

.btn_sign__up-cont-drawer:hover {
  outline: 2px #eeeeee solid;
}

@media (max-width: 599px) {
  .btn_sign__up-cont {
    display: none;
  }
}

.btn_sign__up span {
  z-index: 1000;
  margin-top: auto;
  margin-bottom: auto;
}

.btn_sign__up-hover {
  position: absolute;
  border-radius: 50%;
  bottom: -50px;
  height: 50px;
  width: 100%;
  background: #002e41;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}

.btn_sign__up-cont:hover .btn_sign__up-hover {
  bottom: 0px;
  border-radius: 0px;
}

.btn_sign__up-drawer-hover {
  position: absolute;
  border-radius: 50%;
  bottom: -50px;
  height: 50px;
  width: 100%;
  background: #002e41;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}

.btn_sign__up-cont-drawer:hover .btn_sign__up-drawer-hover {
  bottom: 0px;
  border-radius: 0px;
}

.w15 {
  width: 15%;
}

.w85 {
  width: 85%;
}

.gap-2 {
  gap: 8px;
}

.gap-2 {
  gap: 8px;
}

.v-list-item {
  min-height: 44px !important;
}

.v-list-item--active {
  background-color: #f5f5f5;
}

.searchCityName {
  font-size: 12px !important;
}

.location-selector {
  background-color: #f5f5f5 !important;
  border-radius: 8px;
  padding: 0 10px;
  height: 40px;
}

.location-selector:hover {
  background-color: #eeeeee !important;
}

#trending-filter-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

#trending-filter-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

#scroll-trending {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  gap: 8px;
  padding-bottom: 4px;
}

/* Make buttons more compact on mobile */
@media (max-width: 599px) {
  #scroll-trending .v-btn {
    padding: 0 16px !important;
  }
}

/* Add media query for small screens */
@media (max-width: 599px) {
  .btn_sign__up {
    width: 100%; /* Make button full width */
  }

  /* Add this to the parent container to enable flex wrapping */
  .v-app-bar > .v-container {
    flex-wrap: wrap;
  }
  .mobile__navbar__search {
    width: 55% !important;
    height: 35px !important;
    margin-left: 15px !important;
  }

  .search-button {
    padding: 6px 6px !important;
    right: 2px !important;
  }
}
</style>
