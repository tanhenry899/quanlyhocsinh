# 🌐 Hướng Dẫn Đưa Chiếc Nón Kỳ Diệu Lên Web Online Miễn Phí

Trò chơi được xây dựng bằng công nghệ Web chuẩn (HTML5, CSS3, JavaScript thuần) nên có thể chạy trực tuyến **hoàn toàn miễn phí 100% vĩnh viễn** trên cả **Vercel** và **GitHub Pages** mà không cần thuê hosting hay mua tên miền.

---

## ⚡ Cách 1: Đưa Lên Vercel (Tên miền miễn phí dạng `*.vercel.app`) - Nhanh nhất (1 phút)

Vercel cho phép tải trực tiếp cả thư mục lên mà không cần gõ lệnh.

### Các bước thực hiện:
1. **Đăng nhập Vercel**:
   - Truy cập trang web: [vercel.com](https://vercel.com/)
   - Bấm **Sign Up** hoặc **Log In** (có thể đăng nhập nhanh bằng tài khoản Google hoặc GitHub).
2. **Tải dự án lên**:
   - Sau khi vào Dashboard, bấm nút **Add New...** -> chọn **Project**.
   - Nếu bạn đã có kho GitHub: Chọn kho `chiec-non-ky-dieu-tieu-hoc` và bấm **Deploy**.
   - Hoặc cài đặt công cụ Vercel CLI trên máy tính để triển khai 1 dòng lệnh:
     ```bash
     npx vercel
     ```
3. **Nhận link web**:
   - Sau khoảng 20 giây, Vercel sẽ cấp cho bạn một đường link miễn phí dạng:  
     👉 `https://chiec-non-ky-dieu-tieu-hoc.vercel.app`
   - Bạn có thể gửi link này cho giáo viên khác hoặc mở trực tiếp trên máy chiếu/TV thông minh của lớp học.

---

## 🐙 Cách 2: Đưa Lên GitHub Pages (Tên miền `*.github.io`) - Bền vững nhất

GitHub Pages là dịch vụ lưu trữ trang web miễn phí của Microsoft / GitHub.

### Các bước thực hiện:
1. **Tạo kho lưu trữ (Repository) trên GitHub**:
   - Đăng nhập vào [github.com](https://github.com/).
   - Bấm dấu **+** ở góc trên bên phải -> chọn **New repository**.
   - Đặt tên kho, ví dụ: `chiec-non-ky-dieu`.
   - Chọn chế độ **Public** -> bấm **Create repository**.

2. **Tải mã nguồn lên GitHub**:
   - **Cách giao diện (Không cần gõ lệnh)**:
     - Trên trang kho vừa tạo, bấm nút **"uploading an existing file"**.
     - Kéo toàn bộ các file và thư mục (`index.html`, thư mục `css`, thư mục `js`, file `vercel.json`...) vào khung upload.
     - Bấm **Commit changes**.
   - **Cách dùng Git Command**:
     ```bash
     git init
     git add .
     git commit -m "Khoi tao Chiec Non Ky Dieu"
     git branch -M main
     git remote add origin https://github.com/<ten-tai-khoan>/chiec-non-ky-dieu.git
     git push -u origin main
     ```

3. **Bật tính năng GitHub Pages**:
   - Trong kho GitHub, bấm vào tab **Settings** (Cài đặt).
   - Ở cột bên trái, bấm chọn **Pages**.
   - Tại mục **Build and deployment**:
     - *Source*: Chọn **Deploy from a branch** (hoặc chọn **GitHub Actions** vì đã có sẵn file workflow cấu hình sẵn trong thư mục `.github/workflows/deploy.yml`).
     - *Branch*: Chọn nhánh `main` / `master`, thư mục `/ (root)` -> bấm **Save**.

4. **Nhận link web**:
   - Sau 1 - 2 phút, GitHub sẽ hiển thị đường link trang web của bạn:  
     👉 `https://<ten-tai-khoan>.github.io/chiec-non-ky-dieu/`

---

## 🚀 Cách 3: Netlify Drop (Siêu tốc - Kéo thả là chạy ngay trong 10 giây)

Nếu thầy/cô muốn có link chạy thử online ngay lập tức mà không cần tài khoản GitHub:
1. Truy cập: [app.netlify.com/drop](https://app.netlify.com/drop)
2. Kéo toàn bộ thư mục `chiec-non-ky-dieu-tieu-hoc` thả vào vòng tròn nét đứt trên màn hình.
3. Chờ 5 giây, Netlify sẽ cấp ngay 1 đường link trực tiếp (ví dụ: `https://chiec-non-tieu-hoc.netlify.app`) để mở ngay trên điện thoại hoặc máy chiếu!
