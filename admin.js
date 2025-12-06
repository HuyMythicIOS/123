// ===== KIỂM TRA QUYỀN ADMIN KHI VÀO TRANG =====
(function checkAdminAccess() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Nếu chưa đăng nhập hoặc không phải admin -> chặn truy cập
  if (!currentUser || currentUser.role !== 'admin') {
    alert('⛔ Bạn không có quyền truy cập trang này!\nChỉ Admin mới được vào.');
    window.location.href = 'dangnhap2.html';
    return;
  }
})();

// ===== HÀM KHỞI TẠO DỮ LIỆU MẪU =====
function initializeUsers() {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Nếu chưa có users, tạo tài khoản admin mặc định
  if (users.length === 0) {
    users = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123', // Trong thực tế nên mã hóa
        fullname: 'Administrator',
        email: 'admin@bookshop.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  return users;
}

// ===== HIỂN THỊ DANH SÁCH NGƯỜI DÙNG =====
function renderUsers(usersToRender = null) {
  const users = usersToRender || JSON.parse(localStorage.getItem('users')) || [];
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không có người dùng nào</td></tr>';
    return;
  }
  
  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.fullname || user.username}</td>
      <td>${user.email || 'N/A'}</td>
      <td><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">${user.role}</span></td>
      <td>${new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
      <td>
        ${user.role !== 'admin' ? 
          `<button class="btn-delete" onclick="deleteUser(${user.id})">Xóa</button>` : 
          '<span style="color:#999;">Không thể xóa</span>'}
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ===== XÓA NGƯỜI DÙNG =====
function deleteUser(userId) {
  if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
  
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const userToDelete = users.find(u => u.id === userId);
  
  // Bảo vệ tài khoản admin
  if (userToDelete && userToDelete.role === 'admin') {
    alert('⛔ Không thể xóa tài khoản Admin!');
    return;
  }
  
  users = users.filter(u => u.id !== userId);
  localStorage.setItem('users', JSON.stringify(users));
  renderUsers();
  alert('✅ Đã xóa người dùng thành công!');
}

// ===== XÓA TẤT CẢ (TRỪ ADMIN) =====
function clearAllUsers() {
  if (!confirm('⚠️ XÓA TẤT CẢ người dùng (trừ Admin)?\nHành động này không thể hoàn tác!')) return;
  
  let users = JSON.parse(localStorage.getItem('users')) || [];
  // Chỉ giữ lại các admin
  users = users.filter(u => u.role === 'admin');
  localStorage.setItem('users', JSON.stringify(users));
  renderUsers();
  alert('✅ Đã xóa tất cả người dùng (giữ lại Admin)');
}

// ===== TÌM KIẾM =====
function searchUsers(keyword) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const filtered = users.filter(u => 
    (u.fullname && u.fullname.toLowerCase().includes(keyword.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(keyword.toLowerCase())) ||
    (u.username && u.username.toLowerCase().includes(keyword.toLowerCase()))
  );
  renderUsers(filtered);
}

// ===== KHỞI TẠO TRANG =====
document.addEventListener('DOMContentLoaded', function() {
  initializeUsers();
  renderUsers();
  
  // Nút làm mới
  document.getElementById('btnRefresh').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    renderUsers();
  });
  
  // Nút xóa tất cả
  document.getElementById('btnClearAll').addEventListener('click', clearAllUsers);
  
  // Tìm kiếm
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchUsers(e.target.value);
  });
});