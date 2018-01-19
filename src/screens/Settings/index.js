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
import { TextInput, View, Modal, Platform } from 'react-native'
import { connect, dispatch } from 'react-redux'
import * as ScheduleActions from '../../state/Schedule/actions'
import * as Canons from '../../../data'
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
    onRequestClose: () => { return },
  }
  static androidIcon = Platform.OS === 'android' ? {color: 'white'} : {}
  constructor (props) {
    super(props)
    this.state = {
      bookSelection: [],
      daysSelection: 30,
      scheduleName: '',
    }
  }
  componentDidMount () {
    this.mapBookToChapterCount('BoM')
  }
  mapBookToChapterCount = (book) => {
    const re = /(([0-9]+\s)?(\w+))(\s\d+)/
    const bookCount = []
    const books = Object.keys(Canons[book]).map(v => {
      const arr = v.match(re)
      if (arr && arr.length > 0) {
        const bookName = arr[1]
        const index = bookCount.findIndex(v => bookName == v.name)
        if (index > -1) {
          bookCount[index].count += 1
        } else {
          bookCount.push({
            name: bookName,
            count: 1
          })
        }
      }
    })
  }
  handleDayChange = (value) => {
    try {
      if (value === null || value === '' || !value) {
        return this.setState({ daysSelection: value })
      }
      parseInt(value)
      if (value < 1) {
        value = 1
      }
      this.setState({ daysSelection: value })
    } catch (e) {
      this.setState({ daysSelection: 1 })
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
    const { daysSelection, bookSelection, scheduleName } = this.state
    this.props.genSchedule(daysSelection, bookSelection, scheduleName)
    this.props.onRequestClose()
  }
  render () {
    const {
      daysSelection,
      bookSelection
    } = this.state
    return (
      <Modal visible={this.props.visible} onRequestClose={this.props.onRequestClose}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.props.onRequestClose}>
                <Icon
                  {...SettingsModal.androidIcon}
                  name='arrow-back'
                />
              </Button>
            </Left>
            <Body style={{ flex: 4 }}>
              <Title>Create a Schedule</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>Name of Schedule</Label>
                <Input
                  value={this.state.scheduleName}
                  onChangeText={(scheduleName) => this.setState({ scheduleName })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Number of Days</Label>
                <Input
                  value={this.state.daysSelection.toString()}
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
  genSchedule: (days = 1, books = [], title = '') => dispatch(ScheduleActions.genSchedule(days, books, title))
})

export default connect(mstp, mdtp)(SettingsModal)
