# 🎡 Chiếc Nón Kỳ Diệu - Gameshow Học Tập Tiểu Học

Ứng dụng Game Show truyền hình tương tác chuyên nghiệp dành cho giáo viên và học sinh tiểu học, tối ưu trình chiếu tỉ lệ **16:9** trên máy chiếu, màn hình TV thông minh hoặc bảng tương tác trong lớp học.

---

## 🌟 Điểm Nổi Bật & Tính Năng Đạt Chuẩn 100% Yêu Cầu

1. **Quay Ngẫu Nhiên Người Chơi Từng Câu Hỏi**:
   - Hiệu ứng đèn rọi sân khấu (Spotlight) quét qua khán đài 30 bàn học sinh với âm thanh kịch tính.
   - Học sinh được chọn sẽ đứng lên hào hứng và được chiếu sáng nổi bật trên khán đài.

2. **Quy Tắc Trả Lời 2 Lần**:
   - Mỗi câu hỏi có tối đa 2 lần trả lời.
   - **Trả lời đúng**: Cộng điểm, hiệu ứng tiền vàng bay vào bàn học sinh và chuyển sang câu hỏi tiếp theo.
   - **Trả lời sai lần 1**: Hệ thống phát còi báo hiệu, MC thông báo kích hoạt *"Lần Trả Lời 2: Cơ Hội Cứu Trợ"*, đèn sân khấu tự động quét chọn một bạn học sinh ngẫu nhiên khác để giải cứu câu hỏi này.
   - **Trả lời sai lần 2**: Hiển thị đáp án chính xác và lời giải thích chi tiết, không cộng điểm và chuyển sang câu hỏi kế tiếp.

3. **Chiếc Nón Kỳ Diệu Chuẩn Gameshow**:
   - Vẽ bằng Canvas với cơ cấu vật lý chân thực (chốt cản, kim chỉ uốn cong, tiếng tick-tick giảm tốc mượt mà).
   - Điểm số phong phú: **10, 20, 30, 40, 50, 60, 70, 80, 90, 100 điểm**.
   - Các ô đặc biệt: **MẤT LƯỢT**, **THÊM LƯỢT** (tích lũy vé cứu sinh), **NHÂN ĐÔI ĐIỂM** (x2), **MAY MẮN** (+50 điểm ngay).

4. **Sĩ Số Tối Đa 30 Học Sinh & 20 Bộ Đồng Phục Độc Đáo**:
   - Hỗ trợ nhập danh sách 30 học sinh, lưu dữ liệu cục bộ (`localStorage`).
   - Tùy chọn giới tính: **Nam 👦 / Nữ 👧**.
   - Tùy chọn **20 bộ đồng phục học đường sinh động**:
     1. Khăn Quàng Đỏ Đội Viên 🧣
     2. Sơ Mi Trắng Cà Vạt Xanh 👔
     3. Thể Dục Năng Động Xanh Lam ⚡
     4. Thể Dục Nhiệt Huyết Đỏ Cam 🔥
     5. Áo Polo Vàng Thông Thái 🌟
     6. Polo Mầm Xanh Hy Vọng 🌿
     7. Thủy Thủ Nhí Đại Dương ⚓
     8. Áo Dài Truyền Thống Nhí 🌸
     9. Vest Tiểu Học Hoàng Gia 👑
     10. Học Sinh Ca-rô Scotland 🏁
     11. Áo Khoác Nỉ Mùa Đông Đỏ ❄️
     12. Áo Khoác Bomber Xanh Navy 🧢
     13. Hướng Đạo Sinh / Thám Hiểm 🧭
     14. Bác Học Nhí / Áo Lab Trắng 🔬
     15. Cờ Đỏ Sao Vàng Yêu Nước ⭐
     16. Họa Sĩ Nhí Yếm Denim 🎨
     17. Phi Hành Gia Nhí Vũ Trụ 🚀
     18. Siêu Nhân Trí Tuệ Áo Choàng 🦸
     19. Hoàng Tử & Công Chúa Nhí 💎
     20. Cầu Thủ Bóng Rổ Số 1 🏀
   - Cho phép giáo viên chọn/bỏ chọn từng em để chỉ quay các em có mặt trong buổi học.

5. **Khán Đài & MC Ảo Phát Âm Tiếng Việt**:
   - **Trên khán đài**: MC ảo cử động khẩu hình khớp với giọng đọc tiếng Việt (Web Speech API), màn hình LED lớn hiển thị câu hỏi, phương án, đồng hồ đếm ngược và vòng quay nón kỳ diệu.
   - **Dưới khán đài**: 30 bàn học sinh hiển thị avatar, tên, điểm số và huy hiệu.

6. **9 Yêu Cầu Kỹ Thuật Đã Tích Hợp**:
   1. **Nhạc hiệu gameshow chuyên nghiệp**: Âm thanh tổng hợp bằng Web Audio API (nhạc mở màn, tiếng tích tắc, tiếng còi, chuông chiến thắng) – **chạy 100% offline không lo mất mạng**.
   2. **Hiệu ứng đèn sân khấu khi quay tên**: Đèn quét ánh vàng qua các dãy bàn trước khi khóa mục tiêu.
   3. **Đồng hồ đếm ngược 30 giây**: Vòng tròn SVG chuyển động kèm âm thanh tích tắc và nhịp đập gấp gáp trong 5 giây cuối.
   4. **Hiệu ứng hồi hộp trước khi công bố đáp án**: Trống dồn dập, âm thanh riser căng thẳng, đèn LED chớp nháy và banner *"ĐÁP ÁN LÀ..."*.
   5. **Hiệu ứng cộng tiền**: Hạt tiền vàng bay từ màn hình lớn vào bàn học sinh trúng thưởng kèm âm thanh leng keng vui tai.
   6. **Bảng vàng thành tích từng học sinh**: Bục vinh quang Top 3 (Quán quân, Á quân 1, Á quân 2) kèm bảng thống kê tỷ lệ đúng của toàn lớp.
   7. **Lưu lịch sử nhiều buổi thi**: Tự động lưu trữ danh sách các buổi thi qua các ngày vào máy tính để thầy cô tra cứu lại.
   8. **Xuất báo cáo Excel cho giáo viên**: Xuất file `.xlsx` định dạng đẹp (hoặc `.csv` chuẩn UTF-8) ghi nhận điểm, thứ hạng, số câu đúng/sai và danh hiệu khen thưởng.
   9. **Chế độ toàn màn hình trình chiếu 16:9**: Tối ưu hiển thị cho máy chiếu phòng học.

---

## 🚀 Hướng Dẫn Sử Dụng Dành Cho Giáo Viên

### Bước 1: Khởi Chạy
- Nhấp đúp vào file `index.html` để mở trò chơi trực tiếp trong trình duyệt Chrome, Edge, Cốc Cốc hoặc Firefox.
- Nhấn nút **"📺 Toàn Màn Hình"** trên thanh tiêu đề (hoặc phím **F11**) để hiển thị toàn màn hình trình chiếu 16:9.

### Bước 2: Chuẩn Bị Học Sinh & Câu Hỏi (Trước Giờ Học)
- **Điểm danh học sinh**: Nhấn nút **"👥 Học Sinh (30)"**, tick chọn những em có mặt, đổi tên hoặc đổi đồng phục nếu muốn.
- **Nạp câu hỏi**:
  - Nhấn nút **"❓ Câu Hỏi & File Mẫu"**.
  - Nhấn **"📥 Tải File Mẫu Excel"** để nhận file mẫu gồm các cột: *Chủ đề, Nội dung câu hỏi, Lựa chọn A, Lựa chọn B, Lựa chọn C, Lựa chọn D, Đáp án đúng (A/B/C/D), Giải thích*.
  - Thầy cô điền câu hỏi của môn học vào file Excel rồi nhấn **"📤 Nhập File Excel/CSV"** để nạp vào trò chơi.

### Bước 3: Tiến Hành Thi Đấu
1. **Phát nhạc mở màn**: Nhấn nút **"🎺 Nhạc Hiệu"** để thu hút sự chú ý của cả lớp.
2. **Bắt đầu câu hỏi**: Nhấn **"▶ Lượt Mới & Quay Tên"**:
   - Hệ thống quét đèn chọn ngẫu nhiên 1 học sinh.
   - Màn hình LED hiện câu hỏi và MC ảo đọc câu hỏi bằng tiếng Việt.
3. **Quay điểm thưởng**: Nhấn **"🎡 Quay Nón"** (hoặc bấm phím **Space**) để quay xác định mức điểm (10-100 điểm, Mất lượt, Thêm lượt, Nhân đôi, May mắn).
4. **Đếm ngược thời gian**: Nhấn **"⏱️ Bắt Đầu 30s"** (hoặc phím **T**) để học sinh suy nghĩ trả lời.
5. **Công bố đáp án**: Nhấn **"🥁 Hồi Hộp & Đáp Án"** (hoặc phím **R**) để tạo không khí hồi hộp trước khi đáp án đúng bừng sáng màu xanh lá.
6. **Chấm điểm & Tự Động Chuyển Lượt**:
   - **Nếu học sinh trả lời đúng**: Nhấn **"✓ Đúng (+Cộng Điểm)"** (hoặc phím `+` / `Y`):
     - Cộng điểm ngay vào bàn học sinh (tiền vàng bay lung linh).
     - MC ảo khen ngợi.
     - **Sau 2.8 giây, hệ thống tự động tải câu tiếp theo, tự động quét đèn chọn ngẫu nhiên thí sinh mới và tự động quay nón!**
   - **Nếu cần trừ điểm phạt**: Nhấn **"➖ Trừ Điểm (-Điểm)"** (hoặc phím `-` / `N`):
     - Điểm số của học sinh bị trừ (hiệu ứng tiền đỏ rơi xuống kèm âm thanh).
     - MC thông báo và **hệ thống tự động chuyển sang câu tiếp theo & quay chọn thí sinh mới**.
   - **Nếu học sinh trả lời chưa đúng (Cứu trợ)**: Nhấn **"✗ Sai (Cứu Trợ Lần 2)"**:
     - Lần 1: Chuyển sang lượt 2, đèn sân khấu tự động quét chọn bạn khác cứu trợ câu này.
     - Lần 2: Mở đáp án giải thích và tự động chuyển câu tiếp theo.

### Bước 4: Tổng Kết & Khen Thưởng
- Nhấn nút **"🏆 Bảng Vàng"**:
  - Xem bục vinh quang 3 vị trí dẫn đầu.
  - Nhấn **"📊 Xuất Báo Cáo Excel Cho Giáo Viên"** để lưu file tổng kết về máy tính báo cáo cho nhà trường và phụ huynh.

---

## ⌨️ Phím Tắt Tiện Lợi (Dành Cho Giáo Viên Thao Tác Nhanh)
- **Phím Space (Cách)**: Quay Chiếc Nón Kỳ Diệu.
- **Phím T**: Bắt đầu đồng hồ đếm ngược 30 giây.
- **Phím R**: Kích hoạt hiệu ứng hồi hộp & mở đáp án.
- **Phím + (hoặc Y)**: Trả lời Đúng -> Cộng điểm & Tự chuyển câu tiếp theo.
- **Phím - (hoặc N)**: Trả lời Sai -> Trừ điểm & Tự chuyển câu tiếp theo.
- **Phím 1, 2, 3, 4 (hoặc A, B, C, D)**: Chọn nhanh các phương án A, B, C, D.
- **Phím F11**: Bật / Tắt chế độ toàn màn hình 16:9.

---

## 📁 Cấu Trúc Thư Mục Ứng Dụng
```text
chiec-non-ky-dieu-tieu-hoc/
├── index.html           # File giao diện chính của Gameshow
├── README.md            # Sách hướng dẫn sử dụng chi tiết
├── css/
│   └── style.css        # Giao diện sân khấu 16:9, đèn rọi, bục vinh quang
└── js/
    ├── audio.js         # Bộ tổng hợp âm thanh Gameshow 100% Procedural
    ├── students.js      # Quản lý 30 học sinh, giới tính & 20 bộ đồng phục SVG
    ├── wheel.js         # Canvas Chiếc Nón Kỳ Diệu với vật lý va chạm chốt
    ├── mc.js            # MC ảo phát âm tiếng Việt (TTS) & khẩu hình cử động
    ├── questions.js     # Ngân hàng câu hỏi, đọc/ghi Excel & file mẫu
    ├── fireworks.js     # Hiệu ứng pháo hoa toàn màn hình & kim tuyến
    ├── history.js       # Quản lý lịch sử các buổi thi & xuất file Excel
    ├── modals.js        # Cửa sổ quản lý học sinh, câu hỏi & lịch sử
    └── game.js          # Bộ điều khiển trung tâm toàn bộ vòng chơi
```
