<template>
  <!-- <v-container class="mt-6 footer_lks"> -->
  <v-row class="mx-auto px-2 px-md-10 mt-10 pb-6">
    <v-col cols="12" sm="12" md="3">
      <h2 class="footer_title">About {{ footerData?.company_name }}</h2>
      <p class="footer_paragraph" style="margin-bottom: 16px; margin-top: 34px">
        {{ footerData?.company_name + " is a " + appDetails1?.app_detail }}
      </p>
      <ul class="footer_social">
        <li>
          <v-icon
            color="#FA2964"
            size="20"
            class="mr-2 mdi mdi-map-marker"
            aria-hidden="true"
          />
          {{ footerData?.location }}
        </li>
        <li>
          <v-icon
            color="#FA2964"
            size="20"
            class="mr-2 fa fa-phone"
            aria-hidden="true"
          />
          {{ footerData?.mobile_number }}
        </li>
        <li>
          <v-icon color="#FA2964" size="20" class="mr-2 fab fa-whatsapp" />
          {{ footerData?.whats_app }}
        </li>
        <li>
          <v-icon
            color="#FA2964"
            size="20"
            class="mr-2 fa fa-envelope"
            aria-hidden="true"
          />
          <a :href="`mailto:${footerData?.email_id}`">{{
            footerData?.email_id
          }}</a>
        </li>
      </ul>
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <h2 class="footer_title" style="margin-bottom: 16px">
        Trending Categories
      </h2>
      <ul class="footer_links" style="margin-top: 37px">
        <li
          v-for="item in menuLists?.slice(0, 5)"
          :key="item.id"
          @click="
            scrollToSection(formatName(item.title), isSmall ? true : false)
          "
          class="font-weight-bold cursor-pointer"
        >
          {{ item.title }}
        </li>
      </ul>
      <div class="mt-4">
        <span
          @click="
            scrollToSection(
              formatName(menuLists[0].title),
              isSmall ? true : false,
            )
          "
          class="view-all cursor-pointer"
          >View all</span
        >
      </div>
    </v-col>
    <v-col cols="12" sm="12" md="3">
      <h2 class="footer_title">Featured Restaurants</h2>
      <div class="categories-grid mt-6">
        <v-row dense>
          <v-col
            v-for="item in menuLists?.slice(0, 6)"
            :key="item.id"
            cols="4"
            class="pa-1 pa-md-3"
          >
            <div
              class="category-item"
              @click="
                scrollToSection(formatName(item.title), isSmall ? true : false)
              "
            >
              <!-- <div class="category-title mb-2">{{ item.title }}</div> -->
              <v-img
                :src="$fileURL + item.img"
                :height="isSmall ? '90' : '65'"
                cover
                class="rounded"
              >
              </v-img>
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="mt-4">
        <a href="#" class="view-all">View all</a>
      </div>
    </v-col>
    <v-col cols="12" md="3">
      <div class="mobile-app-section">
        <p class="coming-soon">Coming Soon...</p>
        <p class="explore-text">
          Explore {{ footerData?.company_name }} on your Mobile
        </p>
        <div class="store-buttons">
          <a href="#" class="store-link">
            <img alt="Google Play Store" src="@/assets/images/play-store.jpg" />
          </a>
          <a href="#" class="store-link">
            <img alt="Apple App Store" src="@/assets/images/app-store.jpg" />
          </a>
        </div>
      </div>
      <!-- <input class="footer_input" placeholder="Type your email" /> -->
      <!-- <div class="footer-btn-cont">
          <v-btn
            class="footer-btn"
            style="
              width: inherit;
              border-radius: 0 !important;
              margin-top: 16px;
              background: #00cdcd;
              color: white;
            "
          >
            <span>Get started</span>
          </v-btn>
          <div class="footer-btn-hover" />
        </div> -->
    </v-col>
  </v-row>
  <!-- </v-container> -->

  <v-footer
    class="bg-black text-center justify-center footer__content mb-14 mb-md-0"
    :class="{ 'pb-4': isSmall }"
  >
    <v-spacer />

    <div class="footer_text">
      {{ footerData?.copyright }}
    </div>
    <div style="display: flex; justify-content: center">
      <v-btn
        v-if="footerData?.facebook"
        :href="footerData?.facebook"
        variant="text"
        color="#FA2964"
        icon="mdi-facebook"
      />
      <v-btn
        v-if="footerData?.twitter"
        :href="footerData?.twitter"
        variant="text"
        color="#FA2964"
        icon="mdi-twitter"
      />
      <v-btn
        v-if="footerData?.instagram"
        :href="footerData?.instagram"
        variant="text"
        color="#FA2964"
        icon="mdi-instagram"
      />
      <v-btn
        v-if="footerData?.youtube"
        :href="footerData?.youtube"
        variant="text"
        color="#FA2964"
        icon="mdi-youtube"
      />
      <v-btn
        v-if="footerData?.tiktok"
        :href="footerData?.tiktok"
        variant="text"
        color="#FA2964"
        class="rounded-circle"
        size="50"
      >
        <i class="fa-brands fa-tiktok"></i>
      </v-btn>
      <v-btn
        v-if="footerData?.linkedin"
        :href="footerData?.linkedin"
        variant="text"
        color="#FA2964"
        class="rounded-circle"
        size="50"
      >
        <i class="fa-brands fa-linkedin-in"></i>
      </v-btn>
    </div>
  </v-footer>
  <a
    onclick='window.scrollTo({top: 0, behavior: "smooth"});'
    class="go-up px-0 py-2"
    style="display: inline; border: 1px solid rgba(0, 0, 0, 0.3)"
  >
    <i class="fa fa-long-arrow-up" aria-hidden="true"></i>
  </a>
</template>

<script>
import axios from "@/util/axios";
import app from "@/util/eventBus";
export default {
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: "Footer",
  data() {
    return {
      isLoading: false,
      userName: null,
      categoryCard: [],
      appDetails1: null,
      appDetails2: null,
      superAppData: null,
      footerData: null,
      screenWidth: window.innerWidth,
      menuLists: [],
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
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
  },
  mounted() {
    this.getAppContact();
    this.getAppDetails1();
    this.getSupeApp();
    this.getAppDetails2();
    this.getMenuList();

    const token = localStorage.getItem("token");
    if (this.tokenProvider != null) {
      this.getHeaderUserData();
    } else if (token) {
      this.getHeaderUserData();
    }

    app.config.globalProperties.$eventBus.$on(
      "getTokenStart",
      this.getTokenStart,
    );
    app.config.globalProperties.$eventBus.$on(
      "getHeaderUserData",
      this.getHeaderUserData,
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderWelcome2",
      this.changeHeaderWelcome2,
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderWelcome3",
      this.changeHeaderWelcome3,
    );
    app.config.globalProperties.$eventBus.$on("getUserName", this.getUserName);
  },
  beforeUnmount() {
    app.config.globalProperties.$eventBus.$off(
      "getTokenStart",
      this.getTokenStart,
    );
    app.config.globalProperties.$eventBus.$off(
      "getHeaderUserData",
      this.getHeaderUserData,
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderWelcome2",
      this.changeHeaderWelcome2,
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderWelcome3",
      this.changeHeaderWelcome3,
    );
    app.config.globalProperties.$eventBus.$off("getUserName", this.getUserName);
  },
  methods: {
    scrollToSection(sectionId, mobile) {
      const cardSection = document.getElementById(sectionId);

      // this.$nextTick(() => {
      if (cardSection) {
        const cardRect = cardSection.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const offset = mobile
          ? cardRect.top + scrollTop - 220
          : cardRect.top + scrollTop - 100; // Nilai offset yang diinginkan, dalam piksel

        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
      // });
      // window.scrollBy(0, -scrollOffset);
    },

    formatName(name) {
      return name.toLowerCase().replace(/\s+/g, "");
    },

    getUserName(name) {
      this.userName = name;
    },
    loginGypsy() {
      this.$router.push("/sign-in");
    },
    getTokenStart(tokenParam) {
      this.tokenStart = tokenParam;
    },
    changeHeaderWelcome2() {
      this.userName = localStorage.getItem("name");
      this.getHeaderUserData();
      // this.titleWelcome = title;
    },
    changeHeaderWelcome3() {
      this.getHeaderUserData2();
      // this.titleWelcome = title;
    },
    async getMenuList() {
      try {
        const res = await axios.get(
          `/list-main-categories-by-app-id/${this.$appId}`,
        );
        console.log(res);
        this.menuLists = res.data.data.map((item) => ({
          title: item.category_name,
          img: item.main_image,
          id: item.mc_id,
        }));
        // console.log(menuLists.value);
      } catch (error) {
        console.log(error);
      }
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
          // this.userImage = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status == 401);
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
          console.log(data);
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
    openSearch() {
      app.config.globalProperties.$eventBus.$emit("openSearch");
    },
    goToTrending() {
      app.config.globalProperties.$eventBus.$emit("scrollToCardSection");
    },
    getAppDetails1() {
      // this.isLoading = true;
      axios
        .get(`/app/details/${this.$appId}`)
        .then((response) => {
          const data = response.data.data[0];
          this.appDetails1 = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getAppDetails2() {
      // this.isLoading = true;
      axios
        .get(`/categories/active-website/app/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          // this.appDetails = data.map((item) => {
          //   return {
          //     ...item,
          //     categoryId: item.category_id || 0,
          //     categoryName: item.category_name || '',
          //     description: item.description || '',
          //     image: item.image || '',
          //     slug: item.slug || '',
          //   };
          // })[0];
          this.categoryCard = data.map((item) => {
            return {
              id: item.category_id || 0,
              img: this.$fileURL + item.image || "",
              title: item.category_name || "",
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
    getSupeApp() {
      // this.isLoading = true;
      axios
        .get(`/get-super-app-by-id/${this.$superAppId}`)
        .then((response) => {
          const data = response.data.data;
          this.superAppData = data[0];
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getAppContact() {
      // this.isLoading = true;
      axios
        .get(`/app/contact/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          this.footerData = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
  },
};
</script>

<style scoped>
.our-apps {
  position: relative;
  overflow: hidden;
}
.our-apps-img {
  max-width: 100%;
  transition: all 0.3s;
  display: block;
  width: 100%;
  height: auto;
  transform: scale(1);
}

.our-apps:hover .our-apps-img {
  transform: scale(1.2);
}
.footer-btn-cont {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.footer-btn {
  width: 100%;
  height: 40px;
}

.footer-btn span {
  z-index: 1000;
}
.footer-btn-hover {
  position: absolute;
  border-radius: 50%;
  bottom: -40px;
  height: 40px;
  width: 100%;
  background: #002e41;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}

.footer-btn-cont:hover .footer-btn-hover {
  bottom: 0px;
  border-radius: 0px;
}

.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;
  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
}

.cart-mobile {
  position: fixed;
  width: 100%;
  bottom: 0;
  font-size: 14px;
  font-weight: 700;
  background: #fff;
  color: #36454f;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 2;
  line-height: 0;
}

.active-menu {
  border-top: 4px solid yellow;
}

.go-up {
  position: fixed;
  bottom: 5.7rem;
  z-index: 99999;
  right: 1rem;
  font-size: 1.5rem;
  background: transparent;
  color: rgba(0, 0, 0, 0.3) !important;
  border-radius: 5px;
  text-decoration: none;
  line-height: 0;
  display: none;
  -webkit-transition: all 0.5s ease;
  transition: all 0.5s ease;
}

.go-up:hover,
.go-up:focus {
  outline: 0;
  text-decoration: none;
  color: #fff;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.category-item {
  transition: transform 0.3s ease;
}

.category-item:hover {
  transform: scale(1.05);
}

.view-all {
  color: #ff1b6d;
  text-decoration: none;
  font-weight: 500;
}

.coming-soon {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.explore-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
}

.store-button {
  text-decoration: none;
  display: block;
}

.store-button img {
  height: 40px;
  object-fit: contain;
}

.store-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.store-link img {
  width: 120px;
  height: 30px;
  object-fit: contain;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .mobile-app-section {
    text-align: center;
    margin-top: 24px;
  }

  .store-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .store-link img {
    width: 100px;
    height: auto;
  }
}
</style>
