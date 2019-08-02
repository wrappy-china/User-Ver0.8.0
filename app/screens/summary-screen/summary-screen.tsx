import { inject, observer } from "mobx-react"
import * as React from "react"
import { SafeAreaView, StatusBar, View, ViewStyle } from "react-native"
import { Col, Grid, Row } from "react-native-easy-grid"
import { Avatar, Button } from 'react-native-elements'
import { BarIndicator } from 'react-native-indicators'
import LinearGradient from 'react-native-linear-gradient'
import Modal from "react-native-modal"
import { NavigationScreenProps } from "react-navigation"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { DataStore } from "../../models/data-store"
import { color } from "../../theme"
import { global } from "../../utils/global"

export interface SummaryScreenProps extends NavigationScreenProps<{}> {
  dataStore: DataStore
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
}

@inject("dataStore")
@observer
export class SummaryScreen extends React.Component<SummaryScreenProps, {}> {

  count = this.props.dataStore.statistic.count
  total = this.props.dataStore.statistic.total
  coupons = this.props.dataStore.statistic.coupons.slice()

  constructor(props) {
    super(props)
    this.state = {
      title: "Processing Coupons",
      completed: false,
      popupIndicator: false,
    }
  }

  goBack = () => {
    this.setState({ completed: true })
    this.props.navigation.goBack(null)
  }

  doCancel = () => {
    this.setState({ completed: true })
    this.props.navigation.navigate("dashboardScreen")
  }

  doRefresh = () => {
    this.props.dataStore.refreshBalance().then(() => {
      this.props.dataStore.listCoupons({filter: "ALL"}).then(() => {
        this.setState({completed: true})
        this.doHideIndicator()
      })
    })
  }

  doTransfer = () => {
    this.doShowIndicator("Processing Coupons")
    if (this.props.navigation.state.params.type == "CONSUMER") {
      this.props.dataStore.transferCoupon({ coupon: this.props.dataStore.statistic.coupons, recipient: this.props.navigation.state.params.id }).then(() => {
        this.doShowIndicator("Refreshing Data")
        this.doRefresh()
      })
    }
    else {
      console.log(JSON.stringify(this.props.dataStore.statistic.coupons))
      this.props.dataStore.redeemCoupon({ coupon: this.props.dataStore.statistic.coupons, store: this.props.navigation.state.params.id }).then(() => {
        this.doShowIndicator("Refreshing Data")
        this.doRefresh()
      })
    }
     
    /*setTimeout(function () {
      that.doHideIndicator()
      that.setState({ completed: true })
    }, 3000)*/
  }

  doHideIndicator = () => {
    this.setState({ popupIndicator: false })
  }

  doShowIndicator = (title) => {
    this.setState({ title: title })
    this.setState({ popupIndicator: true })
  }

  renderIndicator = () => (
    <Grid style={{ alignItems: 'center', marginBottom: 50 }}>
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

  render() {

    return (
      <Screen style={ROOT} preset="fixed">
        <StatusBar barStyle="light-content" />

        {/* Header View */}
        <LinearGradient useAngle={true} angle={180} colors={color.palette.gradientGreen} style={{ height: 250, width: global.SCREEN_WIDTH }}>
          <SafeAreaView style={{ alignItems: 'center', height: 170, padding: 20, width: global.SCREEN_WIDTH }}>
            <Header
              headerTx="summaryScreen.header"
              leftIcon="back"
              onLeftPress={this.goBack}
              titleStyle={{ color: color.palette.white }}
            />
            <Avatar rounded size="medium" source={require("./images/store.png")} avatarStyle={{ borderRadius: 25, borderColor: color.palette.paleGray, borderWidth: 2 }} />
            <Row style={{ height: 10 }} />
            <Text style={{ fontFamily: 'Montserrat', fontWeight: 'bold', fontSize: 24, color: color.palette.white }}>Restaurant Coupon</Text>
          </SafeAreaView>
        </LinearGradient>
        <Row style={{ height: 30 }} />
        <Row style={{ height: 50 }}>
          <Col style={{ alignItems: 'center' }}>
            <Text style={{ height: 26, fontSize: 16, color: color.palette.black }}>{this.props.navigation.state.params.name}</Text>
            <Text style={{ fontSize: 12, color: color.palette.lightGrey }}>Type: {this.props.navigation.state.params.type}</Text>
          </Col>
        </Row>
        <Row style={{ borderStyle: 'dotted', borderWidth: 2, borderRadius: 5, borderColor: color.palette.steelBlue, paddingVertical: 20, marginVertical: 20, marginHorizontal: 30, width: global.SCREEN_WIDTH - 60, height: 80 }}>
          <Col style={{ alignContent: 'center', alignItems: 'center' }}>
            <Row style={{ height: 14 }}>
              <Col style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: color.palette.lightGrey }}>VOUCHERS</Text>
              </Col>
              <Col style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: color.palette.lightGrey }}>AMOUNT</Text>
              </Col>
            </Row>
            <Row style={{ height: 28 }}>
              <Col style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 25, color: color.palette.pastelRed }}>{this.count}</Text>
              </Col>
              <Col style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 25, color: color.palette.pastelRed }}>{this.total}</Text>
              </Col>
            </Row>
            <Row style={{ height: 20 }} />
            <Row />
          </Col>
        </Row>
        {this.state.completed ?
          <Row style={{ marginHorizontal: 40, height: 60, backgroundColor: color.palette.white }}>
            <Row style={{ height: 10 }} />
            <Col style={{ alignItems: 'center' }}>
              <Text style={{ paddingBottom: 5, fontWeight: 'bold', fontSize: 16, color: color.palette.orangeDarker }}>SUCCESS</Text>
             {/**   <Text style={{ fontFamily: 'Montserrat', fontSize: 16, color: color.palette.black }}>{this.props.dataStore.transaction.reference} </Text> */}
              <Row style={{ height: 20 }} />
              <Button
                buttonStyle={{ borderRadius: 10, width: 130, backgroundColor: color.palette.steelBlue }}
                title='Done'
                onPress={this.doCancel} />
            </Col>
            <Row style={{ height: 20 }} />
          </Row>
          :
          <View style={{ alignItems: 'center', height: 80 }}>
            <Row style={{ height: 40 }}>
              <Col style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: color.palette.lightGrey }}>Proceed with {this.props.navigation.state.params.caption}?</Text>
              </Col>
            </Row>
            <Row style={{ alignItems: 'center', height: 50 }}>
              <Col />
              <Col style={{ width: 150, alignItems: 'center' }}>
                <Button
                  buttonStyle={{ borderRadius: 10, width: 130, backgroundColor: color.palette.steelBlue }}
                  title={this.props.navigation.state.params.caption}
                  onPress={this.doTransfer} />
              </Col>
              <Col style={{ width: 150, alignItems: 'center' }}>
                <Button
                  buttonStyle={{ borderRadius: 10, width: 130, backgroundColor: color.palette.steelBlue }}
                  title='Cancel'
                  onPress={this.doCancel} />
              </Col>
              <Col />
            </Row>
          </View>
        }

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
