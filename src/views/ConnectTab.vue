<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title class="ion-text-center">Drone Engineering Ecosystem</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-button class="connectButton" href = "/tabs">Connect</ion-button>
      </ion-content>
    </ion-page>
</template>
  
<script>
  import { defineComponent } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
  
  export default  defineComponent({
    name: 'ComponentTab',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton }
  });
</script>

<style>

.connectButton {
  margin: 10%;
  height: 80%;
  width: 80%;
}

</style>
  