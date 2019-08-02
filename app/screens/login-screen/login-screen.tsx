import * as React from "react"
import { inject, observer } from "mobx-react"
import { ViewStyle, View, SafeAreaView, Image } from "react-native"
import { Card, Button } from 'react-native-elements'
import { Text } from "../../components/text"
import { TextField } from 'react-native-tecnovix-material-textfield'
import { Screen } from "../../components/screen"
import { color } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { global } from "../../utils/global"
import { BarIndicator } from 'react-native-indicators'
import { Col, Row, Grid } from "react-native-easy-grid"
import Modal from "react-native-modal"
import { DataStore } from "../../models/data-store"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export interface LoginScreenProps extends NavigationScreenProps<{}> {
  dataStore: DataStore
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
}

@inject("dataStore")
@observer
export class LoginScreen extends React.Component<LoginScreenProps, {}> {

  constructor(props) {
    super(props)
    this.state = {
      title: "Authenticating",
      popupIndicator: false,
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
              <Text style={{ fontSize: 12, color: color.palette.black }}>{this.state.title}</Text>
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
    return isValid
  }

  doLogin = () => {
    if (this.doValidate()) {
      this.doShowIndicator()
      this.props.dataStore.authenticate({ username: this.state.username.value, password: this.state.password.value }).then((response) => {
        if (this.props.dataStore.transaction.code === 100) {
          this.setState({ title: "Loading Profile" })
          this.props.dataStore.listCoupons({ filter: "ALL" }).then(() => {
            this.doHideIndicator()
            this.props.navigation.navigate("dashboardScreen")
          })
        }
        else {
          this.doHideIndicator()
          this.setState({
            username: {
              ...this.state.username,
              error: "Account does not exist"
            }
          })
        }
      })
    }
  }

  doRegister = () => this.props.navigation.navigate("registerScreen")

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
            <Text style={{ fontWeight: 'bold', fontSize: 24, color: color.palette.steelBlue }}>Restaurant Coupon</Text>
          </View>
          <Card title="Please Signin" titleStyle={{ color: color.palette.lightGrey }} containerStyle={{ marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 10, borderColor: 'transparent' }}>
            <View style={{ paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
              <TextField
                ref="username"
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
                ref="password"
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
                icon={{ color: color.palette.white, name: 'lock-open' }}
                buttonStyle={{ borderRadius: 10, width: 130, backgroundColor: color.palette.steelBlue }}
                title='Login'
                onPress={this.doLogin} />
            </Col>
            <Col style={{ width: 150, alignItems: 'center' }}>
              <Button
                icon={{ color: color.palette.white, name: 'control-point' }}
                buttonStyle={{ borderRadius: 10, width: 130, backgroundColor: color.palette.steelBlue }}
                title='Register'
                onPress={this.doRegister} />
            </Col>
            <Col />
          </Row>
        </KeyboardAwareScrollView>
        <View>
          <SafeAreaView style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: color.palette.lightGrey, marginTop: 10 }}>Release 1.0 Beta</Text>
          </SafeAreaView>
        </View>
        {/***** Modal Views *****/}
        <View>
          <Modal isVisible={this.state.popupIndicator} animationIn='zoomIn' animationOut='zoomOut' >
            {this.renderIndicator()}
          </Modal>
        </View>
        {/***** Modal Views *****/}
      </Screen>
    )
  }
}
