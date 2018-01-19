import React, { Component } from 'react'
import {
  Modal
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
} from 'native-base'
import { connect, dispatch } from 'react-redux'

class AvailableSchedulesModal extends Component {
  constructor (props) {
    super(props)
  }
  renderScheduleListItem = (value, index) => {
    return (
      <ListItem key={index} onPress={() => this.props.onSelectSchedule(value.value)}>
        <Left>
          <Text>{value.name}</Text>
        </Left>
        <Body>
          <Text style={{color: 'gray'}}>{value.daysRemaining} Days Remaining</Text>
        </Body>
        <Right>
          <CheckBox checked={this.props.assignment.id === value.value} />
        </Right>
      </ListItem>
    )
  }
  render () {
    return (
      <Modal visible={this.props.visible} onRequestClose={this.props.onRequestClose}>
        <Container>
          <Header>
            <Left />
            <Body style={{ flex: 4 }}>
              <Title>Available Schedules</Title>
            </Body>
            <Right>
              <Icon
                name="ios-add"
                onPress={() => { }}
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