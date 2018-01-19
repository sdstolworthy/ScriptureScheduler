import { StackNavigator, DrawerNavigator } from 'react-navigation'
import Schedule from './Schedule'
import SettingsPanel from './Settings/index';

const stack = StackNavigator({
  Home: {
    screen: Schedule,
    navigationOptions: {
      header: null,
    },
  }
})
export default stack