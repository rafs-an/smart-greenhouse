# Smart Greenhouse System 

**Real-time monitoring and control of greenhouse conditions using sensors, actuators, and an intuitive auto/manual interface.**

---

## Overview
This project combines the magic of hardware and software.  
- **Hardware:** Multiple sensors and actuators collect data and act according to the mode chosen by the user in our frontend to maintain optimal greenhouse conditions. If the mode chosen is 'auto' then all the actuators act according to the threshold level selected.
- However in manual mode, the user can control the pumping of water and fertilization remotely with the app.  
- **Software:** Data is displayed in real-time, allowing users to monitor conditions and control the system in both automatic and manual modes. It also displays the current weather condition of the area allowing the users to take the
- best decision even when they are far away.

![appInterface](/uiStyle1.png)


---

## Features
- **Real-time monitoring** of temperature, humidity, soil moisture, pH  
- **Automatic control** of irrigation, ventilation, and fertilizer pumps.  
- **Manual override** allows the user to control actuators anytime.  
- **User-friendly interface** with live updates and visual feedback.  

---

## Technologies Used
- **Hardware:** Arduino / ESP32, DHT22, soil moisture sensor, pH sensor, relays, fans, pumps, servos  
- **Software:** HTML, CSS, JavaScript, Firebase for real-time data syncing  

![appInterface1](/uiStyle2.png)
![appInterface](/uiStyle3.png)


## How to Use
1. Clone the repository:  
   ```bash
   git clone https://github.com/rafs-an/smart-greenhouse.git
2.Open the project in VS Code.

3.Open index.html in a browser to view the live dashboard.

4.Connect your hardware (sensors and actuators) and configure Firebase credentials in script.js.

5.Monitor the greenhouse and switch between auto and manual modes as needed.   


## Future Improvements:
- Add voice control integration for hands-free operation.
- Enhance the frontend dashboard with graphs and notifications.
- Integrate AI for predictive watering and fertilization.
   
