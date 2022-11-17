import { mount } from '@vue/test-utils'
import AutopilitPage from '@/views/AutopilotTab.vue'

describe('AutopilotPage.vue', () => {
  it('renders tab 1 AutopilotPage', () => {
    const wrapper = mount(AutopilitPage)
    expect(wrapper.text()).toMatch('Autopilot Section')
  })
})
