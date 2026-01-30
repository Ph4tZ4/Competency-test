# Competency Test Project

โปรเจกต์นี้เป็นระบบทดสอบสมรรถนะ (Competency Test) ซึ่งประกอบไปด้วยส่วนของ Backend API, Frontend Mobile App และ Database

## 📂 โครงสร้างโปรเจกต์

- **backend/**: พัฒนาด้วย Node.js (Express) เชื่อมต่อกับ MongoDB
- **frontend/**: พัฒนาด้วย React Native (Expo)
- **docker-compose.yml**: สำหรับจำลองสภาพแวดล้อม Server (Backend + Database)

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Mongoose
- **Frontend**: React Native, Expo, React Navigation, Axios
- **Database**: MongoDB
- **Testing**: Jest (Backend)

## 🚀 การติดตั้งและรันโปรเจกต์

### 1. รัน Backend และ Database (ด้วย Docker)

เราใช้ Docker Compose ในการจัดการ Backend และ Database เพื่อความสะดวก

```bash
# รัน Container (Backend จะรันที่ Port 3000, MongoDB ที่ Port 27017)
docker-compose up --build
```

### 2. รัน Frontend (Mobile App)

เปิด Terminal ใหม่ แล้วเข้าไปที่โฟลเดอร์ frontend

```bash
cd frontend

# ติดตั้ง Dependencies
npm install

# รันโปรเจกต์ด้วย Expo
npx expo start
```

หลังจากนั้นสามารถใช้แอป Expo Go บนมือถือสแกน QR Code หรือรันบน Simulator ได้เลย

## 🧪 การรัน Test (Backend)

หากต้องการรัน Unit Test ของ Backend

```bash
cd backend
npm test
```

## 📝 หมายเหตุ
- Backend API จะทำงานที่ `http://localhost:3000`
- MongoDB Connection URI: `mongodb://localhost:27017/Competency-test-db`
