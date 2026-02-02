# ใบสั่งงาน สมรรถนะที่ 1 และ สมรรถนะที่ 4

ข้อสอบเทียบเคียง สมรรถนะที่ 1 และ สมรรถนะที่ 4

---

### 1. วัตถุประสงค์ (Objectives)

1. เพื่อให้ผู้เรียนสามารถออกแบบและสร้างฐานข้อมูล (SQL หรือ NoSQL) ได้อย่างถูกต้อง
2. เพื่อให้ผู้เรียนสามารถพัฒนา RESTful API (Backend) และเชื่อมต่อกับ Docker ได้
3. เพื่อให้ผู้เรียนสามารถพัฒนา Mobile Application ด้วย Expo เพื่อใช้งานระบบยืม-คืนหนังสือได้
4. เพื่อให้ผู้เรียนสามารถทดสอบระบบ (Unit Test) และแก้ไขข้อผิดพลาดได้

### 2. ทรัพยากรและเครื่องมือ (Tools & Requirements)

1. **Backend:** เลือกภาษาและ Framework ตามความถนัด (เช่น Node.js, Go, Python)
2. **Frontend:** Expo (React Native) เท่านั้น
3. **Database:** SQL (เช่น MySQL, PostgreSQL) หรือ NoSQL (เช่น MongoDB)
4. **Environment:** Docker และ Docker Compose
5. **Tools:** Postman/Insomnia, Git, Editor (VS Code)

---

### 3. คำสั่งและขอบเขตงาน (Instructions)

ให้นักศึกษาพัฒนาระบบยืม-คืนหนังสือ โดยมีรายละเอียดงานดังนี้:

### ส่วนที่ 1: การออกแบบระบบและฐานข้อมูล (System Design)

1. **ER-Diagram:** ออกแบบแผนภาพความสัมพันธ์ข้อมูล (ER-Diagram) โดยเลือกใช้สัญลักษณ์แบบ Chen หรือ Crow’s Foot Notation ให้ถูกต้อง
2. **Database Schema:** ออกแบบโครงสร้างตาราง (Table Design) โดยต้องมีตารางข้อมูลอย่างน้อย 3 ตารางหลัก ดังนี้:
    - ตารางผู้ใช้งาน (Users/Members)
    - ตารางหนังสือ (Books)
    - ตารางการยืม-คืน (Transactions/Borrow-Return Logs)
    - *ต้องกำหนด Primary Key (PK) และ Foreign Key (FK) ให้ชัดเจน*

### ส่วนที่ 2: การพัฒนา Backend และ API (Server Side)

1. สร้าง Project Backend และทำงานภายใต้สภาพแวดล้อม **Docker** (เขียน Dockerfile และ docker-compose.yml)
2. พัฒนา API ให้รองรับฟังก์ชันดังต่อไปนี้:
    - Authentication (Register / Login) สำหรับ User และ Admin
    - CRUD Books (เพิ่ม, ลบ, แก้ไข, ดูรายการหนังสือ)
    - Borrow / Return (บันทึกการยืมและคืนหนังสือ)
    - History (ดูประวัติการยืมคืน)
3. **Unit Test:** เขียน Unit Test สำหรับฟังก์ชันหลัก และแสดงผลลัพธ์การทดสอบ (Test Result)
4. **API Documentation:** จัดทำเอกสารอธิบาย API ทั้งหมด (Endpoint, Method, Request Body, Response)

### ส่วนที่ 3: การพัฒนา Frontend (Mobile App with Expo) (ตัวอย่าง)

พัฒนาแอปพลิเคชันด้วย **Expo** โดยมีหน้าจอและการทำงานดังนี้:

1. **Authentication:**
    - หน้าจอสมัครสมาชิก (Register)
    - หน้าจอเข้าสู่ระบบ (Login) แยกสิทธิ์ระหว่าง สมาชิก และ ผู้ดูแลระบบ
2. **User Functions (สมาชิก):**
    - **Home Page:** แสดงรายการหนังสือทั้งหมด และแสดงสถานะ (ว่าง/ถูกยืม)
    - **Borrow:** หน้าจอยืมหนังสือ (เปลี่ยนสถานะหนังสือเป็น "ถูกยืม")
    - **Return:** หน้าจอคืนหนังสือ (เปลี่ยนสถานะหนังสือเป็น "ว่าง")
    - **History:** แสดงประวัติการยืม-คืนของตนเอง
3. **Admin Functions (ผู้ดูแลระบบ):**
    - **Manage Books:** หน้าจอเพิ่มรายการหนังสือใหม่
    - **Dashboard:** หน้าจอแสดงรายการหนังสือที่ถูกยืมอยู่ในปัจจุบันและสมาชิกคนใดเป็นผู้ยืม
    - **Show Users:** หน้าจอแสดงข้อมูลสมาชิกทั้งหมด

### ส่วนที่ 4: การส่งมอบงาน (Deliverables) **รวบรวมส่งใน google classroom**

1. **Source Code:** อัปโหลดขึ้น Git Repository หรือส่งเป็นไฟล์ Zip
2. **เอกสารประกอบ:** 
    - รูปภาพ ER-Diagram
    - รายละเอียดตารางฐานข้อมูล (Data Dictionary)
    - เอกสารอธิบาย API (API Specs)
    - ผลลัพธ์การรัน Unit Test (Screenshot หรือ Log)
    - บันทึกข้อผิดพลาดที่พบและการแก้ไข (Bug Report)
3. **การสาธิต:** ระบบต้องรันผ่านคำสั่ง `docker-compose up` ได้ทัน