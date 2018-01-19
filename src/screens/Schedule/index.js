import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  AsyncStorage
} from 'react-native'
import ScheduleService from '../../services/Schedule'
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Button,
  Left,
  Right,
  Icon,
  Title,
  Body,
  Item,
  Input
} from 'native-base'
import { Constants } from 'expo'
import Moment from 'moment'
import base64 from 'base-64'
let scriptures = {}


export default class Schedule extends Component {
  statusBar = {
    backgroundColor: '#000000',
    height: Constants.statusBarHeight
  }
  constructor (props) {
    super(props)
    this.state = {
      schedule: []
    }
  }
  async componentWillMount () {
    // try {
    //   let schedule = await AsyncStorage.getItem('@Schedule')
    //   if (schedule) {
    //     schedule = JSON.parse(base64.decode(schedule))
    //   } else {
    //     schedule = ScheduleService.generateSchedule()
    //     const encoded = base64.encode(JSON.stringify(schedule))
    //     try {
    //       await AsyncStorage.setItem('@Schedule', encoded)
    //     } catch (error) {
    //       console.warn(error)
    //     }
    //   }
    //   this.setState({ schedule })
    // } catch (error) {
    //   console.warn(error)
    // }
    this.setState({
      schedule: ScheduleService.generateSchedule(80, ['OT','DC', 'PGP'])
    })
  }
  renderListItem = (value, index, array) => {
    // const test = Moment().format('d-mmmm')
    return (
      <ListItem key={index}>
        <Body>
          {value.map((v, i) => (
            <Text key={i}>
              {v.name}
            </Text>
          ))}
        </Body>
        <Right>
          <Text>
            {Moment().add(index, 'DAYS').format('D MMMM')}
          </Text>
          <Text>
            {Math.round(value.reduce((acc, curr) => acc + curr.time, 0), 2) + ' minutes'}
          </Text>
        </Right>
      </ListItem>
    )
  }
  render () {
    schedule = this.state.schedule.map(this.renderListItem)
    return (
      <Container style={{paddingTop: 20}}>
        {/* <Header /> */}
        <Content>
          <List>
            {schedule}
          </List>
        </Content>
      </Container>
    )
  }
}