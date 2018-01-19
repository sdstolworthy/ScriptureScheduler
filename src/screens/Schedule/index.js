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
  Input,
  Fab
} from 'native-base'
import SettingsModal from '../Settings'
import { Constants } from 'expo'
import { connect, dispatch } from 'react-redux'
import * as ScheduleActions from '../../state/Schedule/actions'
import Moment from 'moment'
import base64 from 'base-64'
let scriptures = {}


class Schedule extends Component {
  statusBar = {
    backgroundColor: '#000000',
    height: Constants.statusBarHeight
  }
  constructor (props) {
    super(props)
    this.state = {
      schedule: [],
      settingsVisible: true,
    }
  }
  componentWillMount () {
    this.props.getSchedule()
  }
  renderListItem = (value, index, array) => {
    return (
      <ListItem key={index}>
        <Body>
          {value.map((v, i) => (
            <Text key={i}>
              {v.name}
            </Text>
          ))}
        </Body>
        <Right style={{flex: 3}}>
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
    const schedule = this.props.schedule.map(this.renderListItem)
    return (
      <Container style={{ paddingTop: 20 }}>
        <Content>
          <List>
            {schedule}
          </List>
        </Content>
        <Fab
          position="bottomRight"
          style={{ backgroundColor: '#5067FF' }}
          onPress={()=>this.setState({settingsVisible: true})}
        >
          <Icon name="ios-add" />
        </Fab>
        <SettingsModal visible={this.state.settingsVisible} onRequestClose={()=>this.setState({settingsVisible: false})}/>
      </Container>
    )
  }
}

const mstp = (state) => {
  return {
    schedule: state.Schedule.entries
  }
}
const mdtp = (dispatch) => ({
  getSchedule: () => dispatch(ScheduleActions.loadSchedule())
})

export default connect(mstp, mdtp)(Schedule)