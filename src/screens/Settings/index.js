import React, { Component } from 'react'
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Body,
  CheckBox,
  ListItem,
  Button,
  Header,
  Right,
  Left,
  Icon,
  Title,
  Text
} from 'native-base'
import { TextInput, View, Modal } from 'react-native'
import { connect, dispatch } from 'react-redux'
import * as ScheduleActions from '../../state/Schedule/actions'
const multiSelectOptions = [{
  id: 'BoM',
  name: 'The Book of Mormon'
}, {
  id: 'OT',
  name: 'Old Testament'
}, {
  id: 'NT',
  name: 'New Testament',
}, {
  id: 'DC',
  name: 'Doctrine and Covenants'
}, {
  id: 'PGP',
  name: 'The Pearl of Great Price'
}]
class SettingsModal extends React.Component {
  static defaultProps = {
    visible: false,
    onRequestClose: () => { return }
  }
  constructor (props) {
    super(props)
    this.state = {
      bookSelection: [],
      daysSelection: 0,
    }
  }
  handleDayChange = (value) => {
    try {
      parseInt(value)
      this.setState({ daysSelection: value })
    } catch (e) {
      return
    }
  }
  handleCheck = (id) => {
    if (this.state.bookSelection.indexOf(id) > -1) {
      this.setState(prevState => {
        prevState.bookSelection.splice(prevState.bookSelection.indexOf(id), 1)
        return prevState
      })
    } else {
      this.setState(prevState => {
        prevState.bookSelection.push(id)
        return prevState
      })
    }
  }
  handleCreateSchedule = () => {
    const { daysSelection, bookSelection } = this.state
    this.props.genSchedule(daysSelection, bookSelection)
    this.props.onRequestClose()
  }
  render () {
    const {
      daysSelection,
      bookSelection
    } = this.state
    return (
      <Modal visible={this.props.visible} onRequestClose={this.props.handleClose}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.props.onRequestClose}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body style={{ flex: 4 }}>
              <Title>Create a Schedule</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Form>
              <Item>
                <Label>Number of Days:</Label>
                <Input
                  onChangeText={this.handleDayChange}
                  keyboardType="numeric"
                />
              </Item>
              {multiSelectOptions.map((v, i) => {
                return (
                  <ListItem
                    onPress={() => this.handleCheck(v.id)}
                    key={i}
                  >
                    <CheckBox
                      onPress={() => this.handleCheck(v.id)}
                      checked={this.state.bookSelection.indexOf(v.id) > -1}
                    />
                    <Body>
                      <Text>
                        {v.name}
                      </Text>
                    </Body>
                  </ListItem>
                )
              })}
            </Form>
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
              <Button
                onPress={this.handleCreateSchedule}
                primary
                style={{ margin: 5, marginTop: 10, alignSelf: 'center' }}
                disabled={!(this.state.bookSelection.length > 0 && this.state.daysSelection)}
              >
                <Text>Create Schedule</Text>
              </Button>
            </View>
          </Content>
        </Container >
      </Modal >
    )
  }
}

mstp = ({ Schedule }, ownProps) => ({
  schedule: Schedule.entries
})

mdtp = (dispatch) => ({
  genSchedule: (days = 1, books = []) => dispatch(ScheduleActions.genSchedule(days, books))
})

export default connect(mstp, mdtp)(SettingsModal)
