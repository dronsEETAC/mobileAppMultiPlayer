# Ionic-Vue Mobile App
![IonicAppDemo](https://user-images.githubusercontent.com/100842082/213981154-11cb3b23-81cc-4eac-ad5d-25c1dac7714a.png)


The IonicVueMobileAppDEE is a front-end module developed in Ionic Vue. It allows the user to do a bunch of things, including:
- Showing the picture/video stream sent by the camera service
- Free guiding the drone
- Showing telemetry data
- Starting/Stopping a LED sequence in the drone

## Demo
This video es a short demo of some of the functionalities of the Mobile APP.   
[Ionic App in action](https://www.youtube.com/watch?v=iDihSNpX-gs)   

In the video:
1. A mosquitto broker is started in port 1884. This will serve as internal broker.   
2. The ionic vue app is started. 
3. Both the camera service and the autopilot service are started in global and simulation modes, and will user the public broker broker.hivemq.com as external broker. Note that the camera service may take some time to start (be patient).    
4. Since the demo is in simulation mode, the Mission Planner simulator is started.   
5. The app can be accessed in localhost:81000 but also in 192.168.1.45:8100 for any device connected to the same network.     
6. We connect with the app from a mobile phone connected to the same wifi network than localhost.    
7. We connect with the external broker. This operation also makes the autopilot service connect to the autopilot.    
8. Note that in the current version the mobile app runs in global mode and uses the broker.hivemq.com as external broker. A simple future task would be to implement a mechanism to allow the user to select other configurations.    
9. The app arms, takes offa and moves the drone in different directions before returning home. Some telemetry data are shown.    
10. The app takes a pictures and gets the video stream, introducing different alterations in the image (gray, canny, etc.).     

## Installation and contribution
In order to run and contribute to the modules implemented in Vue, you need to install Node.js (version v16.14.2) and @vue/cli version 4.5.15 and @ionic/cli (in case of the Mobile app). We recomend Visual Code as IDE for development in Vue.    
To contribute to must follow the contribution protocol describen in the main repo of the Drone Engineering Ecosystem.
[![DroneEngineeringEcosystem Badge](https://img.shields.io/badge/DEE-MainRepo-brightgreen.svg)](https://github.com/dronsEETAC/DroneEngineeringEcosystemDEE)
To run the application, after cloning the repo in your laptop you must execute these commands:
```
cd IonicVueMobileAppDEE
npm install
npm run serve
```
When running the code you may get errors such as this:

Module not found: Error: Can't resolve 'fs' in 'C:\Users\USER\Documents\Miguel\DEE_all_repos\IonicVueMobileAppDEE\node_modules\opencv.js'

In this case, you must include the following code in the package.json in node-modules/opencv.js:     
```
  "browser": {
    "fs": false,
    "path": false,
    "os": false,
    "crypto": false
  }
  ```


