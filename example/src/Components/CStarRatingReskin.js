// Core
import * as React from 'react'
import { Image, TouchableOpacity } from 'react-native'

// Helper
import { dpi } from '../Helper/HelperGlobal'

// Assets
import { iconEmptyStarReskin, iconFilledStarReskin} from '../Assets/app/shared'

// Components
import CFlexRow from './CFlexRow'


/**
 * Orbit star rating component.
 * @example
 * <CStarRating />
 * <CStarRating value={5} onPress={(val) => console.log(val)} />
 * @param {any} props
 * @param {number} value - star value.
 * @param {function} onPress - triggered when star pressed.
 * @param {number} top - margin top.
 * @param {number} bottom - margin bottom.
 */
const CStarRatingReskin = ({
  value = 0,
  onPress = () => { },
  top = 0,
  bottom = 0
}) => {

  return (
    <CFlexRow top={top} bottom={bottom} justify="space-between" width={dpi(100)}>
      <TouchableOpacity
        testID={'btn-star-1'}
        accessibilityLabel={'btn-star-1'}
        onPress={() => onPress(1)}
      >
        <Image source={value >= 1 ? iconFilledStarReskin : iconEmptyStarReskin} resizeMode="contain" style={{ width: dpi(16), height: dpi(16) }} />
      </TouchableOpacity>
      <TouchableOpacity
        testID={'btn-star-2'}
        accessibilityLabel={'btn-star-2'}
        onPress={() => onPress(2)}>
        <Image source={value >= 2 ? iconFilledStarReskin : iconEmptyStarReskin} resizeMode="contain" style={{ width: dpi(16), height: dpi(16) }} />
      </TouchableOpacity>
      <TouchableOpacity
        testID={'btn-star-3'}
        accessibilityLabel={'btn-star-3'}
        onPress={() => onPress(3)}>
        <Image source={value >= 3 ? iconFilledStarReskin : iconEmptyStarReskin} resizeMode="contain" style={{ width: dpi(16), height: dpi(16) }} />
      </TouchableOpacity>
      <TouchableOpacity 
      testID={'btn-star-4'}
      accessibilityLabel={'btn-star-4'}
      onPress={() => onPress(4)}>
        <Image source={value >= 4 ? iconFilledStarReskin : iconEmptyStarReskin} resizeMode="contain" style={{ width: dpi(16), height: dpi(16) }} />
      </TouchableOpacity>
      <TouchableOpacity
        testID={'btn-star-5'}
        accessibilityLabel={'btn-star-5'}
        onPress={() => onPress(5)}>
        <Image source={value >= 5 ? iconFilledStarReskin : iconEmptyStarReskin} resizeMode="contain" style={{ width: dpi(16), height: dpi(16) }} />
      </TouchableOpacity>
    </CFlexRow>
  )
}

export default CStarRatingReskin;
