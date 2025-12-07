function initAdminAccount() {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Nếu chưa có users, tạo admin mặc định
  if (users.length === 0) {
    users = [{
      id: 1,
      username: 'admin',
      password: 'admin123',
      fullname: 'Administrator',
      email: 'admin@bookshop.com',
      role: 'admin', // ← Đây là admin
      createdAt: new Date().toISOString()
    }];
    localStorage.setItem('users', JSON.stringify(users));
    console.log('✅ Đã tạo tài khoản admin mặc định');
  }
}

// Gọi khởi tạo admin khi load trang
initAdminAccount();

// ===== HÀM ĐĂNG KÝ (cho trang dangky.html) =====
function register() {
  // Lấy giá trị từ form đăng ký
  const username = document.getElementById('user').value.trim();
  const password = document.getElementById('pass').value.trim();
  
  // Kiểm tra validation
  if (!username || !password) {
    alert('⚠️ Vui lòng điền đầy đủ thông tin!');
    return;
  }
  
  if (username.length < 3) {
    alert('⚠️ Tên đăng nhập phải có ít nhất 3 ký tự!');
    return;
  }
  
  if (password.length < 6) {
    alert('⚠️ Mật khẩu phải có ít nhất 6 ký tự!');
    return;
  }
  
  // Lấy danh sách users
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Khởi tạo admin nếu chưa có
  if (users.length === 0) {
    initAdminAccount();
    users = JSON.parse(localStorage.getItem('users'));
  }
  
  // Kiểm tra username đã tồn tại chưa
  if (users.some(u => u.username === username)) {
    alert('❌ Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
    return;
  }
  
  // Tạo user mới với role = 'user'
  const newUser = {
    id: Date.now(),
    username: username,
    password: password,
    fullname: username,
    email: username.includes('@') ? username : '',
    role: 'user', // ← Người dùng thường
    createdAt: new Date().toISOString()
  };
  
  // Thêm vào danh sách
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  alert('✅ Đăng ký thành công!\n\nBạn có thể đăng nhập ngay bây giờ.');
  
  // Chuyển về trang đăng nhập
  window.location.href = 'dangnhap2.html';
}

// ===== HÀM ĐĂNG NHẬP (cho trang dangnhap2.html) =====
function login() {
  // Lấy giá trị từ form đăng nhập (dangnhap2.html dùng ID: loginUser, loginPass)
  const usernameInput = document.getElementById('loginUser');
  const passwordInput = document.getElementById('loginPass');
  
  if (!usernameInput || !passwordInput) {
    alert('❌ Lỗi: Không tìm thấy form đăng nhập!');
    return;
  }
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  // Validation
  if (!username || !password) {
    alert('⚠️ Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
    return;
  }
  
  // Lấy danh sách users
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Nếu chưa có users, tạo admin mặc định
  if (users.length === 0) {
    initAdminAccount();
    users = JSON.parse(localStorage.getItem('users'));
  }
  
  // Tìm user khớp username và password
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    alert('❌ Tên đăng nhập hoặc mật khẩu không đúng!\n\nVui lòng thử lại hoặc đăng kí tài khoản mới!');
    return;
  }
  
  // Lưu thông tin user đang đăng nhập
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Thông báo thành công
  alert(`✅ Đăng nhập thành công!\n\nXin chào ${user.fullname || user.username}!`);
  
  // Chuyển hướng dựa trên role
  if (user.role === 'admin') {
    console.log('🔑 Admin đăng nhập - chuyển đến trang quản trị');
    window.location.href = 'admin.html'; // ← Admin vào trang quản trị
  } else {
    console.log('👤 User thường đăng nhập - chuyển đến trang chính');
    window.location.href = 'phanchinh.html'; // ← User thường vào trang chính
  }
}

// ===== HÀM ĐĂNG XUẤT =====
function logout() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    localStorage.removeItem('currentUser');
    alert('👋 Đã đăng xuất thành công!');
    window.location.href = 'dangnhap2.html';
  }
}

// ===== HÀM KIỂM TRA ĐĂNG NHẬP =====
function checkLogin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('⚠️ Bạn cần đăng nhập để truy cập trang này!');
    window.location.href = 'dangnhap2.html';
    return null;
  }
  return currentUser;
}

// ===== HÀM LẤY USER HIỆN TẠI =====
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// ===== HÀM XEM DANH SÁCH USERS (Debug) =====
function viewAllUsers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  console.table(users);
  return users;
}

// ===== HÀM RESET DỮ LIỆU (Debug) =====
function resetAllData() {
  if (confirm('⚠️ XÓA TẤT CẢ dữ liệu?\nHành động này không thể hoàn tác!')) {
    localStorage.clear();
    alert('✅ Đã xóa toàn bộ dữ liệu!');
    location.reload();
  }
}

// ===== LOG THÔNG TIN HỆ THỐNG =====
console.log('🚀 Hệ thống đăng nhập/đăng ký đã được tải');
console.log('📊 Số lượng users:', JSON.parse(localStorage.getItem('users') || '[]').length);
console.log('👤 User hiện tại:', getCurrentUser() ? getCurrentUser().username : 'Chưa đăng nhập');
console.log('💡 Gõ viewAllUsers() để xem danh sách users');
console.log('💡 Gõ resetAllData() để xóa toàn bộ dữ liệu');

// ===== ẨN NÚT ADMIN KHI CHƯA ĐĂNG NHẬP HOẶC KHÔNG PHẢI ADMIN =====
function hideAdminButton() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Tìm mọi thẻ a có chữ ADMIN
    const adminLinks = document.querySelectorAll('a');

    adminLinks.forEach(link => {
        if (link.textContent.trim().toUpperCase() === "ADMIN") {

            // Nếu chưa đăng nhập → ẨN
            if (!currentUser) {
                link.style.display = "none";
                return;
            }

            // Nếu user thường → ẨN
            if (currentUser.role !== "admin") {
                link.style.display = "none";
            }
        }
    });
}

// Chạy khi trang load
document.addEventListener("DOMContentLoaded", hideAdminButton);