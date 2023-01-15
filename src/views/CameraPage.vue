<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">Camera Section</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col col-1>
          <ion-button style="width:100%" @click="startVideoStream">Start video stream</ion-button>
        </ion-col>
        <ion-col col-2>
          <ion-button style="width:100%" color="danger" @click="stopVideoStream">Stop video stream</ion-button>
        </ion-col>
      </ion-row>
      <ion-button style="width: 50%; margin-left: 25%" color="warning" @click="takePicture">Take a picture</ion-button>
      <ion-content>
        <canvas style = "margin-left: 5%; margin-top: 5%; width: 60%; height: 70%; border-style: solid" id = "output"></canvas>
        <ion-list style="margin-left: 68%; margin-top: -37.5%; border: solid blueviolet; margin-right: 3%">
          <ion-item>
            <ion-title>Controur option:</ion-title>
            <ion-select v-model="mode" interface="popover" placeholder="Select controur option">
              <ion-select-option value="Normal">Normal</ion-select-option>
              <ion-select-option value="Shovel">Shovel</ion-select-option>
              <ion-select-option value="Scharr">Scharr</ion-select-option>
              <ion-select-option value="Laplacian">Laplacian</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
        <ion-list style="margin-left: 68%; margin-top: 2%; border: solid green; margin-right: 3%">
          <ion-item>
            <ion-title>Colour option:</ion-title>
            <ion-select v-model="mode" interface="popover" placeholder="Select controur option">
              <ion-select-option value="Normal">Normal</ion-select-option>
              <ion-select-option value="Gray">Gray</ion-select-option>
              <ion-select-option value="Canny">Canny</ion-select-option>
              <ion-select-option value="Blued">Blued</ion-select-option>
              <ion-select-option value="Pinked">Pinked</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonCol, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/vue';
import { onMounted,defineComponent, ref } from 'vue'
import * as cv from 'opencv.js'
import { useMQTT } from 'mqtt-vue-hook'

const mqttHook = useMQTT()

export default  defineComponent({
  name: 'CameraPage',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonRow, IonCol, IonList, IonItem, IonSelect, IonSelectOption },

  setup () {
    let mode = ref('Normal');   
        
    onMounted(() => {

      const openCVFunction = {
        options: function (topic, message) {
          const img = new Image();
          img.src = "data:image/jpg;base64,"+message;
          img.onload = () => {  
            let dst = new cv.Mat();
            let source = cv.imread(img);
            cv.cvtColor(source, source, cv.COLOR_RGB2GRAY, 0);

            if (mode.value == 'Shovel'){
              cv.Sobel(source, dst, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
            }

            if (mode.value == 'Scharr') {
              cv.Scharr(source, dst, cv.CV_8U, 1, 0, 1, 0, cv.BORDER_DEFAULT);
            }

            if (mode.value == 'Laplacian') {
              cv.Laplacian(source, dst, cv.CV_8U, 1, 1, 0, cv.BORDER_DEFAULT);
            }

            if (mode.value == 'Normal'){
              dst = cv.imread(img);
            }

            if (mode.value == 'Gray') {
              let mat = cv.imread(img);
              dst = new cv.Mat();
              cv.cvtColor(mat, dst, cv.COLOR_RGB2GRAY,0);
              mat.delete()
            }

            if (mode.value == 'Canny') {
              let mat = cv.imread(img);
              dst = new cv.Mat();
              cv.cvtColor(mat, dst, cv.COLOR_RGB2GRAY,0);
              cv.Canny(mat, dst, 50, 100, 3, false);
              mat.delete()
            }

            if(mode.value == 'Blued'){
              let mat = cv.imread(img);
              dst = new cv.Mat();
              cv.cvtColor(mat, dst, cv.COLOR_RGB2XYZ,0);
              mat.delete()
            }
            
            if(mode.value == 'Pinked'){
              let mat = cv.imread(img);
              dst = new cv.Mat();
              cv.cvtColor(mat, dst, cv.COLOR_RGB2YCrCb,0);
              mat.delete()
            }

            cv.imshow('output',dst);
          };
        }
      }
      
      mqttHook.registerEvent('cameraService/mobileApp/videoFrame', (topic, message) => {
        openCVFunction.options(topic, message)
      })

      mqttHook.registerEvent('cameraService/mobileApp/picture', (topic, message) => {
        openCVFunction.options(topic, message)
      })
    })
    
    function startVideoStream () {
      mqttHook.publish("mobileApp/cameraService/startVideoStream", "", 1)
      mqttHook.subscribe("cameraService/mobileApp/videoFrame", 1);
    }

      function stopVideoStream () {
      mqttHook.publish("mobileApp/cameraService/stopVideoStream", "", 1)
    }

    function takePicture () {
      mqttHook.publish("mobileApp/cameraService/takePicture", "", 1)
      mqttHook.subscribe("cameraService/mobileApp/picture", 1)
    }
    
    return {
        startVideoStream,
        stopVideoStream,
        takePicture,
        mode
    }
  }
});
</script>