import { StyleSheet } from "react-native"
import { spacing, color } from "./"
import { global } from "../utils/global"

export const style = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  framePadding: {
    padding: 10
  },
  full: {
    flex: 1
  },
  footer: {
    backgroundColor: color.palette.black 
  },
  footerContent: {
    width: global.SCREEN_WIDTH,
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],   
  },
  headerStyle: {
    borderBottomWidth: 1,
    borderColor: color.palette.lightGrey,
    marginLeft: 20,
    marginRight: 20
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: color.palette.steelBlue
  },
  underlineStyle:  {
    height: 4,
    backgroundColor: '#d1326c',
    width: 120
  }
})
