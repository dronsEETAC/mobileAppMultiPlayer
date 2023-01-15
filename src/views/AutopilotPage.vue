<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center" text-align: center>Autopilot Section</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-button v-if = "!connected" class="armDisarmButton" color="tertiary" @click="armDrone">Arm drone</ion-button>
      <ion-button v-if = "connected" class="armDisarmButton" color="tertiary" @click="disarmDrone">Disarm drone</ion-button>
      <ion-row v-if = "connected">
        <ion-col col-3>
          <ion-button style="width: 100%; height: 100%" @click="getDroneHeading">Get Heading</ion-button>
        </ion-col>
        <ion-col col-9>
          <ion-item>
            <ion-input v-model="heading" readonly> </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row v-if = "connected" style="margin-top: 1%;">
        <ion-col col-3>
          <ion-button v-if = "connected" @click="takeOff" style="width: 100%; height: 100%">Take off to</ion-button>
        </ion-col>
        <ion-col col-9>
          <ion-item>
            <ion-input v-model="altitude"> </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row v-if = "connected" style="margin-top: 1%;">
        <ion-col col-3>
          <ion-button @click="getGroundSpeed" style="width: 100%; height: 100%">Get drone ground speed</ion-button>
        </ion-col>
        <ion-col col-9>
          <ion-item>
            <ion-input v-model="groundSpeed" readonly> </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row v-if = "connected" style="margin-top: 1%;">
        <ion-col col-3>
          <ion-button @click="getCurrentAltitude" style="width: 100%; height: 100%">Get drone altitude</ion-button>
        </ion-col>
        <ion-col col-9>
          <ion-item>
            <ion-input v-model="currentAltitude" readonly> </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row v-if = "connected" style="margin-top: 1%;">
        <ion-col col-3>
          <ion-button v-if = "connected" @click="getActualPosition" style="width: 100%; height: 100%">Get actual position</ion-button>
        </ion-col>
        <ion-col col-6>
          <ion-item>
            <ion-label floating>Latitude: </ion-label>
            <ion-input v-model="current_lat" readonly> </ion-input>
          </ion-item>
        </ion-col>
        <ion-col col-9>
          <ion-item class="padding-left-2px">
            <ion-label floating>Longitude: </ion-label>
            <ion-input v-model="current_lng" readonly> </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row v-if = "connected" style="margin-top: 1%;">
        <ion-col col-3>
          <ion-button @click="goToPosition" style="width: 100%; height: 100%">Go to position</ion-button>
        </ion-col>
        <ion-col col-6>
          <ion-item>
            <ion-label floating>Latitude: </ion-label>
            <ion-input v-model="goToLat"> </ion-input>
          </ion-item>
        </ion-col>
        <ion-col col-9>
          <ion-item class="padding-left-2px">
            <ion-label floating>Longitude: </ion-label>
            <ion-input v-model="goToLng"> </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-button v-if = "connected" @click="returnToLaunch" style="margin-top: 2%; width: 100%; height: 10%">Return to launch</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, inject, onMounted, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonRow, IonCol, IonLabel } from '@ionic/vue';
import { useMQTT } from 'mqtt-vue-hook'

export default  defineComponent({
  name: 'AutopilotPage',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonRow, IonCol, IonLabel },

  setup() {

    const emitter = inject('emitter');
    const mqttHook = useMQTT()
    let connected = ref(false);
    let altitude = ref(undefined);
    let current_lat = ref(undefined);
    let current_lng = ref(undefined);
    let heading = ref(undefined);
    let groundSpeed = ref(undefined);
    let currentAltitude = ref(undefined);
    let goToLat = ref(undefined);
    let goToLng = ref(undefined);
    let position = ref(undefined);

    onMounted(() => {
      mqttHook.registerEvent('autopilotService/mobileApp/droneHeading', (topic, message) => {
        heading.value = message
      })

      mqttHook.registerEvent('autopilotService/mobileApp/dronePosition', (topic, message) => {
        position.value = message
      })

      mqttHook.registerEvent('autopilotService/mobileApp/droneAltitude', (topic, message) => {
        currentAltitude.value = message
      })

      mqttHook.registerEvent('autopilotService/mobileApp/droneGroundSpeed', (topic, message) => {
        groundSpeed.value = message
      })
    })

    function armDrone() {
      connected.value = true
      mqttHook.publish("mobileApp/autopilotService/armDrone", "", 1)
    }

    function disarmDrone() {
      connected.value = false
      mqttHook.publish("mobileApp/autopilotService/disarmDrone", "", 1)
    }

    function getDroneHeading() {
      mqttHook.publish("mobileApp/autopilotService/getDroneHeading", "", 1)
      mqttHook.subscribe("autopilotService/mobileApp/droneHeading", 1)
    }

    function takeOff() {
      mqttHook.publish("mobileApp/autopilotService/takeOff", altitude.value, 1)
    }

    function getActualPosition(){
      mqttHook.publish("mobileApp/autopilotService/getDronePosition", "", 1)
      mqttHook.subscribe("autopilotService/mobileApp/dronePosition", 1)
      let fromBytesToString = ref(undefined)
      fromBytesToString.value = new TextDecoder("utf-8").decode(position.value)
      let positionSplitted = fromBytesToString.value.split("*")
      current_lat.value = positionSplitted[0]
      current_lng.value = positionSplitted[1]
    }

    function getGroundSpeed(){
      mqttHook.publish("mobileApp/autopilotService/getDroneGroundSpeed", "", 1)
      mqttHook.subscribe("autopilotService/mobileApp/droneGroundSpeed", 1)
    }

    function getCurrentAltitude(){
      mqttHook.publish("mobileApp/autopilotService/getDroneAltitude", "", 1)
      mqttHook.subscribe("autopilotService/mobileApp/droneAltitude", 1)
    }

    function goToPosition(){
      let positionStr = goToLat.value + "*" + goToLng.value
      mqttHook.publish("mobileApp/autopilotService/goToPosition", positionStr, 1)
    }

    function returnToLaunch(){
      mqttHook.publish("mobileApp/autopilotService/returnToLaunch", "", 1)
    }

    return {
      takeOff,
      altitude,
      getActualPosition,
      current_lat,
      current_lng,
      getDroneHeading,
      heading,
      getGroundSpeed,
      groundSpeed,
      getCurrentAltitude,
      currentAltitude,
      goToLat,
      goToLng,
      goToPosition,
      returnToLaunch,
      connected,
      armDrone,
      disarmDrone,
      emitter,
    }
  }
});
</script>

<style>

  .armDisarmButton {
    display: flex;
    margin: 5%;
  }

</style>
