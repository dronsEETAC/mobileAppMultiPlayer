<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title class="ion-text-center">Drone Engineering Ecosystem</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content >
        <ion-button  v-if = "broker == 'hivemq'" expand="full" color="danger"  @click="changeBroker">Cambia a dronseetac</ion-button>
        <ion-button  v-if = "broker == 'dronseetac'"  expand="full" color="danger"  @click="changeBroker">Cambia a hivemq</ion-button>
        <ion-button @click = 'connect'  expand="full" href = "/tabs/paint">Jugar</ion-button>

        <div style="display: flex; margin-top: 150px; margin-left: 40px; margin-right: 10px; position: relative;">
          <div style="display: flex; position: relative;" >
            <img :src="imagenURL" v-if="imagenURL" style="position: relative; width: 90%; height: 80%; top: -120px;" />
          </div>
        </div>
     
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
      const imagenURL = ref('entrada.png');
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
        broker,
        imagenURL

      }
    }
  })
</script>

<style>

.connectButton {
  margin: 10%;
  height: 10%;
  width: 80%;
}

</style>
  