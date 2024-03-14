import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import ConnectTab from '../views/ConnectTab.vue'
import AutopilotPage from '../views/AutopilotPage.vue'
import CameraPage from '../views/CameraPage.vue'
import PaintPage from '../views/PaintPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: ConnectTab
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: 'autopilot',
        component: AutopilotPage,
        name: "AutopilotTab",
      },
      {
        path: 'camera',
        component: CameraPage,
        name: "CameraTab",
      },
      {
        path: 'paint',
        component: PaintPage,
        name: "LEDsTab"
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
