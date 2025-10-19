function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
  }
  return user;
}

async function loadProfile() {
  try {
    const profile = await fetchProfile();
    document.getElementById('profile-name').value = profile.name;
    document.getElementById('profile-email').value = profile.email;
    document.getElementById('profile-address').value = profile.address || '';
  } catch (error) {
    console.error(error);
    document.getElementById('profile-message').textContent = 'ไม่สามารถโหลดข้อมูลได้';
  }
}

async function loadOrders() {
  const container = document.getElementById('order-history');
  container.innerHTML = '<p>กำลังโหลดคำสั่งซื้อ...</p>';
  try {
    const orders = await fetchMyOrders();
    if (!orders.length) {
      container.innerHTML = '<p>ยังไม่มีคำสั่งซื้อ</p>';
      return;
    }

    container.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>รหัสคำสั่งซื้อ</th>
            <th>ยอดรวม</th>
            <th>สถานะ</th>
            <th>วันที่</th>
          </tr>
        </thead>
        <tbody>
          ${orders
            .map(
              (order) => `
                <tr>
                  <td>${order._id}</td>
                  <td>฿${order.totalPrice.toLocaleString()}</td>
                  <td><span class="badge">${order.status}</span></td>
                  <td>${new Date(order.createdAt).toLocaleString('th-TH')}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดคำสั่งซื้อ</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = requireLogin();
  if (!user) return;
  loadProfile();
  loadOrders();

  const form = document.getElementById('profile-form');
  const message = document.getElementById('profile-message');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    try {
      const result = await updateProfile({
        name: document.getElementById('profile-name').value,
        address: document.getElementById('profile-address').value,
        password: document.getElementById('profile-password').value || undefined,
      });
      document.getElementById('profile-password').value = '';
      message.textContent = 'บันทึกข้อมูลสำเร็จ';
      setCurrentUser(result.user, localStorage.getItem('mfuToken'));
    } catch (error) {
      message.textContent = error.message;
    }
  });
});
