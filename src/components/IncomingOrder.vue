<template>
  <div v-if="visible" class="incoming-order" role="dialog" aria-label="Incoming Order">
    <div class="incoming-order__header">
      <div class="incoming-order__heading">
        <h1 class="incoming-order__title">Incoming Order</h1>
        <div v-if="deadlineLabel" class="incoming-order__deadline">
          {{ deadlineLabel }}
        </div>
      </div>

      <div class="incoming-order__timer">
        <svg viewBox="0 0 180 180" class="incoming-order__ring">
          <circle class="incoming-order__ring-track" cx="90" cy="90" r="82" />
          <circle
            class="incoming-order__ring-progress"
            cx="90"
            cy="90"
            r="82"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
          />
        </svg>
        <span class="incoming-order__seconds">{{ secondsLeft }}</span>
      </div>
    </div>

    <div class="incoming-order__card">
      <div class="incoming-order__merchant">
        <img
          v-if="logoSrc"
          :src="logoSrc"
          :alt="order.restaurant_name || 'Restaurant'"
          class="incoming-order__logo"
        />
        <div
          v-else
          class="incoming-order__logo incoming-order__logo--fallback"
        >
          {{ merchantInitial }}
        </div>
        <span class="incoming-order__name">{{
          order.restaurant_name || "Restaurant"
        }}</span>
      </div>

      <div class="incoming-order__rule"></div>

      <p class="incoming-order__items">
        <span class="incoming-order__items-count">{{ itemCount }}</span>
        {{ itemCount === 1 ? "Item" : "Items" }}
      </p>

      <p class="incoming-order__price">
        <v-icon size="18" color="#2e7d32">mdi-circle-multiple</v-icon>
        <span>{{ formattedPrice }}</span>
      </p>

      <div class="incoming-order__location">
        <v-icon size="18" color="#c62828">mdi-target</v-icon>
        <span class="incoming-order__postal">{{
          order.postal_code || "—"
        }}</span>
        <span class="incoming-order__divider"></span>
        <span class="incoming-order__town">{{ order.town_name || "—" }}</span>
      </div>
      <p v-if="order.unit_number" class="incoming-order__unit">
        {{ order.unit_number }}
      </p>

      <button
        type="button"
        class="incoming-order__accept"
        @click="acceptOrder"
      >
        <span class="incoming-order__accept-icon">
          <v-icon size="16" color="#1565c0">mdi-arrow-right</v-icon>
        </span>
        Accept Order
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import axios from "@/util/axios";
import eventBusApp from "@/util/eventBus";
import { fileURL } from "@/util/variables";
import {
  subscribePartnerIncoming,
  unsubscribePartnerIncoming,
} from "@/util/realtime";

const TIMER_SECONDS = 10;
const circumference = 2 * Math.PI * 82;

const visible = ref(false);
const order = ref({});
const secondsLeft = ref(TIMER_SECONDS);
let timerId = null;

const deadlineLabel = computed(() => {
  if (order.value.deadline_label) {
    return order.value.deadline_label;
  }
  const date = order.value.delivery_date;
  const by = order.value.delivery_by;
  if (date && by) return `${date} | By ${by}`;
  return date || "";
});

const itemCount = computed(() => Number(order.value.item_count || 0));

const formattedPrice = computed(() => {
  const symbol = order.value.currency_symbol || "S$";
  const amount = Number(order.value.final_amount || 0);
  return `${symbol} ${amount.toFixed(2)}`;
});

const logoSrc = computed(() => {
  const logo = order.value.restaurant_logo;
  if (!logo) return "";
  if (String(logo).startsWith("http")) return logo;
  return fileURL + logo;
});

const merchantInitial = computed(() => {
  const name = order.value.restaurant_name || "R";
  return name.charAt(0).toUpperCase();
});

const progressOffset = computed(() => {
  const progress = secondsLeft.value / TIMER_SECONDS;
  return circumference * (1 - progress);
});

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
};

const dismiss = () => {
  stopTimer();
  visible.value = false;
  secondsLeft.value = TIMER_SECONDS;
};

const acceptOrder = () => {
  dismiss();
};

const startTimer = () => {
  stopTimer();
  secondsLeft.value = TIMER_SECONDS;
  timerId = setInterval(() => {
    secondsLeft.value -= 1;
    if (secondsLeft.value <= 0) {
      dismiss();
    }
  }, 1000);
};

const showIncomingOrder = (payload) => {
  if (!payload) return;
  order.value = payload;
  visible.value = true;
  startTimer();
};

const currentGypsyId = () => {
  const raw =
    localStorage.getItem("partner_gypsy_id") ||
    localStorage.getItem("gypsy_id") ||
    localStorage.getItem("g_id");
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
};

const rememberPartnerGypsy = (id, isPartner) => {
  if (!id) return;
  localStorage.setItem("gypsy_id", String(id));
  if (isPartner) {
    localStorage.setItem("partner_gypsy_id", String(id));
  }
};

const resolveGypsyId = async () => {
  const cached = currentGypsyId();
  const token = localStorage.getItem("token");

  if (!token || token === "null") {
    return cached;
  }

  try {
    const response = await axios.get("/gypsy-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = response.data?.data;
    const id = user?.gypsy_id;
    const isPartner = Boolean(user?.partner_name || user?.partner);
    rememberPartnerGypsy(id, isPartner);
    if (id && !isPartner) {
      localStorage.removeItem("partner_gypsy_id");
    }
    return id ? Number(id) : cached;
  } catch (error) {
    console.warn("[IncomingOrder] could not resolve gypsy id", error);
  }

  return cached;
};

const attachListener = async () => {
  const cached = currentGypsyId();
  if (cached) {
    subscribePartnerIncoming(cached, showIncomingOrder);
  }

  const gypsyId = await resolveGypsyId();
  if (!gypsyId) {
    if (!cached) {
      unsubscribePartnerIncoming();
    }
    return;
  }

  if (gypsyId !== cached) {
    subscribePartnerIncoming(gypsyId, showIncomingOrder);
  }
};

onMounted(() => {
  attachListener();
  eventBusApp.config.globalProperties.$eventBus.$on("getUserName", attachListener);
});

onBeforeUnmount(() => {
  stopTimer();
  unsubscribePartnerIncoming();
  eventBusApp.config.globalProperties.$eventBus.$off("getUserName", attachListener);
});
</script>

<style scoped>
.incoming-order {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 4000;
  width: min(360px, calc(100vw - 24px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  background: #c8e6c9;
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  font-family: "Roboto", sans-serif;
  pointer-events: auto;
}

.incoming-order__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.incoming-order__heading {
  min-width: 0;
  flex: 1;
}

.incoming-order__title {
  margin: 0 0 8px;
  color: #8b1a1a;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.2px;
  line-height: 1.2;
}

.incoming-order__deadline {
  display: inline-block;
  background: #fff;
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 700;
  font-size: 0.72rem;
  color: #111;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.incoming-order__timer {
  position: relative;
  flex: 0 0 64px;
  width: 64px;
  height: 64px;
}

.incoming-order__ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.incoming-order__ring-track,
.incoming-order__ring-progress {
  fill: #fff;
  stroke-width: 10;
}

.incoming-order__ring-track {
  stroke: #81c784;
}

.incoming-order__ring-progress {
  stroke: #43a047;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.9s linear;
}

.incoming-order__seconds {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.55rem;
  font-weight: 800;
  color: #111;
  line-height: 1;
}

.incoming-order__card {
  width: 100%;
  background: #fff;
  border-radius: 14px;
  padding: 12px 12px 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.incoming-order__merchant {
  display: flex;
  align-items: center;
  gap: 10px;
}

.incoming-order__logo {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
  flex-shrink: 0;
}

.incoming-order__logo--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #8b1a1a;
}

.incoming-order__name {
  font-size: 0.98rem;
  font-weight: 800;
  color: #111;
  line-height: 1.25;
}

.incoming-order__rule {
  height: 1px;
  background: #111;
  margin: 8px 0 10px;
}

.incoming-order__items {
  margin: 0 0 4px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #111;
}

.incoming-order__items-count {
  color: #c62828;
}

.incoming-order__price {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 6px;
  color: #2e7d32;
  font-size: 1rem;
  font-weight: 800;
}

.incoming-order__location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.88rem;
}

.incoming-order__postal {
  color: #111;
}

.incoming-order__divider {
  width: 2px;
  height: 14px;
  background: #111;
}

.incoming-order__town {
  color: #c62828;
}

.incoming-order__unit {
  margin: 2px 0 0;
  text-align: center;
  color: #1565c0;
  font-weight: 800;
  font-size: 0.85rem;
}

.incoming-order__accept {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 12px;
  padding: 9px 14px 9px 40px;
  border: 0;
  border-radius: 999px;
  background: #1565c0;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  position: relative;
}

.incoming-order__accept-icon {
  position: absolute;
  left: 6px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
