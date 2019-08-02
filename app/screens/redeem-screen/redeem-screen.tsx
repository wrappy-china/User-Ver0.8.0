import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color } from "../../theme"
import { NavigationScreenProps } from "react-navigation"

export interface RedeemScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

// @inject("mobxstuff")
@observer
export class RedeemScreen extends React.Component<RedeemScreenProps, {}> {
  render () {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Text preset="header" tx="redeemScreen.header" />
      </Screen>
    )
  }
}
