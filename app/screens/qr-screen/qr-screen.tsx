import { inject, observer } from "mobx-react"
import * as React from "react"
import { SafeAreaView, StatusBar, ViewStyle } from "react-native"
import { Col, Row } from "react-native-easy-grid"
import { NavigationScreenProps } from "react-navigation"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { color } from "../../theme"
import { global } from "../../utils/global"
import QRCode from 'react-native-qrcode'
import { encrypt } from 'react-native-simple-encryption'
import { Avatar } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { DataStore } from "../../models/data-store"

export interface QrScreenProps extends NavigationScreenProps<{}> {
  dataStore: DataStore
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
}


@inject("dataStore")
@observer
export class QrScreen extends React.Component<QrScreenProps, {}> {

  qrData = this.props.dataStore.user.name + "+++" + this.props.dataStore.user.id + "+++" + this.props.dataStore.user.type
  hash = encrypt('N0t4u2kn0W', this.qrData)

  goBack = () => {
    this.props.navigation.goBack(null)
  }

  render() {
    return (
      <Screen style={ROOT} preset="fixed">
        <StatusBar barStyle="light-content" />

        {/* Header View */}
        <LinearGradient useAngle={true} angle={180} colors={color.palette.gradientGreen} style={{ height: 250, width: global.SCREEN_WIDTH }}>
          <SafeAreaView style={{ alignItems: 'center', height: 170, padding: 20, width: global.SCREEN_WIDTH }}>
            <Header
              headerTx="qrScreen.header"
              leftIcon="back"
              onLeftPress={this.goBack}
              titleStyle={{ color: color.palette.white }}
            />
            <Avatar rounded size="large" source={require("../../assets/photo/alex.jpg")} avatarStyle={{ borderRadius: 35, borderColor: color.palette.paleGray, borderWidth: 2 }} />
            <Row style={{ height: 10 }} />
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: color.palette.white }}>{this.props.dataStore.user.name}</Text>
          </SafeAreaView>
        </LinearGradient>

        <Row style={{ flex: 1, marginTop: 10 }}>
          <Col style={{ marginLeft: 10, marginRight: 10, alignItems: 'center' }}>
            <Row />
            <Text style={{ height: 26, fontSize: 16, color: color.palette.lightGrey }}>Transaction Hash</Text>
            <Text style={{ height: 16, fontSize: 10, color: color.palette.black }}>{this.hash}</Text>
            <Row style={{ height: 30 }} />
            <Row style={{ height: 240 }}>
              <Col />
              <Col style={{ width: 240, borderColor: color.palette.black, borderRadius: 10, borderWidth: 1, padding: 20 }}>
                <QRCode
                  value={this.hash}
                  size={200}
                  bgColor='black'
                  fgColor='white' />
              </Col>
              <Col />
            </Row>
            <Row style={{ height: 30 }} />
            <Row style={{ height: 20 }}>
              <Text style={{ fontSize: 18, color: color.palette.black }}>Show this QR Code</Text>
            </Row>
            <Row style={{ height: 20 }}>
              <Text style={{ fontSize: 16, color: color.palette.black }}>to receive coupon</Text>
            </Row>
            <Row style={{ height: 100 }} />
            <Row />
          </Col>
        </Row>

      </Screen>
    )
  }
}
