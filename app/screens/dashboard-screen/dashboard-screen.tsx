import { inject, observer } from "mobx-react"
import * as React from "react"
import { FlatList, SafeAreaView, StatusBar, TouchableOpacity, View, ViewStyle } from "react-native"
import { Col, Grid, Row } from "react-native-easy-grid"
import { Avatar, Button, Icon } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { color } from "../../theme"
import { global } from "../../utils/global"
import { DataStore } from "../../models/data-store"
import { BarIndicator } from 'react-native-indicators'
import Modal from "react-native-modal"
import RNEventSource from 'react-native-event-source'
import { showMessage } from "react-native-flash-message"

const randomColor = require('randomcolor')

export interface DashboardScreenProps extends NavigationScreenProps<{}> {
  dataStore: DataStore
}
const ROOT: ViewStyle = {
  backgroundColor: color.palette.paleGray,
}


@inject("dataStore")
@observer
export class DashboardScreen extends React.Component<DashboardScreenProps, {}> {

  eventSource
  componentDidMount() {
    this.eventSource = new RNEventSource('https://hyperledger.networkgateway.net:8500/event-hub/');

    this.eventSource.addEventListener('WRAPPY_EVENT', (event) => {
      const data = JSON.parse(event.data)
      if (data.identity === this.props.dataStore.user.id) {
        let description = ""
        if (["ISSUE", "TRANSFER", "REDEEM"].indexOf(data.type)>=0) description = "You have received new coupon(s)."
        /*** Refresh Data ****/
        this.props.dataStore.refreshBalance().then(() => {
          this.props.dataStore.listCoupons({ filter: "ALL" }).then(() => {
            showMessage({
              message: "Notification",
              description: description,
              position: "bottom",
              icon: { icon: "success", position: "left" },
              type: "danger",
              duration: 4000
            })
          })
        })
      }
    })
  }

  componentWillUnmount() {
    this.eventSource.removeAllListeners()
    this.eventSource.close()
  }

  state = {
    popupIndicator: false
  }

  doScan = () => this.props.navigation.navigate("scannerScreen")
  doShowQR = () => this.props.navigation.navigate("qrScreen")
  //doSummary = () => this.props.navigation.navigate("summaryScreen", { name: "Bobby Ishimizu", id: "FC88E0D3-F1E1-4B1B-8C4D-0B387D14B2BC", type: "CONSUMER" , caption: "Transfer" })
  doSummary = () => this.props.navigation.navigate("summaryScreen", { name: "Sushi Restaurant", id: "029C11DD-23FA-4887-9ACF-30563A7FC8CB", type: "STORE", caption: "Redeem" })
  doLogin = () => {
    this.props.dataStore.user.clear()
    this.props.navigation.navigate("loginScreen")
  }


  doRefresh = () => {
    this.doShowIndicator()
    this.props.dataStore.refreshBalance().then(() => {
      this.props.dataStore.listCoupons({ filter: "ALL" }).then(() => {
        this.doHideIndicator()
      })
    })
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
              <Text style={{ fontSize: 12, color: color.palette.black }}>Refreshing Data</Text>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row />
    </Grid >
  )

  doToggle = (index) => {
    let marker = "blank"
    if (this.props.dataStore.coupons[index].checkmark == "blank") marker = "marked"
    this.props.dataStore.coupons[index].setCheckmark(marker)
  }

  renderSeparator = ({ leadingItem, section }) => {
    return (
      <View style={{ marginHorizontal: 15, marginVertical: 5, height: 1, borderColor: color.palette.lighterGrey, borderWidth: 1, borderStyle: 'dotted' }} />
    )
  }

  renderItem = ({ item, index }) => {
    return (
      (
        <View style={{ alignContent: 'center', paddingHorizontal: 20, paddingTop: 5 }}>
          <Grid>
            <Row style={{ height: 70 }}>
              <Col style={{ width: 40, alignSelf: 'center', alignItems: 'center' }}><Avatar rounded size="small" title={item.initial} titleStyle={{ fontSize: 14 }} overlayContainerStyle={{ backgroundColor: item.color }} /></Col>
              <Col style={{ width: 10 }} />
              <Col style={{ alignSelf: 'center' }}>
                <Row style={{ height: 2 }} />
                <Row style={{ height: 14 }}>
                  <Col style={{ width: 160 }}>
                    <Text style={{ fontSize: 10, color: color.palette.lightGrey }}>COUPON</Text>
                  </Col>
                  <Col style={{ width: 80 }}>
                    <Text style={{ fontSize: 10, color: color.palette.lightGrey }}>AMOUNT</Text>
                  </Col>
                </Row>
                <Row style={{ height: 20 }}>
                  <Col style={{ width: 160 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: color.palette.slateGrey }}>{item.name}</Text>
                  </Col>
                  <Col style={{ width: 80 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: color.palette.slateGrey }}>{item.value}</Text>
                  </Col>
                </Row>
                <Row style={{ height: 2 }} />
                <Row style={{ height: 14 }}>
                  <Col style={{ width: 160 }}>
                    <Text style={{ fontSize: 10, color: color.palette.lightGrey }}>EXPIRY</Text>
                  </Col>
                  <Col style={{ width: 80 }}>
                    <Text style={{ fontSize: 10, color: color.palette.lightGrey }}>STATUS</Text>
                  </Col>
                </Row>
                <Row style={{ height: 22 }}>
                  <Col style={{ width: 160 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: color.palette.slateGrey }}>{item.expiry}</Text>
                  </Col>
                  <Col style={{ width: 80 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: color.palette.slateGrey }}>{item.status}</Text>
                  </Col>
                </Row>
                <Row />
              </Col>
              <Col style={{ alignSelf: 'center', alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this.doToggle(index)} >
                  <Icon type='material-community' name={`checkbox-${item.checkmark}-circle-outline`} color={color.palette.lightGrey} size={34} />
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        </View>
      )
    )
  }

  keyExtractor = (item, index) => item.id

  renderEmpty = () => {
    return (
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 14, color: color.palette.lightGrey }}>No coupons available</Text>
      </View>
    )
  }

  render() {
    return (
      <Screen style={ROOT} preset="fixed">
        <StatusBar barStyle="light-content" />

        {/* Header View */}
        <LinearGradient useAngle={true} angle={135} colors={color.palette.gradientGreen} style={{ height: 250, width: global.SCREEN_WIDTH }}>
          <SafeAreaView style={{ alignItems: 'flex-start' }}>
            <Grid style={{ padding: 10, width: global.SCREEN_WIDTH }}>
              <Row style={{ height: 50 }}>
                <Col style={{ width: 60 }}><Avatar rounded size="medium" source={require("../../assets/photo/alex.jpg")} avatarStyle={{ borderRadius: 25, borderColor: color.palette.paleGray, borderWidth: 2 }} /></Col>
                <Col style={{ background: color.palette.white, alignSelf: 'center' }}>
                  <Row style={{ height: 8 }} />
                  <Row><Text style={{ fontWeight: 'bold', fontSize: 16, color: color.palette.white }}>{this.props.dataStore.user.name}</Text></Row>
                  <Row style={{ height: 2 }} />
                  <Row><Text style={{ fontSize: 12, color: color.palette.white }}>+639173223244</Text></Row>
                </Col>
                <Col style={{ width: 35 }}>
                  <Row style={{ height: 8 }} />
                  <TouchableOpacity onPress={() => this.doRefresh()} >
                    <Icon size={28} type='font-awesome' name='connectdevelop' color={color.palette.white} containerStyle={{ alignSelf: 'flex-end' }} />
                  </TouchableOpacity>
                </Col>
                <Col style={{ width: 35 }}>
                  <Row style={{ height: 8 }} />
                  <TouchableOpacity onPress={() => this.doShowQR()} >
                    <Icon size={30} type='font-awesome' name='qrcode' color={color.palette.white} containerStyle={{ alignSelf: 'flex-end' }} />
                  </TouchableOpacity>
                </Col>
                <Col style={{ width: 35 }}>
                  <Row style={{ height: 8 }} />
                  <TouchableOpacity onPress={() => this.doLogin()} >
                    <Icon size={30} name='lock-outline' color={color.palette.white} containerStyle={{ alignSelf: 'flex-end' }} />
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row style={{ height: 20 }} />
              <Row style={{ height: 30 }}>
                <Col style={{ alignSelf: 'center', alignItems: 'center' }}><Text style={{ fontFamily: 'Montserrat', fontSize: 28, color: color.palette.white }}>{this.props.dataStore.user.active}</Text></Col>
              </Row>
              <Row style={{ height: 20 }}>
                <Col style={{ alignSelf: 'center', alignItems: 'center' }}><Text style={{ fontFamily: 'Montserrat', fontSize: 11, color: color.palette.mutedGray }}>BALANCE</Text></Col>
              </Row>
              <Row style={{ height: 30 }} />
              <Row style={{ height: 18 }}>
                <Col style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, color: color.palette.white }}>{this.props.dataStore.user.input}</Text>
                  <Row style={{ height: 5 }} />
                  <Text style={{ fontSize: 12, color: color.palette.mutedGray }}>Earned</Text>
                </Col>
                <Col style={{ backgroundColor: color.palette.lighterGrey, width: 1, height: 25 }} />
                <Col style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, color: color.palette.white }}>{this.props.dataStore.user.inactive}</Text>
                  <Row style={{ height: 5 }} />
                  <Text style={{ fontSize: 12, color: color.palette.mutedGray }}>Inactive</Text>
                </Col>
                <Col style={{ backgroundColor: color.palette.lighterGrey, width: 1, height: 25 }} />
                <Col style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, color: color.palette.white }}>{this.props.dataStore.user.output}</Text>
                  <Row style={{ height: 5 }} />
                  <Text style={{ fontSize: 12, color: color.palette.mutedGray }}>Transferred</Text>
                </Col>
              </Row>
            </Grid>
          </SafeAreaView>
        </LinearGradient>

        {/* Body View */}
        <View style={{ flex: 1, width: global.SCREEN_WIDTH, backgroundColor: color.palette.paleGray }}>
          <Row style={{ paddingTop: 20, height: 50, paddingHorizontal: 20 }}>
            <Col >
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: color.palette.lightGrey }}>Active Coupons</Text>
            </Col>
          </Row>
          <View style={{ paddingHorizontal: 5 }} />
          <FlatList
            style={{ paddingTop: 0 }}
            data={this.props.dataStore.coupons}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            ListEmptyComponent={this.renderEmpty}
          />
        </View>

        {this.props.dataStore.statistic.total > 0 &&
          <SafeAreaView style={{ height: 85, backgroundColor: color.palette.white }}>
            <View style={{ height: 1, backgroundColor: color.palette.lightGrey }} />
            <Row style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, width: global.SCREEN_WIDTH }}>
              <Col style={{ flex: 2, paddingLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: color.palette.steelBlue }}>Total Amount:  {this.props.dataStore.statistic.total}</Text>
              </Col>
              <Col style={{ flex: 1, alignItems: 'flex-end' }}>
                <Button onPress={() => this.doScan()} title="Transfer" buttonStyle={{ borderColor: color.palette.uglyBlue, borderWidth: 1, backgroundColor: color.palette.dullTeal, width: 80, height: 30, paddingHorizontal: 10, paddingVertical: 5 }} titleStyle={{ fontWeight: 'bold', fontSize: 14 }} />
              </Col>
            </Row>
          </SafeAreaView>
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
