<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center" text-align: center>Autopilot Section</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true"> 
      <div style = "width:80%; margin-left:10%">
      <ion-button v-if = "!connected" class="autopilotButton" color="tertiary"  @click="connect">Conectar</ion-button>
      
      <ion-button v-if = "connected && idPlayer == 0" class="autopilotButton" color="danger"  :disabled = "true">Conectado</ion-button>
      <ion-button v-if = "connected && idPlayer == 1" class="autopilotButton" color="tertiary"  :disabled = "true">Conectado</ion-button>
      <ion-button v-if = "connected && idPlayer == 2" class="autopilotButton" color="success"  :disabled = "true">Conectado</ion-button>
      <ion-button v-if = "connected && idPlayer == 3" class="autopilotButton" color="warning"  :disabled = "true">Conectado</ion-button>


      <ion-button  v-if = "!connected" class="autopilotButton" :disabled = "!connected" color="tertiary">Despega</ion-button>
      <ion-button  v-if = "connected && state != 'takingOff' && state != 'flying'" class="autopilotButton"  color="tertiary" @click="takeOff">Despega</ion-button>
      <ion-button  v-if = "connected && state == 'takingOff'" class="autopilotButton"  color="tertiary">Despegando...</ion-button>
      <ion-button  v-if = "connected && state == 'flying'" class="autopilotButton"  color="tertiary">En el aire</ion-button>


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
      
      <ion-button    class="autopilotButton"  color="danger" @click="borrarTodo">Borrar todo</ion-button>

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
    let idPlayer = ref (0);
    let randomId = 0
    const presentAlert1 = async () => {
        const alert = await alertController.create({
          header: 'Alerta',
          subHeader: 'No estas volando',
          buttons: ['OK'],
        });

        await alert.present();
      };
    const presentAlert2 = async () => {
        const alert = await alertController.create({
          header: 'Error',
          subHeader: 'Lo siento. Tendras que esperar',
          buttons: ['OK'],
        });

        await alert.present();
      };
    onUpdated(() => {
      console.log ('on updated')
    })

    onMounted(() => {
      console.log ('on mounted')
      mqttHook.subscribe("multiPlayerDash/mobileApp/#", 1)

      mqttHook.registerEvent('multiPlayerDash/mobileApp/accepted/+', (topic, message) => {
        // en la cuarta posición del topic viene el identificador aleatorio para verificar
        // que la respuesta es para este jugador
        if (Number (topic.split('/')[3] ) == randomId){
          if (!connected.value) {
            connected.value = true
            //el identificador del jugador es un número entre el 0 y el 3 (jugadores rojo, azul, verde y amarillo)
            idPlayer.value = message
            console.log ('aceptado: idPlayer ', idPlayer.value)
          }
        }
        
      })
      mqttHook.registerEvent('multiPlayerDash/mobileApp/notAccepted/+', (topic, message) => {
        // ya hay 4 jugadores. Este tendrá que esperar
        if (Number (topic.split('/')[3] ) == randomId){
          presentAlert2()
        }
      })

      mqttHook.registerEvent('multiPlayerDash/mobileApp/flying/+', (topic, message) => {
        // el la cuarta posición del topic está el identificador del jugador
        // para verificar que el mensaje es para él
        // así será en todos los mensajes que se reciban
        if (Number (topic.split('/')[3] ) == idPlayer.value){
          flying.value = true
          state.value = 'flying'
          console.log ('en el aire el dron ', idPlayer.value)
        }
      })
    
      mqttHook.registerEvent('multiPlayerDash/mobileApp/atHome/+', (topic, message) => {
        if (Number (topic.split('/')[3] ) == idPlayer.value){
          flying.value = false
          state.value = 'onHearth'
        }
      })
    
    
    })
  

    function go (event) {
      console.log ('entro')
      if (!flying.value){
        presentAlert1()
      } else {
        let dir = event.currentTarget.id;
        direction.value = dir
        // a todas las ordenes tengo que añadir en el topic el identificador del jugador
        mqttHook.publish("mobileApp/multiPlayerDash/go/"+ idPlayer.value, dir);
      }
    }
    function connect() {
      console.log ('connect')
      state.value = 'connecting'
      // al solicitar conexión añado en el topic un identificador aleatorio
      // que el dashboard añadirá a su respuesta, para saber que esa respuesta es para mi
      randomId = Math.random() 
      mqttHook.publish("mobileApp/multiPlayerDash/connect/"+randomId);
    }

    function takeOff() {
      state.value = 'takingOff'
      mqttHook.publish("mobileApp/multiPlayerDash/arm_takeOff/"+ idPlayer.value)
    }
    function returnToLaunch(){
      state.value = 'returningHome'
      mqttHook.publish("mobileApp/multiPlayerDash/RTL/"+ idPlayer.value)
    }
    function dibujar(){
      pintando.value = true
      console.log ('vamos a dibujar')
      mqttHook.publish("mobileApp/multiPlayerDash/startDrawing/"+ idPlayer.value)
    }
    function pararDibujar(){
      pintando.value = false
      mqttHook.publish("mobileApp/multiPlayerDash/stopDrawing/"+ idPlayer.value)
    }
    function borrar(){
      borrando.value = true
      mqttHook.publish("mobileApp/multiPlayerDash/startRemovingDrawing/"+ idPlayer.value)
    }
    function pararBorrar(){
      borrando.value = false
      mqttHook.publish("mobileApp/multiPlayerDash/stopRemovingDrawing/"+ idPlayer.value)
    }

    function borrarTodo(){
      mqttHook.publish("mobileApp/multiPlayerDash/removeAll/"+ idPlayer.value)
    }
    return {
      takeOff,
      altitude,
      groundSpeed,
      returnToLaunch,
      connected,
      emitter,
      armed,
      flying,
      go,
      state,
      heading,
      battery,
      connect,
      presentAlert1,
      presentAlert2,
      direction,
      dibujar,
      pararDibujar,
      borrar,
      pararBorrar,
      borrarTodo,
      pintando,
      borrando,
      idPlayer

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
