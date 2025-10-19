function ensureAuthenticated() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
  }
  return user;
}

function renderSummary() {
  const summary = document.getElementById('order-summary');
  const cart = getCart();
  if (!cart.length) {
    summary.innerHTML = '<p>ไม่มีสินค้าในตะกร้า</p>';
    return;
  }

  let total = 0;
  summary.innerHTML = `
    <div class="form-container">
      <h2>สรุปคำสั่งซื้อ</h2>
      <ul style="list-style:none; padding:0;">
        ${cart
          .map((item) => {
            total += item.price * item.quantity;
            return `<li>${item.name} x ${item.quantity} = ฿${(item.price * item.quantity).toLocaleString()}</li>`;
          })
          .join('')}
      </ul>
      <p style="font-weight:700;">ยอดรวม: ฿${total.toLocaleString()}</p>
    </div>
  `;

  return total;
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = ensureAuthenticated();
  if (!user) return;

  const total = renderSummary();
  if (!total) return;

  try {
    const profile = await fetchProfile();
    document.getElementById('shipping-address').value = profile.address || '';
  } catch (error) {
    console.error('Profile error', error);
  }

  const form = document.getElementById('checkout-form');
  const message = document.getElementById('checkout-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) {
      message.textContent = 'ไม่มีสินค้าในตะกร้า';
      return;
    }

    try {
      const result = await createOrder({
        items: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
        paymentMethod: document.getElementById('payment-method').value,
        shippingAddress: document.getElementById('shipping-address').value,
      });
      message.textContent = 'สั่งซื้อสำเร็จ! หมายเลขคำสั่งซื้อ: ' + result.order._id;
      clearCart();
      form.reset();
    } catch (error) {
      message.textContent = 'เกิดข้อผิดพลาดในการสั่งซื้อ: ' + error.message;
    }
  });
});
