<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center" text-align: center>Autopilot Section</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div style = "width:80%; margin-left:10%">
      <ion-button v-if = "!connected" class="autopilotButton" color="tertiary"  :disabled = "true" @click="armDrone">Arm drone</ion-button>

      <ion-button v-if = "connected && state != 'arming' && state != 'takingOff'  && !flying && !armed" class="autopilotButton" color="tertiary" @click="armDrone">Arm drone</ion-button>
      <ion-button v-if = "connected && state == 'arming'" class="autopilotButton" :disabled = "true" color="secondary">Arming...</ion-button>
      <ion-button v-if = "connected && armed" class="autopilotButton" :disabled = "true" color="primary">Armed</ion-button>

      <ion-button  v-if = "state != 'takingOff' && !flying" class="autopilotButton" :disabled = "!armed" color="tertiary" @click="takeOff">Take off</ion-button>
      <ion-button  v-if = "state == 'takingOff'" class="autopilotButton" :disabled = "true" color="secondary" >Taking off ...</ion-button>
      <ion-button  v-if = "flying" class="autopilotButton" :disabled = "true" color="primary" >Flying</ion-button> 



      <div class="direction">
        <div v-if = "direction != 'NorthWest'" id="NorthWest" v-on:click="go($event)" class="box">NW</div>
        <div v-if = "direction == 'NorthWest'" id="NorthWest" v-on:click="go($event)" class="box2">NW</div>

        <div v-if = "direction != 'North'" id="North" v-on:click="go($event)" class="box" >N</div>
        <div v-if = "direction == 'North'" id="North" v-on:click="go($event)" class="box2" >N</div>

        <div v-if = "direction != 'NorthEast'" id="NorthEast" v-on:click="go($event)" class="box">NE</div>
        <div v-if = "direction == 'NorthEast'" id="NorthEast" v-on:click="go($event)" class="box2">NE</div>

        <div v-if = "direction != 'West'" id="West" v-on:click="go($event)" class="box">W</div>
        <div v-if = "direction == 'West'" id="West" v-on:click="go($event)" class="box2">W</div>

        <div v-if = "direction != 'Stop'" id="Stop" v-on:click="go($event)" class="box">STOP</div>
        <div v-if = "direction == 'Stop'" id="Stop" v-on:click="go($event)" class="box2">STOP</div>

        <div v-if = "direction != 'East'"  id="East" v-on:click="go($event)" class="box">E</div>
        <div v-if = "direction == 'East'"  id="East" v-on:click="go($event)" class="box2">E</div>

        <div v-if = "direction != 'SouthWest'" id="SouthWest" v-on:click="go($event)" class="box">SW</div>
        <div v-if = "direction == 'SouthWest'" id="SouthWest" v-on:click="go($event)" class="box2">SW</div>

        <div  v-if = "direction != 'South'" id="South" v-on:click="go($event)" class="box">S</div>
        <div  v-if = "direction == 'South'" id="South" v-on:click="go($event)" class="box2">S</div>

        <div v-if = "direction != 'SouthEast'" id="SouthEast" v-on:click="go($event)" class="box">SE</div>
        <div v-if = "direction == 'SouthEast'" id="SouthEast" v-on:click="go($event)" class="box2">SE</div>

      </div>

      <ion-button class="autopilotButton" :disabled = "!flying || state == 'returningHome'" color="tertiary" @click="drop">Drop</ion-button>
      <ion-button  v-if = "state != 'returningHome' && state != 'onHearth'"  class="autopilotButton" :disabled = "!flying" color="tertiary" @click="returnToLaunch">Return to launch</ion-button>
      <ion-button v-if = "state == 'returningHome'"  class="autopilotButton" :disabled = "true" color="secondary">Returning ...</ion-button>
      <ion-button v-if = "state == 'onHearth'"  class="autopilotButton" :disabled = "true" color="primary">On hearth</ion-button>
      <ion-button   v-if = "!pintando" class="autopilotButton"  color="primary" @click="dibujar">Dibujar</ion-button>
      <ion-button  v-if = "pintando" class="autopilotButton"  color="danger" @click="pararDibujar">Dejar de dibujar</ion-button>
      <ion-button  v-if = "!borrando" class="autopilotButton"  color="primary" @click="borrar">Borrar</ion-button>
      <ion-button  v-if = "borrando"  class="autopilotButton"  color="danger" @click="pararBorrar">Dejar de borrar</ion-button>
   
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, inject, onMounted, ref , onUpdated} from 'vue';
import { IonPage,alertController , IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput, IonRow, IonCol, IonLabel } from '@ionic/vue';
import { useMQTT } from 'mqtt-vue-hook' 

export default  defineComponent({
  name: 'PaintPage',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton },

  setup() {

    const emitter = inject('emitter');
    const mqttHook = useMQTT()
    let state = ref('connecting');
    let armed = ref(false);
    let flying = ref(false);
    let connected = ref(false);
    let altitude = ref(undefined);
    let groundSpeed = ref(undefined);
    let heading = ref(undefined);
    let battery = ref(undefined);
    let direction = ref(undefined);
    let pintando = ref(false);
    let borrando = ref(false);
    const presentAlert = async () => {
        const alert = await alertController.create({
          header: 'Alert',
          subHeader: 'You are not flying',
          buttons: ['OK'],
        });

        await alert.present();
      };
    onUpdated(() => {
      console.log ('on updated')
    })

    onMounted(() => {
      console.log ('on mounted')
      mqttHook.subscribe("autopilotService/+/telemetryInfo", 1)

      mqttHook.registerEvent('autopilotService/+/telemetryInfo', (topic, message) => {
        connected.value = true
        const data = JSON.parse(message)
        console.log ('telem ', data)
        state.value = data['state']
     
        if (data['state'] == 'armado')
           armed.value = true
             
        if (data['state'] == 'desarmado')
           armed.value = false
        
        if (data['state'] == 'volando')
           flying.value = true
        
        if (data['state'] == 'onHearth')
        {
           flying.value = false;
           armed.value = false;
        }


        battery.value = data['battery']
        heading.value = data['heading']
        altitude.value = data['altitude']
        groundSpeed.value = data['groundSpeed'].toFixed(2);

      })
    
    })
  

    function go (event) {
      console.log ('entro')
      if (!flying.value){
        presentAlert()
      } else {
        let dir = event.currentTarget.id;
        direction.value = dir
        mqttHook.publish("mobileApp/autopilotService/go", dir, 1);
      }
    }
    function connect() {
      console.log ('connect')
      state.value = 'connecting'
      mqttHook.publish("mobileApp/autopilotService/connect", "", 1);
      connect.value = true;
      state.value = 'connected'
    }
    function armDrone() {
      console.log ('arm')
      state.value = 'arming';
      mqttHook.publish("mobileApp/autopilotService/armDrone", "", 1);
    }

    function disarmDrone() {
      connected.value = false
      mqttHook.publish("mobileApp/autopilotService/disarmDrone", "", 1)
    }

    function takeOff() {
      state.value = 'takingOff'
      mqttHook.publish("mobileApp/autopilotService/takeOff", "10", 1)
    }
    function returnToLaunch(){
      mqttHook.publish("mobileApp/autopilotService/returnToLaunch", "", 1)
    }
    function dibujar(){
      pintando.value = true
      mqttHook.publish("webApp/miMain/empiezaADibujar", "", 1)
    }
    function pararDibujar(){
      pintando.value = false
      mqttHook.publish("webApp/miMain/paraDeDibujar", "", 1)
    }
    function borrar(){
      borrando.value = true
      mqttHook.publish("webApp/miMain/empiezaABorrar", "", 1)
    }
    function pararBorrar(){
      borrando.value = false
      mqttHook.publish("webApp/miMain/paraDeBorrar", "", 1)
    }

    return {
      takeOff,
      altitude,
      groundSpeed,
      returnToLaunch,
      connected,
      armDrone,
      disarmDrone,
      emitter,
      armed,
      flying,
      go,
      state,
      heading,
      battery,
      connect,
      presentAlert,
      direction,
      dibujar,
      pararDibujar,
      borrar,
      pararBorrar,
      pintando,
      borrando

    }
  }
});
</script>

<style>

  .autopilotButton {
    display: flex;
    margin: 1%;
  }

  .direction {
    display: grid;
    grid-template-rows: 100px 100px 100px;
    grid-template-columns: 100px 100px 100px;
    text-align: center;
    width:80%;
    margin-left: 5%;

  }


  body {
    display: flex;
    justify-content: center;
  }
  .box {
    background: #444;
    border: 1px solid #555;
    display: flex;
    align-items: center;
    justify-content: center;
    color: yellowgreen;
    font-size: 18px;
    margin: 5px
  }
  .box2 {
    background: rgb(233, 226, 226);
    border: 1px solid #555;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(224, 16, 16);
    font-size: 18px;
    margin: 5px
  }
</style>
