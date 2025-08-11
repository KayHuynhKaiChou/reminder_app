import { StyleSheet } from 'react-native';
import { ThemeVariables } from '../../@types/theme';

export default function ({}: ThemeVariables) {
  return StyleSheet.create({
    /* Column Layouts */
    col: {
      flexDirection: 'column',
    },
    colReverse: {
      flexDirection: 'column-reverse',
    },
    colCenter: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    colVCenter: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    colHCenter: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    /* Row Layouts */
    row: {
      flexDirection: 'row',
    },
    rowWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    rowReverse: {
      flexDirection: 'row-reverse',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowVSpaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rowVCenter: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    rowHCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowHStart: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    rowHEnd: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    rowVEnd: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    rowVStart: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    /* Default Layouts */
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    alignItemsCenter: {
      alignItems: 'center',
    },
    alignItemsStart: {
      alignItems: 'flex-start',
    },
    alignItemsStretch: {
      alignItems: 'stretch',
    },
    alignItemsEnd: {
      alignItems: 'flex-end',
    },
    justifyContentCenter: {
      justifyContent: 'center',
    },
    justifyContentAround: {
      justifyContent: 'space-around',
    },
    justifyContentBetween: {
      justifyContent: 'space-between',
    },
    justifyContentEnd: {
      justifyContent: 'flex-end',
    },
    scrollSpaceAround: {
      flexGrow: 1,
      justifyContent: 'space-around',
    },
    scrollSpaceBetween: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    selfStretch: {
      alignSelf: 'stretch',
    },
    /* Sizes Layouts */
    fill: {
      flex: 1,
    },
    fullSize: {
      height: '100%',
      width: '100%',
    },
    fullWidth: {
      width: '100%',
    },
    halfWidth: {
      width: '50%',
    },
    fullHeight: {
      height: '100%',
    },
    /* Operation Layout */
    mirror: {
      transform: [{ scaleX: -1 }],
    },
    rotate90: {
      transform: [{ rotate: '90deg' }],
    },
    rotate90Inverse: {
      transform: [{ rotate: '-90deg' }],
    },
    // Position
    relative: {
      position: 'relative',
    },
    absolute: {
      position: 'absolute',
    },
    top0: {
      top: 0,
    },
    bottom0: {
      bottom: 0,
    },
    left0: {
      left: 0,
    },
    right0: {
      right: 0,
    },
    //others
    paddingLayout: {
      padding: 10,
    },
    gap: {
      gap: 20,
    },
    gapSmall: {
      gap: 10,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10
    },
    backdrop: {
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    backdropDark: {
      backgroundColor: 'rgba(162, 162, 162, 0.4)'
    },
    imageDetail:{
      borderRadius: 10,
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: 'rgba(162, 162, 162, 0.4)'
    }
  });
}
