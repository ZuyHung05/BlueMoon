-- ============================================
-- SQL INSERT DATA MẪU CHO DASHBOARD
-- ============================================
-- Tạo dữ liệu thanh toán cho 12 tháng gần nhất
-- Với nhiều loại phí khác nhau để biểu đồ hiển thị đẹp
-- ============================================

-- Giả sử bạn đã có household_id từ 1-20 trong database
-- Nếu chưa có, hãy kiểm tra: SELECT household_id FROM household LIMIT 20;

-- ============================================
-- 1. TẠO CÁC KỲ THANH TOÁN (Payment Periods)
-- ============================================

-- Tháng 2/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (1, '2025-02-01', '2025-02-28', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (1, '2025-02-01', '2025-02-28', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (1, '2025-02-01', '2025-02-28', false, 'Phí dịch vụ');

-- Tháng 3/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (2, '2025-03-01', '2025-03-31', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (2, '2025-03-01', '2025-03-31', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (2, '2025-03-01', '2025-03-31', false, 'Phí bảo trì');

-- Tháng 4/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (3, '2025-04-01', '2025-04-30', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (3, '2025-04-01', '2025-04-30', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (3, '2025-04-01', '2025-04-30', false, 'Phí điện nước');

-- Tháng 5/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (4, '2025-05-01', '2025-05-31', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (4, '2025-05-01', '2025-05-31', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (4, '2025-05-01', '2025-05-31', false, 'Phí dịch vụ');

-- Tháng 6/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (5, '2025-06-01', '2025-06-30', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (5, '2025-06-01', '2025-06-30', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (5, '2025-06-01', '2025-06-30', false, 'Phí bảo trì');

-- Tháng 7/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (6, '2025-07-01', '2025-07-31', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (6, '2025-07-01', '2025-07-31', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (6, '2025-07-01', '2025-07-31', false, 'Phí dịch vụ');

-- Tháng 8/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (7, '2025-08-01', '2025-08-31', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (7, '2025-08-01', '2025-08-31', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (7, '2025-08-01', '2025-08-31', false, 'Phí điện nước');

-- Tháng 9/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (8, '2025-09-01', '2025-09-30', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (8, '2025-09-01', '2025-09-30', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (8, '2025-09-01', '2025-09-30', false, 'Phí bảo trì');

-- Tháng 10/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (9, '2025-10-01', '2025-10-31', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (9, '2025-10-01', '2025-10-31', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (9, '2025-10-01', '2025-10-31', false, 'Phí dịch vụ');

-- Tháng 11/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (10, '2025-11-01', '2025-11-30', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (10, '2025-11-01', '2025-11-30', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (10, '2025-11-01', '2025-11-30', false, 'Phí điện nước');

-- Tháng 12/2025
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (11, '2025-12-01', '2025-12-31', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (11, '2025-12-01', '2025-12-31', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (11, '2025-12-01', '2025-12-31', false, 'Phí bảo trì');

-- Tháng 1/2026
INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (12, '2026-01-01', '2026-01-31', true, 'Phí quản lý');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (12, '2026-01-01', '2026-01-31', true, 'Phí gửi xe');

INSERT INTO payment_period (count, start_date, end_date, is_mandatory, description) 
VALUES (12, '2026-01-01', '2026-01-31', false, 'Phí dịch vụ');


-- ============================================
-- 2. TẠO DỮ LIỆU THANH TOÁN (Pay Records)
-- ============================================
-- Giả sử có 20 hộ gia đình, mỗi tháng có khoảng 15-18 hộ thanh toán
-- Số tiền dao động từ 3-8 triệu đồng/hộ/tháng

-- Hàm helper: Lấy payment_period_id theo description và tháng
-- Bạn cần thay thế :period_id bằng ID thực tế từ bảng payment_period

-- ============================================
-- CÁCH SỬ DỤNG:
-- 1. Chạy các INSERT payment_period ở trên trước
-- 2. Lấy danh sách payment_period_id:
--    SELECT payment_period_id, description, start_date FROM payment_period ORDER BY start_date;
-- 3. Thay thế :period_id_xxx trong các INSERT pay bên dưới
-- ============================================

-- Ví dụ: Tháng 2/2025 - Phí quản lý (giả sử payment_period_id = 1)
-- Thay :period_id_feb_ql bằng ID thực tế
INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí quản lý' AND start_date = '2025-02-01'),
    3500000 + (RANDOM() * 2000000)::numeric,
    CASE WHEN RANDOM() < 0.7 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2025-02-01'::date + (RANDOM() * 20)::int * INTERVAL '1 day'
FROM household h
WHERE h.household_id <= 15  -- 15/20 hộ thanh toán
ORDER BY RANDOM();

-- Tháng 2/2025 - Phí gửi xe
INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí gửi xe' AND start_date = '2025-02-01'),
    800000 + (RANDOM() * 400000)::numeric,
    CASE WHEN RANDOM() < 0.7 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2025-02-01'::date + (RANDOM() * 20)::int * INTERVAL '1 day'
FROM household h
WHERE h.household_id <= 16
ORDER BY RANDOM();

-- Tháng 2/2025 - Phí dịch vụ
INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí dịch vụ' AND start_date = '2025-02-01'),
    1200000 + (RANDOM() * 600000)::numeric,
    CASE WHEN RANDOM() < 0.7 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2025-02-01'::date + (RANDOM() * 20)::int * INTERVAL '1 day'
FROM household h
WHERE h.household_id <= 14
ORDER BY RANDOM();

-- ============================================
-- Lặp lại pattern tương tự cho các tháng còn lại
-- ============================================

-- Tháng 3/2025
INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí quản lý' AND start_date = '2025-03-01'),
    3500000 + (RANDOM() * 2000000)::numeric,
    CASE WHEN RANDOM() < 0.7 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2025-03-01'::date + (RANDOM() * 25)::int * INTERVAL '1 day'
FROM household h WHERE h.household_id <= 16;

INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí gửi xe' AND start_date = '2025-03-01'),
    800000 + (RANDOM() * 400000)::numeric,
    CASE WHEN RANDOM() < 0.7 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2025-03-01'::date + (RANDOM() * 25)::int * INTERVAL '1 day'
FROM household h WHERE h.household_id <= 17;

INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí bảo trì' AND start_date = '2025-03-01'),
    900000 + (RANDOM() * 500000)::numeric,
    CASE WHEN RANDOM() < 0.7 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2025-03-01'::date + (RANDOM() * 25)::int * INTERVAL '1 day'
FROM household h WHERE h.household_id <= 15;

-- Tháng 4-12/2025 và 1/2026: Tương tự, thay đổi start_date và số lượng hộ thanh toán
-- Để tạo xu hướng tăng dần, tăng số hộ thanh toán và amount theo thời gian

-- Tháng 12/2025 (cao điểm cuối năm)
INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí quản lý' AND start_date = '2025-12-01'),
    4000000 + (RANDOM() * 2500000)::numeric,
    CASE WHEN RANDOM() < 0.8 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2025-12-01'::date + (RANDOM() * 28)::int * INTERVAL '1 day'
FROM household h WHERE h.household_id <= 19;

INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí gửi xe' AND start_date = '2025-12-01'),
    1000000 + (RANDOM() * 500000)::numeric,
    CASE WHEN RANDOM() < 0.8 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2025-12-01'::date + (RANDOM() * 28)::int * INTERVAL '1 day'
FROM household h WHERE h.household_id <= 19;

-- Tháng 1/2026 (hiện tại)
INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí quản lý' AND start_date = '2026-01-01'),
    4200000 + (RANDOM() * 2800000)::numeric,
    CASE WHEN RANDOM() < 0.8 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2026-01-01'::date + (RANDOM() * 4)::int * INTERVAL '1 day'
FROM household h WHERE h.household_id <= 18;

INSERT INTO pay (household_id, payment_period_id, amount, method, pay_date)
SELECT 
    h.household_id,
    (SELECT payment_period_id FROM payment_period WHERE description = 'Phí gửi xe' AND start_date = '2026-01-01'),
    1000000 + (RANDOM() * 500000)::numeric,
    CASE WHEN RANDOM() < 0.8 THEN 'Chuyển khoản' ELSE 'Tiền mặt' END,
    '2026-01-01'::date + (RANDOM() * 4)::int * INTERVAL '1 day'
FROM household h WHERE h.household_id <= 17;


-- ============================================
-- 3. KIỂM TRA KẾT QUẢ
-- ============================================

-- Xem tổng thu theo tháng
SELECT 
    TO_CHAR(p.pay_date, 'YYYY-MM') as month,
    COUNT(*) as payment_count,
    SUM(p.amount) as total_revenue
FROM pay p
WHERE p.pay_date IS NOT NULL
GROUP BY TO_CHAR(p.pay_date, 'YYYY-MM')
ORDER BY month;

-- Xem tổng thu theo loại phí
SELECT 
    pp.description,
    COUNT(*) as payment_count,
    SUM(p.amount) as total_amount
FROM pay p
JOIN payment_period pp ON p.payment_period_id = pp.payment_period_id
WHERE p.pay_date IS NOT NULL
GROUP BY pp.description
ORDER BY total_amount DESC;
