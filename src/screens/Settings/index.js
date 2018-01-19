import React, { Component } from 'react'
import { 
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Picker
} from 'native-base'

export default class SettingsPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bookSelection: null,
      daysSelection: null,
    }
  }
  handleChange = (prop, value) => {
    this.setState({[prop]: value})
  }
  render () {
    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Label>Number of Days:</Label>
              <Input onChangeText={(e) => this.handleChange('daysSelection', e)} />
            </Item>
            <Picker
              mode="dropdown"
              placeholder="Select One"
              selectedValue={this.state.bookSelection}
              onValueChange={(e) => this.handleChange('bookSelection', e)}
            >
              <Item label="Entire Standard Works" value={"sw"} />
              <Item label="Book of Mormon" value="bom" />
              <Item label="Old Testament" value="ot" />
              <Item label="New Testament" value="nt" />
              <Item label="Doctrine and Covenants" value="dc" />
            </Picker>
          </Form>
        </Content>
      </Container>
    )
  }
}