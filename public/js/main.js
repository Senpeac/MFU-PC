const defaultCategories = [
  { title: 'คอมประกอบ', description: 'สเปกแรง ประกอบให้พร้อมใช้งาน' },
  { title: 'โน้ตบุ๊กเกมมิ่ง', description: 'เล่นเกมลื่นไหลทุกแบรนด์ยอดนิยม' },
  { title: 'การ์ดจอ', description: 'เลือกการ์ดจอที่เหมาะกับงานและเกมของคุณ' },
  { title: 'อุปกรณ์เสริม', description: 'จอภาพ คีย์บอร์ด เมาส์ และอุปกรณ์เสริมครบครัน' },
];

async function loadFeaturedProducts() {
  try {
    const products = await fetchProducts({ limit: 6 });
    const container = document.getElementById('featured-products');
    if (!products.length) {
      container.innerHTML = '<p>ยังไม่มีสินค้า กรุณากลับมาใหม่ภายหลัง</p>';
      return;
    }

    container.innerHTML = products
      .slice(0, 6)
      .map(
        (product) => `
        <article class="product-card">
          <img src="${product.imageUrl || 'https://via.placeholder.com/300x200?text=MFU+PC'}" alt="${product.name}" />
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description.substring(0, 80)}...</p>
            <span class="price">฿${product.price.toLocaleString()}</span>
            <a class="btn" href="/products.html#${product._id}">รายละเอียด</a>
          </div>
        </article>
      `
      )
      .join('');
  } catch (error) {
    console.error(error);
    document.getElementById('featured-products').innerHTML =
      '<p>ไม่สามารถโหลดสินค้าได้ โปรดลองใหม่อีกครั้ง</p>';
  }
}

function renderCategories() {
  const container = document.getElementById('category-list');
  container.innerHTML = defaultCategories
    .map(
      (cat) => `
      <article class="category-card">
        <h3>${cat.title}</h3>
        <p>${cat.description}</p>
        <a href="/products.html" class="btn">ดูสินค้า</a>
      </article>
    `
    )
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  loadFeaturedProducts();
});
