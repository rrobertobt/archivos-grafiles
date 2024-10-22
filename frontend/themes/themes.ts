import { definePreset } from "@primevue/themes";
import Aura from '@primevue/themes/aura';

const commonOptionsDefaults = {
  // darkModeSelector: '.my-app-dark'
}
const commonComponentsDefaults = {
  button: {
    borderRadius: 'calc(0.75rem - 2px) !important',
  },
  menu: {
    background: 'transparent !important',
  }
}

export const AuraWithAmber = definePreset(Aura, {
  options: commonOptionsDefaults,
  name: 'AuraWithAmber',
  components: commonComponentsDefaults,
  semantic: {
    primary: {
      50: '{amber.50}',
      100: '{amber.100}',
      200: '{amber.200}',
      300: '{amber.300}',
      400: '{amber.400}',
      500: '{amber.500}',
      600: '{amber.600}',
      700: '{amber.700}',
      800: '{amber.800}',
      900: '{amber.900}',
      950: '{amber.950}'
    },
  }
})

export const AuraWithIndigo = definePreset(Aura, {
  options: commonOptionsDefaults,
  // name: 'AuraWithIndigo',
  components: commonComponentsDefaults,
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}'
    },
  }
})

export const AuraWithNoir = definePreset(Aura, {
  options: commonOptionsDefaults,
  name: 'AuraWithNoir',
  components: commonComponentsDefaults,
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}'
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        }
      }
    }
  }
})