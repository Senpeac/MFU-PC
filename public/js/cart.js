function renderCart() {
  const itemsContainer = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const cart = getCart();

  if (!cart.length) {
    itemsContainer.innerHTML = '<p>ตะกร้าของคุณยังว่างอยู่</p>';
    totalEl.textContent = '';
    return;
  }

  let total = 0;
  itemsContainer.innerHTML = cart
    .map((item) => {
      total += item.price * item.quantity;
      return `
        <div class="cart-item">
          <div>
            <h3>${item.name}</h3>
            <p>฿${item.price.toLocaleString()} x ${item.quantity}</p>
          </div>
          <input type="number" min="1" value="${item.quantity}" data-id="${item._id}" />
          <button data-id="${item._id}">ลบ</button>
        </div>
      `;
    })
    .join('');

  totalEl.textContent = `ยอดรวม: ฿${total.toLocaleString()}`;

  itemsContainer.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (event) => {
      const newQty = Number(event.target.value);
      if (Number.isNaN(newQty) || newQty < 1) {
        event.target.value = 1;
        updateCartQuantity(event.target.dataset.id, 1);
        renderCart();
        return;
      }
      updateCartQuantity(event.target.dataset.id, newQty);
      renderCart();
    });
  });

  itemsContainer.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.id);
      renderCart();
    });
  });
}

document.addEventListener('DOMContentLoaded', renderCart);
