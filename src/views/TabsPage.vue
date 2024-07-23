<template>
  <ion-page>


    <div style="display: flex; margin-top: 180px; margin-left: 40px; margin-right: 10px; position: relative;">
      <div style="display: flex; position: relative;" >
        <img :src="imagenURL" v-if="imagenURL" style="position: relative; width: 100%; height: 90%; top: -120px;" />
      </div>
    </div>

    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <!-- <ion-tab-button tab="AutopilotTab" href='/tabs/autopilot'>
          <ion-icon :icon="airplaneOutline" />
          <ion-label>Autopilot</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="CameraTab" href='/tabs/camera'>
          <ion-icon :icon="cameraOutline" />
          <ion-label>Camera</ion-label>
        </ion-tab-button> -->
        
        <ion-tab-button tab="LEDsTab" href='/tabs/paint'>
          <ion-icon :icon="brushOutline"/>
          <ion-label>Paint</ion-label>
        </ion-tab-button>

        <!-- <ion-tab-button tab="DisconectTab" href='/'>
          <ion-icon :icon="exitOutline" />
          <ion-label>Disconnect</ion-label>
        </ion-tab-button> -->
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { airplaneOutline, cameraOutline, exitOutline, brushOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    //const imagenURL = ref('/public/entrada2.png');

    const imagenURL = ref('entrada.png');
    return {
      cameraOutline, 
      brushOutline, 
      airplaneOutline,
      exitOutline,
      imagenURL,
    }
  }
});
</script>
