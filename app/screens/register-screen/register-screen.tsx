import * as React from "react"
import { inject, observer } from "mobx-react"
import { ViewStyle, View, SafeAreaView, Image } from "react-native"
import { Card, Button } from 'react-native-elements'
import { TextField } from 'react-native-tecnovix-material-textfield'
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { BarIndicator } from 'react-native-indicators'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Col, Row, Grid } from "react-native-easy-grid"
import Modal from "react-native-modal"
import { DataStore } from "../../models/data-store"
import { global } from "../../utils/global"

export interface RegisterScreenProps extends NavigationScreenProps<{}> {
  dataStore: DataStore
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
}

@inject("dataStore")
@observer
export class RegisterScreen extends React.Component<RegisterScreenProps, {}> {

  constructor(props) {
    super(props)
    this.state = {
      redirect: 0,
      popupNotice: {
        visible: false,
        type: 0,
        message: ''
      },
      popupIndicator: false,
      name: {
        value: "",
        error: ""
      },
      username: {
        value: "",
        error: ""
      },
      password: {
        value: "",
        error: ""
      }
    }
  }

  noticeImage = [
    require('../../assets/failed.png'),
    require('../../assets/success.png')
  ]

  doShowNotice = (type, message) => {
    this.setState({
      popupNotice: {
        visible: true,
        type: type,
        message: message
      }
    })
  }

  renderNotice = () => (
    <Grid style={{ alignItems: 'center' }}>
      <Row />
      <Row style={{ width: 260, height: 240, borderWidth: 2, borderColor: 'black', padding: 20, backgroundColor: color.background, borderRadius: 10 }}>
        <Col>
          {/***** Message Panel *****/}
          <Row style={{ height: 120 }}>
            <Col style={{ alignItems: 'center' }}>
              <Image
                style={{ width: 110, height: 110 }}
                source={this.noticeImage[this.state.popupNotice.type]}
              />
            </Col>
          </Row>
          {/***** Message Panel *****/}
          <Row style={{ height: 20 }}>
            <Col style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: color.dark }}>{this.state.popupNotice.message}</Text>
            </Col>
          </Row>
          <Row>
            <Col style={{ alignItems: 'center' }}>
              <Button
                backgroundColor={color.palette.steelBlue}
                buttonStyle={{ borderRadius: 10, width: 170, marginTop: 10 }}
                title='OK'
                onPress={this.doDone} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row />
    </Grid >
  )

  doDone = () => {
    this.setState({ popupNotice: { visible: false } })
    if (this.state.redirect === 1) this.props.navigation.navigate("loginScreen")
  }

  onIndicatorHide = () => {
    if (this.state.redirect === 0) {
      this.setState({
        username: {
          ...this.state.username,
          error: 'Username already in used'
        }
      })
      this.doShowNotice(this.state.redirect, 'Registration Failed')
    }
    else {
      this.doShowNotice(this.state.redirect, 'Registration Completed')
    }
  }

  doHideIndicator = () => {
    this.setState({ popupIndicator: false })
  }

  doShowIndicator = () => {
    this.setState({ popupIndicator: true })
  }

  renderIndicator = () => (
    <Grid style={{ alignItems: 'center' }}>
      <Row />
      <Row style={{ width: 180, height: 70, borderWidth: 1, borderColor: color.palette.black, padding: 10, backgroundColor: color.background, borderRadius: 10 }}>
        <Col>
          {/***** Message Panel *****/}
          <Row style={{ height: 30 }}>
            <Col style={{ alignItems: 'center' }}>
              <BarIndicator color={color.palette.pastelRed} count={8} size={30} />
            </Col>
          </Row>
          {/***** Message Panel *****/}
          <Row>
            <Col style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: color.palette.black }}>Registration</Text>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row />
    </Grid >
  )

  checkEmpty = (value, text) => {
    if (value.trim().length == 0) return `${text} cannot be empty.`
    else return ""
  }

  doValidate = () => {
    let isValid = true

    let usernameCheck = this.checkEmpty(this.state.username.value, "Username");
    if (usernameCheck.length > 0) isValid = false
    this.setState({
      username: {
        ...this.state.username,
        error: usernameCheck
      }
    })

    let passwordCheck = this.checkEmpty(this.state.password.value, "Password");
    if (passwordCheck.length > 0) isValid = false
    this.setState({
      password: {
        ...this.state.password,
        error: passwordCheck
      }
    })

    let nameCheck = this.checkEmpty(this.state.name.value, "Name");
    if (nameCheck.length > 0) isValid = false
    this.setState({
      name: {
        ...this.state.name,
        error: nameCheck
      }
    })

    return isValid
  }

  doRegister = () => {
    if (this.doValidate()) {
      this.doShowIndicator()
      this.props.dataStore.register({ username: this.state.username.value, name: this.state.name.value, password: this.state.password.value }).then((response) => {
        this.doHideIndicator()
        if (this.props.dataStore.transaction.code === 100) {
          this.setState({ redirect: 1 })
        }
        else {
          this.setState({ redirect: 0 })
        }
      })
    }
  }

  doBack = () => this.props.navigation.goBack()

  render() {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <KeyboardAwareScrollView enableOnAndroid={true} style={{ flex: 1 }} >
          <SafeAreaView style={{ height: 170, padding: 20, width: global.SCREEN_WIDTH, backgroundColor: color.palette.uglyBlue }}>
            <View style={{ height: 20 }} />
            <Image style={{ height: 180, width: undefined, resizeMode: 'contain' }} source={require('../../assets/logo.png')} />
          </SafeAreaView>
          <View style={{ height: 90 }} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 24, color: color.palette.steelBlue }}>User Registration</Text>
          </View>
          <Card title="Account Information" titleStyle={{ color: color.palette.lightGrey }} containerStyle={{ marginLeft: 30, marginRight: 30, borderRadius: 10, borderColor: 'transparent' }}>
            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
              <TextField
                autoCapitalize='none'
                autoCorrect={false}
                autoFocus={false}
                label='Name'
                title='Please enter fullname'
                value={this.state.name.value}
                error={this.state.name.error}
                onChangeText={name => this.setState({
                  name: {
                    ...this.state.name,
                    value: name,
                    error: ""
                  }
                })}
              />
              <TextField
                autoCapitalize='none'
                autoCorrect={false}
                autoFocus={false}
                maxLength={16}
                label='Username'
                title='Please enter username'
                value={this.state.username.value}
                error={this.state.username.error}
                onChangeText={username => this.setState({
                  username: {
                    ...this.state.username,
                    value: username,
                    error: ""
                  }
                })}
              />
              <TextField
                autoCapitalize='none'
                autoCorrect={false}
                autoFocus={false}
                maxLength={16}
                secureTextEntry={true}
                label='Password'
                title='Please enter your password'
                value={this.state.password.value}
                error={this.state.password.error}
                onChangeText={password => this.setState({
                  password: {
                    ...this.state.password,
                    value: password,
                    error: ""
                  }
                })}
              />
            </View>
          </Card>
          <Row style={{ height: 30 }} />
          <Row style={{ flex: 1, alignItems: 'center', height: 50 }}>
            <Col />
            <Col style={{ width: 150, alignItems: 'center' }}>
              <Button
                icon={{ color: color.palette.white, name: 'keyboard-return' }}
                buttonStyle={{ borderRadius: 10, width: 130, backgroundColor: color.palette.steelBlue }}
                title='Back'
                onPress={this.doBack} />
            </Col>
            <Col style={{ width: 150, alignItems: 'center' }}>
              <Button
                icon={{ color: color.palette.white, name: 'done' }}
                buttonStyle={{ borderRadius: 10, width: 130, backgroundColor: color.palette.steelBlue }}
                title='Register'
                onPress={this.doRegister} />
            </Col>
            <Col />
          </Row>
        </KeyboardAwareScrollView>
        {/***** Modal Views *****/}
        <View>
          <Modal isVisible={this.state.popupNotice.visible} style={{ justifyContent: 'flex-end', margin: 0 }}>
            {this.renderNotice()}
          </Modal>
        </View>
        <View>
          <Modal onModalHide={this.onIndicatorHide} isVisible={this.state.popupIndicator} animationIn='zoomIn' animationOut='zoomOut' >
            {this.renderIndicator()}
          </Modal>
        </View>
        {/***** Modal Views *****/}
      </Screen>
    )
  }
}