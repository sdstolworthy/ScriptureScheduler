import { StackNavigator, DrawerNavigator } from 'react-navigation'
import Schedule from './Schedule'
import SettingsPanel from './Settings/index';

const stack = DrawerNavigator({
  Home: {
    screen: Schedule,
  }
}, {
  contentComponent: SettingsPanel
})
export default stack