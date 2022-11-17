<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="AutopilotTab" href='/tabs/autopilot'>
          <ion-icon :icon="airplaneOutline" />
          <ion-label>Autopilot</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="CameraTab" href='/tabs/camera'>
          <ion-icon :icon="cameraOutline" />
          <ion-label>Camera</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="LEDsTab" href='/tabs/leds'>
          <ion-icon :icon="sunny" />
          <ion-label>LEDs</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="DisconectTab" href='/'>
          <ion-icon :icon="exitOutline" />
          <ion-label>Disconnect</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { airplaneOutline, cameraOutline, exitOutline, sunny } from 'ionicons/icons';

export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      cameraOutline, 
      sunny, 
      airplaneOutline,
      exitOutline
    }
  }
});
</script>
