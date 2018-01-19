import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Expo, { SQLite, StatusBar, Font, AppLoading } from 'expo';
import Home from './src/screens'
const db = SQLite.openDatabase('db1.db');

export { db }

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
    await db.transaction((tx) => {
      tx.executeSql('CREATE TABLE if not exists SCHEDULE (id integer primary key not null, date text, entry text);')
    })
    this.setState({ isReady: true })
  }
  render () {
    if (this.state.isReady) {
      return (<Home />)
    } else {
      return (<View />)
    }
  }
}
