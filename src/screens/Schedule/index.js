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
  Fab,
  CheckBox
} from 'native-base'
import AvailableSchedulesModal from '../AvailableSchedules'
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
      settingsVisible: false,
      showAvailableSchedules: false
    }
  }
  componentWillMount () {
    this.props.getSchedule()
  }
  addFromAvailableSchedulesModal = () => {
    this.setState({ showAvailableSchedules: false, settingsVisible: true })
  }
  markComplete = (assignmentId, scheduleId) => {
    this.props.markAssignmentComplete(assignmentId, scheduleId)
  }
  renderListItem = (value, index, array) => {
    return (
      <ListItem key={index} onPress={() => this.markComplete(value.id, this.props.assignment.id)}>
        <Left>
          <CheckBox 
            checked={value.complete}
          />
        </Left>
        <Body style={{flex:3}}>
          {(value.reading || []).map((v, i) => (
            <Text key={i}>
              {v.name}
            </Text>
          ))}
        </Body>
        <Right style={{ flex: 3 }}>
          <Text>
            {Moment().add(index, 'DAYS').format('D MMMM')}
          </Text>
          <Text>
            {Math.round((value.reading || []).reduce((acc, curr) => acc + curr.time, 0), 2) + ' minutes'}
          </Text>
        </Right>
      </ListItem>
    )
  }
  selectSchedule = (id) => {
    this.props.getSchedule(id)
    this.setState({showAvailableSchedules: false})
  }
  render () {
    const schedule = this.props.schedule.map(this.renderListItem) || []
    return (
      <Container>
        <Header>
          <Left />
          <Body style={{ flex: 4 }}>
            <Title>Schedule</Title>
          </Body>
          <Right>
            <Icon
              name="ios-menu"
              onPress={() => this.setState({ showAvailableSchedules: true })}
            />
          </Right>
        </Header>
        <Content>
          <List>
            {schedule}
          </List>
        </Content>
        <Fab
          position="bottomRight"
          style={{ backgroundColor: '#5067FF' }}
          onPress={() => this.setState({ settingsVisible: true })}
        >
          <Icon name="ios-add" />
        </Fab>
        <SettingsModal visible={this.state.settingsVisible} onRequestClose={() => this.setState({ settingsVisible: false })} />
        <AvailableSchedulesModal
          visible={this.state.showAvailableSchedules}
          onRequestClose={() => this.setState({ showAvailableSchedules: false })}
          addSchedule={this.addFromAvailableSchedulesModal}
          onSelectSchedule={this.selectSchedule}
        />
      </Container>
    )
  }
}

const mstp = (state) => {
  return {
    assignment: state.Schedule.entries,
    schedule: state.Schedule.entries && state.Schedule.entries.assignment || []
  }
}
const mdtp = (dispatch) => ({
  getSchedule: (id) => dispatch(ScheduleActions.loadSchedule(id)),
  markAssignmentComplete: (assignmentId, scheduleId) => dispatch(ScheduleActions.markAsComplete(assignmentId, scheduleId))
})

export default connect(mstp, mdtp)(Schedule)