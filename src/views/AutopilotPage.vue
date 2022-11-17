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
import { defineComponent, onMounted, inject, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonRow, IonCol, IonLabel } from '@ionic/vue';

export default  defineComponent({
  name: 'AutopilotPage',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonRow, IonCol, IonLabel },

  setup() {

    const emitter = inject('emitter');
    let client = inject('mqttClient');
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
      client.on("message", function(topic, message){
        if (topic == "autopilotService/mobileApp/droneHeading") {
          heading.value = message
        }

        if (topic == "autopilotService/mobileApp/dronePosition") {
          position.value = message
        }

        if (topic == "autopilotService/mobileApp/droneAltitude") {
          currentAltitude.value = message
        }
        
        if (topic == "autopilotService/mobileApp/droneGroundSpeed") {
          groundSpeed.value = message
        }
      })
    })

    function armDrone() {
      connected.value = true
      client.publish("mobileApp/autopilotService/armDrone", "")
    }

    function disarmDrone() {
      connected.value = false
      client.publish("mobileApp/autopilotService/disarmDrone", "")
    }

    function getDroneHeading() {
      client.publish("mobileApp/autopilotService/getDroneHeading", "")
      client.subscribe("autopilotService/mobileApp/droneHeading")
    }

    function takeOff() {
      client.publish("mobileApp/autopilotService/takeOff", altitude.value)
    }

    function getActualPosition(){
      client.publish("mobileApp/autopilotService/getDronePosition")
      client.subscribe("autopilotService/mobileApp/dronePosition")
      let fromBytesToString = ref(undefined)
      fromBytesToString.value = new TextDecoder("utf-8").decode(position.value)
      let positionSplitted = fromBytesToString.value.split("*")
      current_lat.value = positionSplitted[0]
      current_lng.value = positionSplitted[1]
    }

    function getGroundSpeed(){
      client.publish("mobileApp/autopilotService/getDroneGroundSpeed", "")
      client.subscribe("autopilotService/mobileApp/droneGroundSpeed")
    }

    function getCurrentAltitude(){
      client.publish("mobileApp/autopilotService/getDroneAltitude", "")
      client.subscribe("autopilotService/mobileApp/droneAltitude")
    }

    function goToPosition(){
      let positionStr = goToLat.value + "*" + goToLng.value
      client.publish("mobileApp/autopilotService/goToPosition", positionStr)
    }

    function returnToLaunch(){
      client.publish("mobileApp/autopilotService/returnToLaunch", "")
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
