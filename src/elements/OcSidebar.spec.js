import { shallowMount } from "@vue/test-utils"
import Sidebar from "./OcSidebar.vue"

const defaultProps = {
  productName: 'ownCloud',
  navItems: [
    { name: 'Home', route: { path: '/' }, icon: 'home' },
    { name: 'All files', route: { path: '/files' }, icon: 'folder' },
    { name: 'Shared files', route: { path: '/shared' }, icon: 'share', active: true }
  ]
}

describe("OcSidebar", () => {
  it('displays a logo image if its source is specified', () => {
    const logoSrc = 'https://owncloud.org/wp-content/themes/owncloud/img/owncloud-org-logo.svg'
    const wrapper = shallowMount(Sidebar, {
      propsData: {
        ...defaultProps,
        logoImg: logoSrc
      }
    })
    const logoImg = wrapper.find('.oc-sidebar-logo-img')

    expect(wrapper.findAll('.oc-sidebar-logo-img').length).toBe(1)
    expect(logoImg.attributes('src')).toMatch(logoSrc)
    expect(logoImg.attributes('alt')).toMatch('ownCloud')
    expect(wrapper).toMatchSnapshot()
  })

  it('displays nav items', () => {
    const wrapper = shallowMount(Sidebar, {
      propsData: defaultProps
    })

    expect(wrapper.findAll('.oc-sidebar-nav-item').length).toBe(3)
    expect(wrapper).toMatchSnapshot()
  })

  it('displays upperContent and footer slots', () => {
    const wrapper = shallowMount(Sidebar, {
      propsData: defaultProps,
      slots: {
        upperContent: '<strong class="upper-slot">Files app</strong>',
        footer: '<small slot="footer" class="footer-slot">Made by ownClouders</small>'
      }
    })

    expect(wrapper.findAll('.upper-slot').length).toBe(1)
    expect(wrapper.find('.upper-slot').text()).toMatch('Files app')
    expect(wrapper.findAll('.footer-slot').length).toBe(1)
    expect(wrapper.find('.footer-slot').text()).toMatch('Made by ownClouders')
    expect(wrapper.find('.oc-sidebar-nav').classes()).toContain('uk-margin-bottom')
    expect(wrapper).toMatchSnapshot()
  })

  it('Sets fixed position', () => {
    const wrapper = shallowMount(Sidebar, {
      propsData: {
        ...defaultProps,
        fixed: true,
        closeButtonLabel: 'Close sidebar'
      }
    })
  
    expect(wrapper.classes()).toContain('oc-sidebar-fixed')
    expect(wrapper.findAll('.oc-sidebar-button-close').length).toBe(1)
    expect(wrapper.find('.oc-sidebar-button-close').attributes('arialabel')).toMatch('Close sidebar')
    expect(wrapper).toMatchSnapshot()
  })

  it('Emits closed event', async () => {
    const wrapper = shallowMount(Sidebar, {
      propsData: {
        ...defaultProps,
        fixed: true
      }
    })

    wrapper.find('.oc-sidebar-button-close').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().close).toBeTruthy()
  })
})
