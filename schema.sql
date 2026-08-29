-- ==========================================================
-- mooping_ai_db - schema ระบบร้านหมูปิ้ง (รับ-จ่าย/ขาย/สต็อก/รายงาน)
-- ==========================================================
CREATE DATABASE IF NOT EXISTS mooping_ai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mooping_ai_db;

-- ผู้ใช้งาน (แบบง่าย ไม่มี role/permission)
CREATE TABLE IF NOT EXISTS tb_user (
    user_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_uuid    CHAR(36)     NOT NULL,
    username     VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    full_name    VARCHAR(150) NOT NULL,
    status       TINYINT      NOT NULL DEFAULT 1,
    create_date  DATETIME     NULL,
    create_by    VARCHAR(100) NULL,
    update_date  DATETIME     NULL,
    update_by    VARCHAR(100) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- หมวดหมู่สินค้า (หมูปิ้ง / ลูกชิ้น / เครื่องดื่ม / ข้าวเหนียว)
CREATE TABLE IF NOT EXISTS tb_category (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    status        TINYINT      NOT NULL DEFAULT 1,
    create_date   DATETIME     NULL,
    create_by     VARCHAR(100)          NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- สินค้า/เมนูขาย
CREATE TABLE IF NOT EXISTS tb_product (
    product_id   INT AUTO_INCREMENT PRIMARY KEY,
    product_uuid CHAR(36)      NOT NULL,
    category_id  INT           NULL,
    product_name VARCHAR(150)  NOT NULL,
    unit         VARCHAR(30)   NOT NULL DEFAULT 'ไม้',
    sale_price   DECIMAL(10,2) NOT NULL DEFAULT 0,
    status       TINYINT       NOT NULL DEFAULT 1,
    create_date  DATETIME      NULL,
    create_by    VARCHAR(100)           NULL,
    update_date  DATETIME      NULL,
    update_by    VARCHAR(100)           NULL,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES tb_category(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- วัตถุดิบ + สต็อกคงเหลือ + ต้นทุนเฉลี่ย (moving average)
CREATE TABLE IF NOT EXISTS tb_ingredient (
    ingredient_id   INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(150)   NOT NULL,
    unit            VARCHAR(30)    NOT NULL DEFAULT 'กก.',
    current_stock   DECIMAL(12,3)  NOT NULL DEFAULT 0,
    avg_cost        DECIMAL(12,4)  NOT NULL DEFAULT 0,
    min_stock       DECIMAL(12,3)  NOT NULL DEFAULT 0,
    status          TINYINT        NOT NULL DEFAULT 1,
    create_date     DATETIME       NULL,
    create_by       VARCHAR(100)            NULL,
    update_date     DATETIME       NULL,
    update_by       VARCHAR(100)            NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- สูตร (BOM): ขายสินค้า 1 หน่วย ใช้วัตถุดิบอะไรเท่าไหร่
CREATE TABLE IF NOT EXISTS tb_recipe (
    recipe_id      INT AUTO_INCREMENT PRIMARY KEY,
    product_id     INT           NOT NULL,
    ingredient_id  INT           NOT NULL,
    quantity_used  DECIMAL(12,4) NOT NULL,
    UNIQUE KEY uq_recipe (product_id, ingredient_id),
    CONSTRAINT fk_recipe_product    FOREIGN KEY (product_id)    REFERENCES tb_product(product_id)    ON DELETE CASCADE,
    CONSTRAINT fk_recipe_ingredient FOREIGN KEY (ingredient_id) REFERENCES tb_ingredient(ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ผู้ขายวัตถุดิบ
CREATE TABLE IF NOT EXISTS tb_supplier (
    supplier_id   INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    phone         VARCHAR(30)  NULL,
    address       VARCHAR(255) NULL,
    status        TINYINT      NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- บิลซื้อวัตถุดิบเข้า
CREATE TABLE IF NOT EXISTS tb_purchase (
    purchase_id   INT AUTO_INCREMENT PRIMARY KEY,
    purchase_uuid CHAR(36)      NOT NULL,
    purchase_date DATE          NOT NULL,
    supplier_id   INT           NULL,
    total_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
    note          VARCHAR(255)  NULL,
    create_date   DATETIME      NULL,
    create_by     VARCHAR(100)           NULL,
    CONSTRAINT fk_purchase_supplier FOREIGN KEY (supplier_id) REFERENCES tb_supplier(supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tb_purchase_detail (
    detail_id     INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id   INT           NOT NULL,
    ingredient_id INT           NOT NULL,
    quantity      DECIMAL(12,3) NOT NULL,
    unit_cost     DECIMAL(12,4) NOT NULL,
    subtotal      DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_pdetail_purchase   FOREIGN KEY (purchase_id)   REFERENCES tb_purchase(purchase_id) ON DELETE CASCADE,
    CONSTRAINT fk_pdetail_ingredient FOREIGN KEY (ingredient_id) REFERENCES tb_ingredient(ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ประวัติการเคลื่อนไหวสต็อกทั้งหมด (audit trail)
CREATE TABLE IF NOT EXISTS tb_stock_movement (
    movement_id    INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_id  INT                          NOT NULL,
    movement_type  ENUM('IN','OUT','ADJUST')    NOT NULL,
    quantity       DECIMAL(12,3)                NOT NULL,
    ref_type       VARCHAR(30)                  NULL,
    ref_id         INT                          NULL,
    balance_after  DECIMAL(12,3)                NOT NULL,
    note           VARCHAR(255)                 NULL,
    create_date    DATETIME                     NULL,
    create_by      VARCHAR(100)                          NULL,
    CONSTRAINT fk_movement_ingredient FOREIGN KEY (ingredient_id) REFERENCES tb_ingredient(ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- บิลขาย (POS ทีละบิล)
CREATE TABLE IF NOT EXISTS tb_sale_order (
    order_id        INT AUTO_INCREMENT PRIMARY KEY,
    order_uuid      CHAR(36)      NOT NULL,
    order_no        VARCHAR(20)   NOT NULL,
    order_date      DATE          NOT NULL,
    order_datetime  DATETIME      NOT NULL,
    total_amount    DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount        DECIMAL(12,2) NOT NULL DEFAULT 0,
    net_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_method  ENUM('cash','transfer','other') NOT NULL DEFAULT 'cash',
    status          ENUM('paid','cancelled') NOT NULL DEFAULT 'paid',
    note            VARCHAR(255)  NULL,
    create_date     DATETIME      NULL,
    create_by       VARCHAR(100)           NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tb_sale_order_detail (
    detail_id      INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT           NOT NULL,
    product_id     INT           NOT NULL,
    quantity       DECIMAL(10,2) NOT NULL,
    unit_price     DECIMAL(10,2) NOT NULL,
    unit_cost      DECIMAL(10,4) NOT NULL DEFAULT 0,
    subtotal       DECIMAL(12,2) NOT NULL,
    cost_subtotal  DECIMAL(12,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_sodetail_order   FOREIGN KEY (order_id)   REFERENCES tb_sale_order(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_sodetail_product FOREIGN KEY (product_id) REFERENCES tb_product(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- หมวดหมู่ค่าใช้จ่ายดำเนินงาน (ไม่ใช่ต้นทุนวัตถุดิบ)
CREATE TABLE IF NOT EXISTS tb_expense_category (
    expense_category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name        VARCHAR(100) NOT NULL,
    status                TINYINT      NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tb_expense (
    expense_id           INT AUTO_INCREMENT PRIMARY KEY,
    expense_date         DATE          NOT NULL,
    expense_category_id  INT           NOT NULL,
    amount               DECIMAL(12,2) NOT NULL,
    note                 VARCHAR(255)  NULL,
    create_date          DATETIME      NULL,
    create_by            VARCHAR(100)           NULL,
    CONSTRAINT fk_expense_category FOREIGN KEY (expense_category_id) REFERENCES tb_expense_category(expense_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ข้อมูลตั้งต้น
INSERT INTO tb_expense_category (category_name) VALUES
    ('ค่าเช่าที่'), ('ค่าแก๊ส'), ('ค่าไฟ'), ('ค่าแรงงาน'), ('ค่าเดินทาง/ขนส่ง'), ('อื่นๆ');

INSERT INTO tb_category (category_name, create_date) VALUES
    ('หมูปิ้ง', NOW()), ('ลูกชิ้น/ไส้กรอก', NOW()), ('ข้าวเหนียว', NOW()), ('เครื่องดื่ม', NOW());
