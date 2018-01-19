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
  Button
} from 'native-base'
import { Text, TextInput } from 'react-native'
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
class SettingsPanel extends React.Component {
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
      this.setState({daysSelection: value})
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
  render () {
    const {
      daysSelection,
      bookSelection
    } = this.state
    return (
      <Container>
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
                  <CheckBox checked={this.state.bookSelection.indexOf(v.id) > -1} />
                  <Body>
                    <Text>
                      {v.name}
                    </Text>
                  </Body>
                </ListItem>
              )
            })}
          </Form>
          <Button
            onPress={() => this.props.genSchedule(daysSelection, bookSelection)}
            primary
            disabled={!(this.state.bookSelection.length > 0 && this.state.daysSelection)}
          >
            <Text>Create Schedule</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

mstp = (state, ownProps) => ({
  schedule: state.Schedule.entries
})

mdtp = (dispatch) => ({
  genSchedule: (days = 1, books = []) => dispatch(ScheduleActions.genSchedule(days, books))
})

export default connect(mstp, mdtp)(SettingsPanel)
