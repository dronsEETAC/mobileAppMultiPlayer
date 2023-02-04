# Mobile APP
![dashboardDemo](https://user-images.githubusercontent.com/100842082/213115045-5d912126-e94c-4f48-93bd-4e28fc3db477.png)

The Mobile APP is a front-end module developed in Ionic Vue. It allows the user to do a bunch of things, including:
- Showing the picture/video stream sent by the camera service
- Free guiding the drone
- Showing telemetry data
- Starting/Stopping a LED sequence in the drone

## Demo
This video es a short demo of some of the functionalities of the Mobile APP. In the video:
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


The Dashboard is started. A configuration pannel is presented to the user who can decide modes, external brokers, configure the monitor (record messages published in brokers) and configure the data service (that currently can only record positions).  
5. The user get pictures and video stream from the camera service.   
6. The user connect with the autopilot (the simulator). Note that telemetry info comes as soon as the autopilot is connected.  
7. The user arms and takes off. The Mission Planner pannel is shown to chech that everything is working. Note that the drone 8. stops at 5 meters of altitude, ignoring the altitud introduced by the user.    
The user guides the drone in different directions and returns to home.   
9. A simple mission planner is opened to introduce and run a flight plan. Note that we can indicate the waypoints where the drone must take a picture and send it to the Dashboard.    
10. A second option form flight planning is used to generate a scan of a rectangular area.   
11. The flight plan is save into a file and reloaded to be run again.     
   
You can also play with a third option for flight planning (spiral) or to start/stop the monitor from the main pannel of the Dashboard, or to show the positions recorded by the data service in case it was asked to do so or to play with the LEDs service.   




