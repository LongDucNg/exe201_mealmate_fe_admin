# Context
Filename: task-file-name.md
Created: 2025-11-19 15:35
Author: GPT-5.1 Codex
Protocol: RIPER-5 + Multi-Dim + Agent + AI-Dev Guide

# Task Description
Xây dựng UI web admin MealMate gồm màn hình đăng nhập, quản lý người dùng, quản lý món ăn/doanh thu và tần suất sử dụng theo mockup đã cung cấp, sử dụng React/Vite và có thể tích hợp thư viện hỗ trợ.

# Project Overview
Frontend SPA dựa trên React + Vite, sử dụng TailwindCSS để tái tạo giao diện và Recharts để hiển thị biểu đồ, routing bằng React Router DOM, dữ liệu mock nội bộ.

---
# Analysis (Research)
- Thư mục trống, chỉ có `package-lock.json`, chưa có cấu trúc mã nguồn.
- Yêu cầu UI gồm 4 màn hình chính với bảng, biểu đồ, form đăng nhập.

# Proposed Solutions (Innovation)
## Plan A:
- Principle: React + Vite + Tailwind + Recharts tái tạo nhanh UI, chia component tái sử dụng.
- Steps: Khởi tạo dự án, cấu hình Tailwind, dựng layout chung Sidebar/Header, tạo pages và mock data, dùng Recharts cho biểu đồ.
- Risks: Cần đồng bộ màu sắc với thiết kế; phải đảm bảo cấu hình Tailwind sinh đủ lớp.

## Plan B:
- Principle: React + SCSS module + ApexCharts để điều khiển chi tiết style.
- Steps: Tạo dự án, cấu trúc SCSS riêng cho từng trang, tích hợp ApexCharts, dựng component tùy chỉnh.
- Risks: SCSS thủ công tốn thời gian, ApexCharts bundle lớn và cấu hình phức tạp.

## Recommended Plan
- Chọn Plan A vì Tailwind + Recharts nhẹ, dễ tái sử dụng và phù hợp tiến độ.

# Implementation Plan (Planning)
Implementation Checklist:
1. Khởi tạo dự án Vite React (JS) và cài deps cần thiết.
2. Thiết lập Tailwind, PostCSS, cấu hình theme.
3. Tạo `task-file-name.md` ghi nhận quy trình.
4. Thiết lập cấu trúc thư mục `src` (styles, components, pages, data, assets).
5. Cập nhật `index.html`, `main.jsx`, `App.jsx`, router.
6. Xây dựng layout chung (Sidebar, Header, PageWrapper).
7. Tạo components chia sẻ (CardStat, DataTable, ChartCard).
8. Chuẩn bị mock data (users, meals, frequency).
9. Dựng trang `Login`.
10. Dựng trang `AdminUsers`.
11. Dựng trang `ManagerMeals` kèm biểu đồ.
12. Dựng trang `AdminFrequency` kèm biểu đồ.
13. Kiểm tra `npm run dev`, tinh chỉnh UI theo thiết kế.
14. Chạy `npm run build` xác nhận.
15. Tổng kết, cập nhật task file và báo cáo.

# Current Step
Executing: "Step 13 - Kiểm tra dev server & tinh chỉnh UI"

# Task Progress
* 2025-11-19 15:25
  * Step: Khởi tạo và cấu hình nền tảng
  * Changes: Tạo dự án Vite React JS, cài Tailwind, React Router, Recharts, cấu hình plugin React, Tailwind theme.
  * Summary: Hoàn tất môi trường dev theo yêu cầu.
  * Reason: Cần nền tảng ổn định trước khi xây UI.
  * Blockers: Lỗi esbuild/tailwind CLI ban đầu, đã khắc phục bằng cài bản phù hợp.
  * Status: completed
* 2025-11-19 15:40
  * Step: Dựng layout, components và pages
  * Changes: Tạo Sidebar, Header, PageWrapper, CardStat, DataTable, ChartCard; thêm dữ liệu mock; xây 4 trang chính; cập nhật router và styles.
  * Summary: UI theo mockup đã hình thành đầy đủ.
  * Reason: Đáp ứng yêu cầu chức năng & giao diện của khách hàng.
  * Blockers: Chưa chạy `npm run dev` để kiểm chứng do đang tiếp tục chỉnh sửa.
  * Status: in_progress

# Final Review
Pending kiểm tra sau khi hoàn tất thực thi & test.

