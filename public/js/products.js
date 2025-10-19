async function renderProducts(params = {}) {
  const list = document.getElementById('product-list');
  list.innerHTML = '<p>กำลังโหลด...</p>';
  try {
    const products = await fetchProducts(params);
    if (!products.length) {
      list.innerHTML = '<p>ไม่พบสินค้า</p>';
      return;
    }

    const productMap = {};
    list.innerHTML = products
      .map((product) => {
        productMap[product._id] = {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        };
        return `
        <article class="product-card" id="product-${product._id}">
          <img src="${product.imageUrl || 'https://via.placeholder.com/300x200?text=MFU+PC'}" alt="${product.name}" />
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description.substring(0, 120)}...</p>
            <span class="price">฿${product.price.toLocaleString()}</span>
            <button class="btn" data-id="${product._id}">เพิ่มลงตะกร้า</button>
          </div>
        </article>
      `;
      })
      .join('');

    list.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const productData = productMap[btn.dataset.id];
        addToCart(productData, 1);
      });
    });

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const highlight = document.getElementById(`product-${hash}`);
      if (highlight) {
        highlight.scrollIntoView({ behavior: 'smooth' });
        highlight.classList.add('active-product');
      }
    }
  } catch (error) {
    console.error(error);
    list.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดสินค้า</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const filterBtn = document.getElementById('filter-btn');
  const runFilter = () => {
    const params = {};
    const search = document.getElementById('search-input').value.trim();
    const category = document.getElementById('category-input').value.trim();
    const brand = document.getElementById('brand-input').value.trim();
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;

    if (search) params.search = search;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    renderProducts(params);
  };

  filterBtn.addEventListener('click', runFilter);
  renderProducts();
});
