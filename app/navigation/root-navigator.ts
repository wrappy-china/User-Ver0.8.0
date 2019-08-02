import { createStackNavigator } from "react-navigation"
import { QrScreen } from "../screens/qr-screen/qr-screen"
import { SummaryScreen } from "../screens/summary-screen/summary-screen"
import { RegisterScreen } from "../screens/register-screen/register-screen"
import { LoginScreen } from "../screens/login-screen/login-screen"
import { ScannerScreen } from "../screens/scanner-screen/scanner-screen"
import { RedeemScreen } from "../screens/redeem-screen/redeem-screen"
import { DashboardScreen } from "../screens/dashboard-screen/dashboard-screen"

export const RootNavigator = createStackNavigator(
  {
    qrScreen: { screen: QrScreen },
    summaryScreen: { screen: SummaryScreen },
    registerScreen: { screen: RegisterScreen },
    loginScreen: { screen: LoginScreen },
    scannerScreen: { screen: ScannerScreen },
    redeemScreen: { screen: RedeemScreen },
    dashboardScreen: { screen: DashboardScreen }
  },
  {
    initialRouteName: "dashboardScreen",
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
  },
)
