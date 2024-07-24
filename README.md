# Mobile App multijugador
Esta web app se usa con la aplicación de escenarios multijugador


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


