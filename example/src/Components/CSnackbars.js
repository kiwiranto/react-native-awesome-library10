// Core
import * as React from 'react'
import { Image, TouchableOpacity } from 'react-native'

// Helper
import { dpi } from '../Helper/HelperGlobal'

// Assets
import { iconTimerNikNok, iconCloseNikNok } from '../Assets/app/register-sim-card'

// Components
import CColors from './CColors'
import CTextApp from './CTextApp'
import CFlexRow from './CFlexRow'


/**
 * Orbit snackbars component.
 * @example
 * <CSnackbars visible={true} />
 * <CSnackbars visible={true} 
 *  content='ulala'
 *  onClose={() => console.log('close button triggered')}
 * />
 * @param {any} props
 * @param {string} content - snackbars message.
 * @param {boolean} visible - snackbars open.
 * @param {function} onClose - triggered when close button pressed.
 */
const CSnackbars = ({
  content = 'konten',
  visible = false,
  onClose = () => { }
}) => {

  const snackbarsContentStyle = {
    width: '90%',
    zIndex: 2,
    backgroundColor: CColors.red150,
    borderRadius: dpi(8)
  }

  return visible ? (
    <CFlexRow top={dpi(9)} justify="center" style={{ position: 'absolute' }}>
      <CFlexRow paddingVertical={dpi(4)} justify="center" align="center" style={snackbarsContentStyle}>
        <Image source={iconTimerNikNok} />
        <CTextApp right={dpi(4)} size={dpi(7)} color={CColors.white}>{content}</CTextApp>
        <TouchableOpacity onPress={() => onClose()}>
          <Image source={iconCloseNikNok} />
        </TouchableOpacity>
      </CFlexRow>
    </CFlexRow>
  ) : null
}

export default CSnackbars
