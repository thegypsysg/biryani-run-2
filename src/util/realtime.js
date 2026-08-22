import Pusher from "pusher-js";

let pusher = null;
let subscribedGypsyId = null;

function getPusher() {
  if (pusher) {
    return pusher;
  }

  pusher = new Pusher(
    import.meta.env.VITE_PUSHER_APP_KEY || "cb64160300835ef9b22f",
    {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || "ap1",
      forceTLS: true,
    }
  );

  return pusher;
}

export function subscribePartnerIncoming(gypsyId, onIncomingOrder) {
  if (!gypsyId) {
    return;
  }

  unsubscribePartnerIncoming();
  subscribedGypsyId = gypsyId;

  const channel = getPusher().subscribe(`partner-incoming.${gypsyId}`);
  channel.bind("incoming-order", (payload) => {
    onIncomingOrder?.(payload);
  });
}

export function unsubscribePartnerIncoming() {
  if (pusher && subscribedGypsyId != null) {
    pusher.unsubscribe(`partner-incoming.${subscribedGypsyId}`);
    subscribedGypsyId = null;
  }
}
