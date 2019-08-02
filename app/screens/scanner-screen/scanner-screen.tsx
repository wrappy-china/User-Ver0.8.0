import * as React from "react"
import { observer } from "mobx-react"
import { StatusBar, ViewStyle, SafeAreaView, TouchableOpacity, Image, View } from "react-native"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { style, color } from "../../theme"
import { global } from "../../utils/global"
import { NavigationScreenProps } from "react-navigation"
import QRCodeScanner from 'react-native-qrcode-scanner'
import Icon from "react-native-vector-icons/Ionicons"
import * as Animatable from "react-native-animatable"
import { decrypt } from 'react-native-simple-encryption'

export interface ScannerScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
}

const rectDimensions = global.SCREEN_WIDTH * 0.65
const rectBorderWidth = global.SCREEN_WIDTH * 0.005
const rectBorderColor = "transparent"

const scanBarWidth = global.SCREEN_WIDTH * 0.46
const scanBarHeight = global.SCREEN_WIDTH * 0.0025
const scanBarColor = "red"

const iconScanColor = color.palette.white

const styles = {
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  scanBar: {
    width: scanBarWidth - 5,
    height: scanBarHeight + 5,
    backgroundColor: scanBarColor,
    marginTop: 30,
  }
}

// @inject("mobxstuff")
@observer
export class ScannerScreen extends React.Component<ScannerScreenProps, {}> {

  doBack = () => this.props.navigation.goBack()

  onSuccess = (e) => {
    const data = decrypt('N0t4u2kn0W', e.data)
    const res = data.split("+++")
     let caption = "Transfer"
    if (res[2] == "STORE") caption = "Redeem"
    if (res.length == 3) this.props.navigation.navigate("summaryScreen", { name: res[0], id: res[1], type: res[2], caption: caption })
    else {
      alert("Invalid QR Code")
      this.props.navigation.goBack(null)
    }
  }

  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: global.SCREEN_WIDTH * -0.18
      },
      to: {
        [translationType]: fromValue
      }
    }
  }

  render() {
    return (
      <Screen preset="fixed">
        <StatusBar barStyle="light-content" />
        <QRCodeScanner
          showMarker={true}
          onRead={this.onSuccess}
          cameraStyle={{ flex: 1 }}
          customMarker={
            <View style={{ alignItems: 'center' }}>
              <SafeAreaView>
                <View style={style.footerContent}>
                  <Text style={{ paddingBottom: 50, fontWeight: 'bold', fontSize: 24, color: color.palette.white }}>Restaurant Coupon</Text>
                </View>
              </SafeAreaView>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22, color: color.palette.white }}>Scanning</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: color.palette.white }}>Recipient QR Code</Text>
              </View>
              <View style={styles.rectangle}>
                <Icon
                  name="ios-qr-scanner"
                  size={global.SCREEN_WIDTH * 0.73}
                  color={iconScanColor}
                />
                <Animatable.View
                  style={styles.scanBar}
                  direction="alternate-reverse"
                  iterationCount="infinite"
                  duration={1700}
                  easing="linear"
                  animation={this.makeSlideOutTranslation(
                    "translateY",
                    global.SCREEN_WIDTH * -0.54
                  )}
                />
              </View>
              <SafeAreaView>
                <View style={style.footerContent}>
                  <TouchableOpacity onPress={() => this.doBack()} >
                    <Image style={{ width: 60, height: 60 }} source={require('./images/back.png')} />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </View>
          }
        />
      </Screen>
    )
  }
}
