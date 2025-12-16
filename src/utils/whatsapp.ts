const WHATSAPP_NUMBER = '9779815888721';
const SHOP_NAME = 'Nepal Gift House';
const GOOGLE_MAPS_LINK = 'https://maps.app.goo.gl/4GQduP9t81mdoFk96';

interface ProductOrderData {
  name: string;
  price: number;
  offerPrice?: number | null;
}

export function generateWhatsAppLink(product?: ProductOrderData): string {
  let message = `Hello ${SHOP_NAME}! 👋\n\n`;

  if (product) {
    message += `I'm interested in:\n`;
    message += `📦 *${product.name}*\n\n`;
    message += `💰 Price: Rs. ${product.price}\n`;

    if (product.offerPrice && product.offerPrice < product.price) {
      const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);
      message += `🎉 Offer Price: Rs. ${product.offerPrice} (${discount}% OFF)\n\n`;
    } else {
      message += '\n';
    }
  } else {
    message += `I would like to know more about your products.\n\n`;
  }

  message += `📍 Location: ${GOOGLE_MAPS_LINK}\n\n`;
  message += `Please confirm availability and delivery details. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function openWhatsApp(product?: ProductOrderData): void {
  const link = generateWhatsAppLink(product);
  window.open(link, '_blank');
}

export const CONTACT_INFO = {
  phone: '+977 9815888721',
  whatsapp: WHATSAPP_NUMBER,
  shopName: SHOP_NAME,
  googleMaps: GOOGLE_MAPS_LINK,
  displayPhone: '9815888721',
};
