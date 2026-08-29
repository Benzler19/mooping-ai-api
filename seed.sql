-- ==========================================================
-- ข้อมูลตัวอย่างสำหรับทดสอบระบบร้านหมูปิ้ง
-- รันต่อจาก schema.sql (ต้องมี tb_category, tb_expense_category อยู่แล้ว)
-- ==========================================================
USE mooping_ai_db;

-- ผู้ใช้งานเริ่มต้น (username: admin / password: admin1234)
INSERT INTO tb_user (user_uuid, username, password, full_name, status, create_date) VALUES
('7da35d98-51ca-4cad-9d2d-113e1349e195', 'admin', '$2b$10$vqtEOj3B/qpgEcPq7vCAUez46nCZmRnsnXcAnQCUjoUtAult2.3xG', 'ผู้ดูแลร้าน', 1, NOW());

-- ผู้ขายวัตถุดิบตัวอย่าง
INSERT INTO tb_supplier (supplier_name, phone, address, status) VALUES
('ตลาดสดเช้าเมือง', '081-234-5678', 'ตลาดสดเทศบาล', 1),
('ร้านวัสดุบรรจุภัณฑ์ พีเจ', '089-999-1234', NULL, 1);

-- วัตถุดิบ (ตั้งสต็อกเริ่มต้น + ต้นทุนเฉลี่ยไว้เลย เพื่อให้ทดสอบขายได้ทันทีโดยไม่ต้องบันทึกบิลซื้อก่อน)
INSERT INTO tb_ingredient (ingredient_name, unit, current_stock, avg_cost, min_stock, status, create_date) VALUES
('เนื้อหมูคอ',        'กก.', 20,   150.00, 5,   1, NOW()),
('เนื้อหมูสามชั้น',    'กก.', 15,   140.00, 5,   1, NOW()),
('ตับหมู',            'กก.', 8,    120.00, 2,   1, NOW()),
('ไม้เสียบ',          'ไม้', 2000, 0.30,   200, 1, NOW()),
('ซอสหมักหมูปิ้ง',     'ขวด', 10,   65.00,  2,   1, NOW()),
('ข้าวเหนียว',        'กก.', 25,   35.00,  5,   1, NOW()),
('ถุงข้าวเหนียว',      'ใบ',  500,  0.50,   50,  1, NOW()),
('น้ำจิ้มแจ่ว',        'ขวด', 12,   45.00,  3,   1, NOW());

-- สินค้า/เมนูขาย (อ้างอิงหมวดหมู่ที่ schema.sql สร้างไว้แล้ว)
INSERT INTO tb_product (product_uuid, category_id, product_name, unit, sale_price, status, create_date) VALUES
(UUID(), (SELECT category_id FROM tb_category WHERE category_name = 'หมูปิ้ง' LIMIT 1),       'หมูปิ้งคอหมู',    'ไม้', 15.00, 1, NOW()),
(UUID(), (SELECT category_id FROM tb_category WHERE category_name = 'หมูปิ้ง' LIMIT 1),       'หมูปิ้งสามชั้น',   'ไม้', 15.00, 1, NOW()),
(UUID(), (SELECT category_id FROM tb_category WHERE category_name = 'หมูปิ้ง' LIMIT 1),       'ตับปิ้ง',         'ไม้', 15.00, 1, NOW()),
(UUID(), (SELECT category_id FROM tb_category WHERE category_name = 'ข้าวเหนียว' LIMIT 1),   'ข้าวเหนียว',      'ถุง', 10.00, 1, NOW());

-- สูตร (BOM) ต่อสินค้า 1 หน่วย
INSERT INTO tb_recipe (product_id, ingredient_id, quantity_used) VALUES
((SELECT product_id FROM tb_product WHERE product_name = 'หมูปิ้งคอหมู' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'เนื้อหมูคอ' LIMIT 1), 0.05),
((SELECT product_id FROM tb_product WHERE product_name = 'หมูปิ้งคอหมู' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'ไม้เสียบ' LIMIT 1), 1),
((SELECT product_id FROM tb_product WHERE product_name = 'หมูปิ้งคอหมู' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'ซอสหมักหมูปิ้ง' LIMIT 1), 0.02),

((SELECT product_id FROM tb_product WHERE product_name = 'หมูปิ้งสามชั้น' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'เนื้อหมูสามชั้น' LIMIT 1), 0.05),
((SELECT product_id FROM tb_product WHERE product_name = 'หมูปิ้งสามชั้น' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'ไม้เสียบ' LIMIT 1), 1),
((SELECT product_id FROM tb_product WHERE product_name = 'หมูปิ้งสามชั้น' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'ซอสหมักหมูปิ้ง' LIMIT 1), 0.02),

((SELECT product_id FROM tb_product WHERE product_name = 'ตับปิ้ง' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'ตับหมู' LIMIT 1), 0.05),
((SELECT product_id FROM tb_product WHERE product_name = 'ตับปิ้ง' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'ไม้เสียบ' LIMIT 1), 1),

((SELECT product_id FROM tb_product WHERE product_name = 'ข้าวเหนียว' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'ข้าวเหนียว' LIMIT 1), 0.15),
((SELECT product_id FROM tb_product WHERE product_name = 'ข้าวเหนียว' LIMIT 1),
 (SELECT ingredient_id FROM tb_ingredient WHERE ingredient_name = 'ถุงข้าวเหนียว' LIMIT 1), 1);

-- ค่าใช้จ่ายตัวอย่าง (ใช้หมวดหมู่ที่ schema.sql สร้างไว้แล้ว)
INSERT INTO tb_expense (expense_date, expense_category_id, amount, note, create_date) VALUES
(CURDATE(), (SELECT expense_category_id FROM tb_expense_category WHERE category_name = 'ค่าแก๊ส' LIMIT 1), 400.00, 'เติมแก๊สถังใหญ่', NOW()),
(CURDATE(), (SELECT expense_category_id FROM tb_expense_category WHERE category_name = 'ค่าเช่าที่' LIMIT 1), 100.00, 'ค่าเช่าแผงขายรายวัน', NOW());
