<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title class="ion-text-center">Drone Engineering Ecosystem</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-button  v-if = "broker == 'hivemq'" expand="full" color="danger"  @click="changeBroker">Cambia a dronseetac</ion-button>
        <ion-button  v-if = "broker == 'dronseetac'"  expand="full" color="danger"  @click="changeBroker">Cambia a hivemq</ion-button>

        <ion-button @click = 'connect' class="connectButton" href = "/tabs">Connect to the external broker</ion-button>
      </ion-content>
    </ion-page>
</template>
  
<script>
  import { defineComponent, onMounted, ref } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
  import { useMQTT } from 'mqtt-vue-hook'
  
  export default  defineComponent({
    name: 'ComponentTab',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton },

    setup() {
      const mqttHook = useMQTT()
      let broker = ref('dronseetac');
      onMounted(() => {
        //mqttHook.publish("mobileApp/autopilotService/connect", "", 1)
      })
      
      function connect () {
        console.log ('connect')
        mqttHook.publish("mobileApp/autopilotService/connect", "", 1)
      }

      function changeBroker() {
        mqttHook.disconnect()
      
        if (broker.value == "dronseetac") {
          mqttHook.connect(`ws://broker.hivemq.com:8000/mqtt`, {
            clean: false,
            keepalive: 60,
            clientId: `mqtt_client_${Math.random().toString(16).substring(2, 10)}`,
            connectTimeout: 8000,
          })
          broker.value = "hivemq";
        } else {
          mqttHook.connect(`ws://dronseetac.upc.edu:8000/mqtt`, {
            clean: false,
            keepalive: 60,
            clientId: `mqtt_client_${Math.random().toString(16).substring(2, 10)}`,
            connectTimeout: 8000,
            username: 'dronsEETAC',
            password: 'mimara1456.'
          })
          broker.value = "dronseetac";

        }

      }   


      return {
        connect,
        changeBroker,
        broker

      }
    }
  })
</script>

<style>

.connectButton {
  margin: 10%;
  height: 80%;
  width: 80%;
}

</style>
  