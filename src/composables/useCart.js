import { computed } from "vue";
import { useStore } from "vuex";
// import { fileURL } from "@/util/variables";
import { ref } from "vue";
import axios from "@/util/axios";
const authToken = localStorage.getItem("token");

export function useCart() {
  const store = useStore();
  const cart = computed(() => store.state.cart);
  const selectedCountry = computed(() => {
    return store.state.selectedCountry;
  });

  const platformFee = ref(null);
  const getPlatformFee = async () => {
    let data = null;

    try {
      await axios
        .get(`/get-app-id`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            company_name: "Biryani Run",
          },
        })
        .then((response) => {
          data = response.data.data?.app_id;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });

      const response = await axios.get(`/get-platform-fee`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          app_id: data,
        },
      });

      platformFee.value = parseFloat(response.data.data?.platform_fee);
    } catch (error) {
      console.error("Error getting tax rate:", error);
      // const message = error.response?.data?.message || "Something went wrong!";
      // snackbar.value = true;
      // message.value = {
      //     text: message,
      //     color: "error"
      // };
    } finally {
      // savingAddress.value = false;
    }
  };

  const taxAmount = ref(null);
  const getTaxAmount = async () => {
    let data = null;

    try {
      await axios
        .get(`/gypsy-user`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          data = response.data.data?.country_current;
        })
        .catch((_) => {});

      const response = await axios.get(`/get-tax-amount`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          country_id: data,
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

  const isInCart = (product, brpId2 = null) => {
    return cart.value.some((item) => {
      const matchBrp = item.brp_id === product?.biryaniRunPrice?.brp_id || item.brp_id === product?.brp_id;
      const matchBrp2 = brpId2 ? item.brp_id_2 === brpId2 : !item.brp_id_2;
      return matchBrp && matchBrp2;
    });
  };

  const cartQuantity = (product, brpId2 = null) => {
    const item = cart.value.find((item) => {
      const matchBrp = item.brp_id === product?.biryaniRunPrice?.brp_id || item.brp_id === product?.brp_id;
      const matchBrp2 = brpId2 ? item.brp_id_2 === brpId2 : !item.brp_id_2;
      return matchBrp && matchBrp2;
    });
    return item ? item.quantity : 0;
  };

  const addToCart = (product, brpId2 = null) => {
    console.log(product);
    getPlatformFee();
    getTaxAmount();

    const cartMasterData = {
      app_id: 7,
      country_id: selectedCountry.value ? selectedCountry.value.country_id : 1,
      city_id: selectedCountry.value ? selectedCountry.value.city_id : 1,
      brp_id: product?.biryaniRunPrice?.brp_id
        ? product.biryaniRunPrice?.brp_id
        : product?.brp_id
          ? product.brp_id
          : null,
      qty: 1,
    };

    if (brpId2) {
      cartMasterData.brp_id_2 = brpId2;
    }

    // console.log(selectedCountry.value);

    // console.log({ cartMasterData });
    store.dispatch("addToCart", cartMasterData);
  };

  const updateQuantity = (product, change, brpId2 = null) => {
    const brpId = product?.biryaniRunPrice?.brp_id
      ? product?.biryaniRunPrice?.brp_id
      : product?.brp_id
        ? product?.brp_id
        : null;

    const cartItem = cart.value.find((item) => {
      const matchBrp = item.brp_id === brpId;
      const matchBrp2 = brpId2 ? item.brp_id_2 === brpId2 : !item.brp_id_2;
      return matchBrp && matchBrp2;
    });

    if (!cartItem) return;

    const cartMasterData = {
      cart_id: cartItem.cart_id,
      brp_id: brpId,
      change: change,
    };

    if (brpId2) {
      cartMasterData.brp_id_2 = brpId2;
    }

    store.dispatch("updateCart", cartMasterData);
  };

  // const increaseQuantity = (product) => updateQuantity(product, 1);
  // const decreaseQuantity = (product) => updateQuantity(product, -1);

  return {
    isInCart,
    updateQuantity,
    cartQuantity,
    addToCart,
    // increaseQuantity,
    // decreaseQuantity,
  };
}
