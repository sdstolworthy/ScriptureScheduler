import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Expo, { SQLite, StatusBar, Font, AppLoading } from 'expo';
import Home from './src/screens'
import Schedule from './src/state'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

// const db = SQLite.openDatabase('db1.db');

// export { db }

export const store = createStore(
  Schedule,
  {},
  compose(applyMiddleware(thunkMiddleware))
)
export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isReady: false
    }
  }
  async componentWillMount () {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    // await db.transaction((tx) => {
    //   tx.executeSql('CREATE TABLE if not exists SCHEDULE (id integer primary key not null, date text, entry text);')
    // })
    this.setState({ isReady: true })
  }
  render () {
    if (this.state.isReady) {
      return (
        <Provider store={store}>
          <Home />
        </Provider>
      )
    } else {
      return (<View />)
    }
  }
}
