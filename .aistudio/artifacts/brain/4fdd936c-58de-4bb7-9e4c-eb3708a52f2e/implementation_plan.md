# Kế Hoạch Hoàn Thiện & Kiểm Thử Toàn Diện Website Lớp 10/12

## 1. Tổng Quan Dự Án
Kiểm thử toàn diện và hoàn thiện website lưu bút & cộng đồng lớp 10/12 (THPT Chuyên Nguyễn Huệ, niên khóa 2024 - 2027) theo phong cách **Dark Academia & Handwritten Journal**, chuyển đổi từ mô hình lưu trữ cục bộ sang **Firebase Authentication & Cloud Firestore**, đảm bảo dữ liệu vĩnh viễn, bảo mật phân quyền thực tế, tùy biến giao diện trực quan và trải nghiệm mượt mà trên mọi thiết bị.

---

## 2. Giải Quyết Chi Tiết 10 Yêu Cầu Của Người Dùng

### Yêu Cầu 1: Hệ Thống Đăng Nhập Admin Xác Thực Thực Tế
- **Giải pháp**:
  - Kích hoạt **Firebase Authentication** (Email & Password) cho quản trị viên.
  - Cung cấp tài khoản quản trị mặc định khởi tạo (`admin@lop1012.edu.vn` / mật khẩu bảo mật) với khả năng đổi mật khẩu trực tiếp trong CMS.
  - Sử dụng `onAuthStateChanged` để duy trì phiên đăng nhập bền vững qua Firebase SDK, ngăn chặn đăng nhập giả lập.
  - Tự động khóa các trang quản trị CMS và thao tác ghi dữ liệu nếu chưa xác thực Firebase Auth.

### Yêu Cầu 2 & 3: Lưu Trữ Hình Ảnh & Nội Dung Vào Firestore
- **Giải pháp**:
  - Tổ chức cấu trúc cơ sở dữ liệu Cloud Firestore theo chuẩn RESTful / Document-Collection:
    - `site_config/class_info`: Thông tin chung, slogan, GVCN, niên khóa, ảnh bìa, lời nhắn tập thể.
    - `site_config/theme_settings`: Tùy chỉnh màu sắc `#111111`, `#1B1B1B`, `#F0EBDD`, `#B9A58A`, kích thước chữ và font chữ.
    - `site_config/layout_settings`: Tùy chọn bố cục gallery (`masonry` | `polaroid` | `grid` | `list`) và cờ ẩn/hiện từng mục.
    - `gallery`: Danh sách ảnh, chú thích, ngày chụp, albumId, cờ nổi bật, payload ảnh base64 tối ưu.
    - `albums`: Các album chủ đề (Khai giảng, 20/11, 26/3, Dã ngoại).
    - `members`: Danh sách 42 thành viên, ảnh chân dung, biệt danh, vai trò, châm ngôn.
    - `journals`: Các bài viết nhật ký thanh xuân, tác giả, ngày lưu bút, ảnh đính kèm.
    - `activities`: Hoạt động, phong trào, giải thưởng, ngày tổ chức.
  - Tích hợp nén ảnh client-side thông minh trước khi lưu vào Firestore để tải nhanh và tối ưu dung lượng.

### Yêu Cầu 4: Lưu Trữ Điều Chỉnh Bố Cục
- **Giải pháp**:
  - Bảng điều khiển CMS mục "Chỉnh sửa bố cục" cho phép:
    - Lựa chọn 4 kiểu bố cục Thư viện ảnh: **Masonry (Lưới so le)**, **Polaroid (Thẻ ảnh hoài niệm)**, **Grid (Lưới vuông đều)**, **List (Danh sách dọc chi tiết)**.
    - Bật/tắt hiển thị từng phân vùng trên trang chủ (Banner, Khung lời nhắn kẻ vở, Giới thiệu & GVCN, Thành viên, Thư viện ảnh, Nhật ký, Hoạt động).
  - Mọi thay đổi lưu trực tiếp vào Firestore `site_config/layout_settings` và tự động áp dụng ngay lập tức cho trang công khai.

### Yêu Cầu 5: Thay Đổi Font Chữ, Màu Sắc, Kích Thước Có Hiệu Lực Thực Tế
- **Giải pháp**:
  - Xây dựng hệ thống **CSS Custom Variables** động tại `:root` (hoặc container chính):
    - `--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`, `--color-border`.
    - `--font-scale` (Nhỏ: 14px, Vừa: 16px, Lớn: 18px).
    - Bộ font viết tay tiêu đề (`Caveat`, `Patrick Hand`, `Playfair Display`) và nội dung (`Nunito`, `Be Vietnam Pro`).
  - Trong Admin CMS mục "Cài đặt website", cung cấp bộ chọn Theme Presets:
    - *Dark Academia Cổ Điển* (#111111, #1B1B1B, #B9A58A)
    - *Sepia Vintage Hoài Niệm* (#1a1512, #241e1a, #c89b6b)
    - *Midnight Scholar Tối Thượng* (#0d1117, #161b22, #8b949e)
  - Thay đổi được phản ánh tức thì (live preview) trên toàn trang và lưu vào Firestore.

### Yêu Cầu 6 & 7: Giao Diện Admin Hoạt Động Đầy Đủ, Không Để Nút Trang Trí
- **Giải pháp**:
  - Kiểm tra và liên kết chức năng thực tế 100% cho tất cả các nút:
    - Nút CTA Hero: "Khám phá lớp mình" (chuyển mượt tới Giới thiệu), "Xem kỷ niệm" (chuyển tới Thư viện ảnh).
    - Nút lọc album: Lọc ảnh chính xác theo album đã chọn.
    - Nút tìm kiếm thành viên: Lọc real-time theo tên, vai trò, biệt danh.
    - Nút mở Lightbox ảnh: Phóng to toàn màn hình, chuyển ảnh trước/sau, đóng bằng phím ESC hoặc nút X.
    - Nút xem chi tiết thành viên: Mở trang lưu bút cá nhân của thành viên.
    - Nút Cuộn lên đầu trang (`Scroll to Top`).
    - Các nút CRUD trong Admin: Thêm ảnh, Xóa ảnh, Đặt làm ảnh nổi bật, Thêm thành viên, Sửa thông tin, Xóa thành viên, Thêm bài viết, Sửa bài viết, Lưu thay đổi, Khôi phục mặc định.

### Yêu Cầu 8: Kiểm Tra Quyền Truy Cập (RBAC)
- **Giải pháp**:
  - Người dùng công khai (học sinh, phụ huynh, khách truy cập): Chỉ có quyền đọc (`read`) dữ liệu và xem giao diện.
  - Quản trị viên (Admin): Đăng nhập với Firebase Auth để thực hiện các quyền tạo (`create`), sửa (`update`), xóa (`delete`).
  - Thiết lập `firestore.rules` bảo vệ chặt chẽ: chỉ cho phép ghi dữ liệu khi `request.auth != null`.

### Yêu Cầu 9: Không Bị Mất Dữ Liệu Sau Khi Tải Lại Trang
- **Giải pháp**:
  - Dữ liệu được tải trực tiếp từ Cloud Firestore khi mở trang.
  - Có cơ chế cache cục bộ dự phòng (IndexedDB/LocalStorage) trong trường hợp mất kết nối mạng để trang web luôn hiển thị nội dung ngay lập tức.
  - Bổ sung chỉ báo trạng thái lưu ("Đã lưu vào Firestore", "Đang lưu...", "Lỗi kết nối") để quản trị viên hoàn toàn an tâm.

### Yêu Cầu 10: Kiểm Tra Responsive Toàn Diện Trên Điện Thoại
- **Giải pháp**:
  - Sử dụng Playwright CLI kiểm tra giao diện trên cả Desktop (1440x900) và Mobile (390x844).
  - Tối ưu thanh điều hướng Mobile Drawer, bảng điều khiển CMS trên màn hình dọc, bố cục lưới ảnh Polaroid và kích thước chữ trên màn hình nhỏ.

---

## 3. Các Bước Triển Khai Cụ Thể

1. **Bước 1**: Khởi tạo Firebase Firestore và Firebase Authentication bằng công cụ `show_aistudio_ui` (`firebase_setup`) và `rpc_action`.
2. **Bước 2**: Cấu hình Firebase Client SDK (`src/services/firebase.ts`) và quy tắc bảo mật `firestore.rules`.
3. **Bước 3**: Khởi tạo dữ liệu mẫu lớp 10/12 ban đầu lên Firestore nếu cơ sở dữ liệu trống.
4. **Bước 4**: Nâng cấp hệ thống Theme & CSS Variables để hỗ trợ đổi màu sắc, font chữ, kích cỡ chữ có hiệu lực tức thì toàn trang.
5. **Bước 5**: Hoàn thiện toàn bộ các tính năng CRUD trong `AdminDashboard.tsx` kết nối trực tiếp với Firestore & Firebase Auth.
6. **Bước 6**: Kiểm tra toàn bộ các nút bấm và luồng tương tác trên trang công khai và trang quản trị.
7. **Bước 7**: Chạy `compile_applet` và `lint_applet` để đảm bảo mã nguồn chuẩn TypeScript và không có lỗi tiềm ẩn.
8. **Bước 8**: Tự động hóa kiểm thử bằng `playwright-cli` (Desktop + Mobile) và chụp ảnh màn hình báo cáo kết quả.
