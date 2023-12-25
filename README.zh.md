# ✨HomePulse✨  
- ### `HomePulse`是一個物聯網監控網站，透過我們`自製的感測器`或`開關`，可以達成`不限距離`，遠端操控，提升家中生活品質及安全性  
<img width="1144" alt="截圖 2023-12-23 下午1 14 51" src="https://github.com/LandoHsieh/HomePulse/assets/138661291/a9c2414a-deaf-4c98-a518-e136ab4dfb89">  

## 功能特點
- ### 監控頁面-用於監控感測器傳來的數值
  溫濕度感測器  
  ![溫濕度感測器](https://github.com/LandoHsieh/HomePulse/assets/138661291/04ae2b4c-0211-4b69-ad31-18d451425766)  
  雷射感應器（入侵警報)  
  ![雷射入侵警報](https://github.com/LandoHsieh/HomePulse/assets/138661291/f8f03167-218a-41f0-ac96-8c878fe5ac33)  
- ### 控制頁面-用於控制家中物聯網開關，例如：控制開關燈、控制電磁門鎖、冷氣等  
  ![遠端燈控](https://github.com/LandoHsieh/HomePulse/assets/138661291/8ebbe68c-d28e-46e6-944a-facb393b3349)  
- ### 群組頁面-透過使用者邀請碼可以邀請其他用戶加入您的群組，一起監控家中的安全性
  <img width="816" alt="截圖 2023-12-23 下午1 02 45" src="https://github.com/LandoHsieh/HomePulse/assets/138661291/c96cc42a-3a25-4cbc-99e5-3bf0b875c2ec">
- ### 使用日誌頁面-日誌頁面會顯示紀錄群組中的使用者在什麼時間操作了什麼裝置
  <img width="1081" alt="截圖 2023-12-23 下午1 02 59" src="https://github.com/LandoHsieh/HomePulse/assets/138661291/e4cc94a7-3c17-4c1f-95b9-33a52e7ee7c7">

## 測試帳號
|帳號|密碼|
|----|----|
|landoycx113@gmail.com|123|
|test@test456.com|Ab0@|

## 核心技術
- Arduino自製感測器裝置
- MQTT通訊協定，達成物聯網操控
- WebSocket，即時顯示感測器數值

## 前端
### 框架 
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### UI工具
- [Material UI](https://mui.com/)
- [SweetAlert2](https://sweetalert2.github.io/)

### 狀態管理
- [react-redux](https://react-redux.js.org/)

### API請求
- [axios](https://axios-http.com/)
- [react-query](https://tanstack.com/query/v3/)

## 後端
### 框架
- [Express.js](https://expressjs.com/zh-tw/)
  
### 資料庫
- [mysql2](https://www.npmjs.com/package/mysql2)

### 通訊協定
- [MQTT](https://www.npmjs.com/package/mqtt)
- [WebSocket](https://www.npmjs.com/package/socket.io)

### Auth
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [passport](https://www.passportjs.org/docs/)
- [OAuth2.0](https://developers.google.com/identity/protocols/oauth2?hl=zh-tw)

### 雲端服務 ＆ 部署
- AWS EC2
- AWS RDS
- Docker

## 系統架構
![HomePulse架構圖 drawio](https://github.com/LandoHsieh/HomePulse/assets/138661291/8308a419-0883-473b-a212-b0a8041f6a1c)

