// Central contact config — edit here to update across the whole site.
// Phone in international E.164 format without "+" for WhatsApp; with "+" for tel:.
export const CONTACT = {
  phoneIntl: "919999999999", // WhatsApp uses digits only (country code + number)
  phoneDisplay: "+91 99999 99999",
  whatsappMessage: "Hello AgriKart Fin, I would like to know more about your services.",
  email: "support@agrikartfin.com",
};

export const waLink = (msg = CONTACT.whatsappMessage) =>
  `https://wa.me/${CONTACT.phoneIntl}?text=${encodeURIComponent(msg)}`;

export const telLink = () => `tel:+${CONTACT.phoneIntl}`;
