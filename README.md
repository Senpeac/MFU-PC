# MFU PC - IT E-commerce Platform

MFU PC คือโปรเจกต์ตัวอย่างเว็บไซต์ E-commerce สำหรับจำหน่ายสินค้าไอทีครบวงจร พัฒนาด้วยสแตก Node.js + Express + MongoDB สำหรับฝั่ง Back-end และ HTML/CSS/JavaScript สำหรับฝั่ง Front-end

## คุณสมบัติหลัก

- หน้า Landing Page ทันสมัยพร้อมแสดงหมวดหมู่และสินค้ายอดนิยม
- ระบบสมาชิก: สมัคร, ล็อกอิน, จัดการโปรไฟล์ พร้อม JWT Authentication
- หน้าแสดงสินค้าแบบไดนามิก รองรับการค้นหาและกรองตามหมวดหมู่/แบรนด์/ราคา
- ระบบตะกร้าสินค้าและขั้นตอนชำระเงิน (จำลอง) พร้อมบันทึกคำสั่งซื้อใน MongoDB
- แผงควบคุมแอดมินสำหรับจัดการสินค้าและปรับสถานะคำสั่งซื้อ
- โครงสร้างโค้ดแบบ MVC แยก controller, routes, models อย่างชัดเจน

## โครงสร้างโฟลเดอร์สำคัญ

```
MFU-PC/
├── config/           # การเชื่อมต่อฐานข้อมูล MongoDB
├── controllers/      # business logic สำหรับ auth, products, orders
├── middleware/       # middleware ตรวจสอบสิทธิ์
├── models/           # Mongoose Schema (users, products, orders)
├── routes/           # เส้นทาง REST API
├── public/           # ไฟล์ Front-end (HTML, CSS, JS)
├── utils/            # ฟังก์ชันช่วยเหลือทั่วไป
├── server.js         # จุดเริ่มต้นของแอปพลิเคชัน Express
└── README.md
```

## การเริ่มต้นใช้งาน

1. ติดตั้ง Dependencies

   ```bash
   npm install
   ```

2. สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ โดยสามารถอ้างอิงจาก `.env.example`

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mfu_pc
   JWT_SECRET=your_jwt_secret_here
   ```

3. รันเซิร์ฟเวอร์ในโหมดพัฒนา

   ```bash
   npm run dev
   ```

   หรือรันแบบ production

   ```bash
   npm start
   ```

4. เปิดเบราว์เซอร์และเข้าใช้งานที่ `http://localhost:5000`

> **หมายเหตุ**: โปรเจกต์นี้คาดหวังให้มี MongoDB ที่กำลังรันอยู่บนเครื่อง (หรือสามารถตั้งค่า `MONGO_URI` ให้ชี้ไปยัง MongoDB Atlas ได้)

## API หลัก

- `POST /api/auth/register` – สมัครสมาชิก
- `POST /api/auth/login` – ล็อกอิน
- `GET /api/auth/profile` – ดึงข้อมูลโปรไฟล์ (ต้องล็อกอิน)
- `PUT /api/auth/profile` – อัปเดตโปรไฟล์ (ต้องล็อกอิน)
- `GET /api/products` – รายการสินค้า + query filter
- `POST /api/products` – เพิ่มสินค้า (เฉพาะแอดมิน)
- `PUT /api/products/:id` – แก้ไขสินค้า (เฉพาะแอดมิน)
- `DELETE /api/products/:id` – ลบสินค้า (เฉพาะแอดมิน)
- `POST /api/orders` – สร้างคำสั่งซื้อ (ต้องล็อกอิน)
- `GET /api/orders/me` – รายการคำสั่งซื้อของผู้ใช้
- `GET /api/orders` – รายการคำสั่งซื้อทั้งหมด (เฉพาะแอดมิน)
- `PUT /api/orders/:id` – ปรับสถานะคำสั่งซื้อ (เฉพาะแอดมิน)

## การสร้างบัญชีแอดมิน

หลังจากสมัครสมาชิกผ่าน API หรือหน้าเว็บแล้ว สามารถเข้า MongoDB และแก้ไขฟิลด์ `role` ของผู้ใช้ให้เป็น `admin` เพื่อเข้าถึงแผงควบคุมแอดมินได้

## ใบอนุญาต

เผยแพร่ภายใต้สัญญาอนุญาต MIT สามารถนำไปใช้และดัดแปลงได้ตามต้องการ
