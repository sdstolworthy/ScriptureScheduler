import React, { Component } from 'react'
import {
  Modal,
  Platform
} from 'react-native'
import {
  Container,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Title,
  Icon,
  CheckBox,
  Header,
  Content,
  Text,
  Button
} from 'native-base'
import { connect, dispatch } from 'react-redux'

class AvailableSchedulesModal extends Component {
  static androidIcon = Platform.OS === 'android' ? { color: 'white' } : {}
  constructor (props) {
    super(props)

    this.state = { showDelete: null }
  }
  renderScheduleListItem = (value, index) => {
    const { assignment } = this.props
    const rowBody = (
      <ListItem
        key={index}
        onPress={() => this.props.onSelectSchedule(value.value)}
        onLongPress={() => this.setState({ showDelete: value.value })}
      >
        < Left >
          <Text>{value.name}</Text>
        </Left >
        <Body>
          <Text style={{ color: 'gray' }}>{value.daysRemaining} Days Remaining</Text>
        </Body>
        <Right>
          <CheckBox
            checked={this.props.assignment.id === value.value}
            onPress={() => this.props.onSelectSchedule(value.value)}
          />
        </Right>
      </ListItem >
    )
    const showDelete = (
      <ListItem key={index} style={{ backgroundColor: 'red', flex: 4 }}>
        <Body style={{ backgroundColor: 'red', flex: 4 }} >
          <Text style={{ color: 'white', elevation: 1 }}>Delete Schedule</Text>
        </Body>
        <Right style={{ flex: 2 }} >
          <Button onPress={() => this.setState({ showDelete: null })}><Text>Cancel</Text></Button>
        </Right>
      </ListItem>
    )
    return this.state.showDelete === value.value ? showDelete : rowBody
  }
  handleClose = () => {
    this.setState({showDelete: null}, () => this.props.onRequestClose)
  }
  render () {
    return (
      <Modal visible={this.props.visible} onRequestClose={this.handleClose}>
        <Container>
          <Header>
            <Left>
              <Icon {...AvailableSchedulesModal.androidIcon} ios="ios-arrow-back" android="md-arrow-back" onPress={this.props.onRequestClose} />
            </Left>
            <Body style={{ flex: 4 }}>
              <Title>Available Schedules</Title>
            </Body>
            <Right>
              <Icon
                {...AvailableSchedulesModal.androidIcon}
                name="ios-add"
                onPress={this.props.addSchedule}
              />
            </Right>
          </Header>
          <Content>
            <List>
              {this.props.availableSchedules && this.props.availableSchedules.map(this.renderScheduleListItem)}
            </List>
          </Content>
        </Container>
      </Modal>
    )
  }
}

const mstp = ({ Schedule }, ownProps) => ({
  availableSchedules: Schedule.availableSchedules,
  assignment: Schedule.entries || {},
})
const mdtp = (dispatch) => ({

})
export default connect(mstp, mdtp)(AvailableSchedulesModal)