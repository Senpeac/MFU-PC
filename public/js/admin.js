function requireAdmin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  if (user.role !== 'admin') {
    window.location.href = '/';
    return null;
  }
  return user;
}

async function loadAdminProducts() {
  const container = document.getElementById('admin-product-list');
  container.innerHTML = '<p>กำลังโหลดสินค้า...</p>';
  try {
    const products = await fetchProducts();
    if (!products.length) {
      container.innerHTML = '<p>ยังไม่มีสินค้า</p>';
      return;
    }

    container.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>ชื่อสินค้า</th>
            <th>ราคา</th>
            <th>สต็อก</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product) => `
                <tr data-id="${product._id}">
                  <td>${product.name}</td>
                  <td>฿${product.price.toLocaleString()}</td>
                  <td>${product.stock}</td>
                  <td>
                    <button class="btn" data-action="edit">แก้ไข</button>
                    <button class="btn" data-action="delete" style="background:#dc3545;">ลบ</button>
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    `;

    container.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        populateProductForm(row.dataset.id);
      });
    });

    container.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('ยืนยันการลบสินค้า?')) return;
        const row = btn.closest('tr');
        try {
          await deleteProduct(row.dataset.id);
          loadAdminProducts();
        } catch (error) {
          alert('ลบสินค้าไม่สำเร็จ: ' + error.message);
        }
      });
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>โหลดสินค้าล้มเหลว</p>';
  }
}

async function populateProductForm(productId) {
  try {
    const product = await fetchProduct(productId);
    document.getElementById('product-id').value = product._id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-brand').value = product.brand || '';
    document.getElementById('product-image').value = product.imageUrl || '';
  } catch (error) {
    alert('ไม่สามารถดึงข้อมูลสินค้าได้');
  }
}

async function loadAdminOrders() {
  const container = document.getElementById('admin-order-list');
  container.innerHTML = '<p>กำลังโหลดคำสั่งซื้อ...</p>';
  try {
    const orders = await fetchAllOrders();
    if (!orders.length) {
      container.innerHTML = '<p>ยังไม่มีคำสั่งซื้อ</p>';
      return;
    }

    container.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ลูกค้า</th>
            <th>ยอดรวม</th>
            <th>สถานะ</th>
            <th>อัปเดต</th>
          </tr>
        </thead>
        <tbody>
          ${orders
            .map(
              (order) => `
                <tr>
                  <td>${order._id}</td>
                  <td>${order.user?.name || '-'}<br />${order.user?.email || ''}</td>
                  <td>฿${order.totalPrice.toLocaleString()}</td>
                  <td>${order.status}</td>
                  <td>
                    <select data-id="${order._id}">
                      <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>pending</option>
                      <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>paid</option>
                      <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>shipped</option>
                      <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>completed</option>
                      <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>cancelled</option>
                    </select>
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    `;

    container.querySelectorAll('select').forEach((select) => {
      select.addEventListener('change', async (event) => {
        try {
          await updateOrderStatus(event.target.dataset.id, { status: event.target.value });
        } catch (error) {
          alert('อัปเดตสถานะไม่สำเร็จ: ' + error.message);
        }
      });
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>โหลดคำสั่งซื้อล้มเหลว</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;

  loadAdminProducts();
  loadAdminOrders();

  const form = document.getElementById('product-form');
  const message = document.getElementById('product-message');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    const payload = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: Number(document.getElementById('product-price').value),
      stock: Number(document.getElementById('product-stock').value),
      category: document.getElementById('product-category').value,
      brand: document.getElementById('product-brand').value,
      imageUrl: document.getElementById('product-image').value,
    };

    try {
      const productId = document.getElementById('product-id').value;
      if (productId) {
        await updateProduct(productId, payload);
        message.textContent = 'อัปเดตสินค้าเรียบร้อย';
      } else {
        await createProduct(payload);
        message.textContent = 'เพิ่มสินค้าเรียบร้อย';
      }
      form.reset();
      loadAdminProducts();
    } catch (error) {
      message.textContent = 'เกิดข้อผิดพลาด: ' + error.message;
    }
  });

  document.getElementById('reset-form').addEventListener('click', () => {
    form.reset();
    document.getElementById('product-id').value = '';
    message.textContent = '';
  });
});
