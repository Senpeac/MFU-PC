function getCurrentUser() {
  const user = localStorage.getItem('mfuUser');
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user, token) {
  if (user && token) {
    localStorage.setItem('mfuUser', JSON.stringify(user));
    localStorage.setItem('mfuToken', token);
  } else {
    localStorage.removeItem('mfuUser');
    localStorage.removeItem('mfuToken');
  }
}

function renderHeader(activePage = '') {
  const user = getCurrentUser();
  const header = document.getElementById('site-header');
  if (!header) return;

  header.innerHTML = `
    <div class="navbar">
      <a class="logo" href="/">MFU PC</a>
      <nav>
        <a href="/" ${activePage === 'home' ? 'class="active"' : ''}>หน้าแรก</a>
        <a href="/products.html" ${activePage === 'products' ? 'class="active"' : ''}>สินค้า</a>
        <a href="/cart.html" ${activePage === 'cart' ? 'class="active"' : ''}>ตะกร้า</a>
        ${user ? `<a href="/profile.html" ${activePage === 'profile' ? 'class="active"' : ''}>บัญชีผู้ใช้</a>` : ''}
        ${user && user.role === 'admin' ? `<a href="/admin.html" ${activePage === 'admin' ? 'class="active"' : ''}>แอดมิน</a>` : ''}
        ${user ? '<button id="logout-btn" class="btn" style="padding:0.4rem 1rem;">ออกจากระบบ</button>' : '<a href="/login.html" class="btn">เข้าสู่ระบบ</a>'}
      </nav>
    </div>
  `;

  if (user) {
    document.getElementById('logout-btn').addEventListener('click', () => {
      setCurrentUser(null, null);
      window.location.href = '/';
    });
  }
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <p>© ${year} MFU PC. ศูนย์รวมสินค้าไอทีครบวงจร</p>
    <p>ติดต่อเรา: support@mfu-pc.com | 02-123-4567</p>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  renderHeader(page);
  renderFooter();
});
