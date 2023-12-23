# ✨HomePulse✨  
- ### `HomePulse` is an IoT monitoring website that allows remote control and enhances the quality and safety of home life through our `custom-made sensors` and `switches`, achieving `unlimited distance` control.
<img width="1144" alt="截圖 2023-12-23 下午1 14 51" src="https://github.com/LandoHsieh/HomePulse/assets/138661291/a9c2414a-deaf-4c98-a518-e136ab4dfb89">  

## Features
- ### Monitoring Page - For tracking sensor data
  Temperature and Humidity Sensors  
  ![溫濕度感測器](https://github.com/LandoHsieh/HomePulse/assets/138661291/04ae2b4c-0211-4b69-ad31-18d451425766)  
  Laser Sensors (Intrusion Alarms)  
  ![雷射入侵警報](https://github.com/LandoHsieh/HomePulse/assets/138661291/f8f03167-218a-41f0-ac96-8c878fe5ac33)  
- ### Control Page - Used for controlling IoT switches at home, such as: controlling light switches, electromagnetic door locks, air conditioners, etc.  
  ![遠端燈控](https://github.com/LandoHsieh/HomePulse/assets/138661291/8ebbe68c-d28e-46e6-944a-facb393b3349)  
- ### Group Page - Users can invite others to join their group using an invitation code, collectively monitoring home security.  
  <img width="816" alt="截圖 2023-12-23 下午1 02 45" src="https://github.com/LandoHsieh/HomePulse/assets/138661291/c96cc42a-3a25-4cbc-99e5-3bf0b875c2ec">  
- ### Usage Log Page - The log page displays records of which devices were operated by group members and at what time.  
  <img width="1081" alt="截圖 2023-12-23 下午1 02 59" src="https://github.com/LandoHsieh/HomePulse/assets/138661291/e4cc94a7-3c17-4c1f-95b9-33a52e7ee7c7">  

## Core Technologies
- Custom-made Arduino sensor devices
- MQTT communication protocol for IoT control
- WebSocket for real-time sensor data display

## Frontend
### Framwork 
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### UI Tools
- [Material UI](https://mui.com/)
- [SweetAlert2](https://sweetalert2.github.io/)

### State Management
- [react-redux](https://react-redux.js.org/)

### API Call
- [axios](https://axios-http.com/)
- [react-query](https://tanstack.com/query/v3/)

## Backend
### Framwork
- [Express.js](https://expressjs.com/zh-tw/)
  
### Database
- [mysql2](https://www.npmjs.com/package/mysql2)

### Communication protocol
- [MQTT](https://www.npmjs.com/package/mqtt)
- [WebSocket](https://www.npmjs.com/package/socket.io)

### Auth
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [passport](https://www.passportjs.org/docs/)
- [OAuth2.0](https://developers.google.com/identity/protocols/oauth2?hl=zh-tw)

### Cloud Service & Deployment
- AWS EC2
- AWS RDS
- Docker

## System Architecture
![HomePulse架構圖 drawio](https://github.com/LandoHsieh/HomePulse/assets/138661291/8308a419-0883-473b-a212-b0a8041f6a1c)

