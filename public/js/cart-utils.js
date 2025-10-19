function getCart() {
  const cart = localStorage.getItem('mfuCart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('mfuCart', JSON.stringify(cart));
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item._id === product._id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart(cart);
  alert('เพิ่มสินค้าในตะกร้าแล้ว');
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item._id !== productId);
  saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem._id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.removeItem('mfuCart');
}
