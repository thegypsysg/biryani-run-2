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

  const isInCart = (product) => {
    return cart.value.some(
      (item) => item.brp_id === product.biryaniRunPrice.brp_id,
    );
  };

  const cartQuantity = (product) => {
    const item = cart.value.find(
      (item) => item.brp_id === product.biryaniRunPrice.brp_id,
    );
    return item ? item.quantity : 0;
  };

  const addToCart = (product) => {
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
    console.log(selectedCountry.value);

    6; // console.log({ cartMasterData });
    store.dispatch("addToCart", cartMasterData);
  };

  const findSimilarItems = (cart, product) => {
    const similarItems = [];
    cart.forEach((item) => {
      // if (product.product_name.includes(item.name)) {
      //   similarItems.push(item);
      // }
      if (item.brp_id === product.biryaniRunPrice.brp_id) {
        similarItems.push(item);
      }
    });

    return similarItems;
  };

  const updateQuantity = (product, change) => {
    const cartItems = findSimilarItems(cart.value, product);
    const cartMasterData = {
      app_id: 7,
      country_id: selectedCountry.value ? selectedCountry.value.country_id : 1,
      city_id: selectedCountry.value ? selectedCountry.value.city_id : 1,
      brp_id: product?.biryaniRunPrice?.brp_id,
      qty:
        cartItems.length > 0
          ? cartItems[0].quantity + (change == "increase" ? 1 : -1)
          : 0,
    };
    // store.dispatch("updateCart", cartMasterData);
    store.dispatch("addToCart", cartMasterData);
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
