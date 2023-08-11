import React from 'react'
import {
    View,
    Image
} from 'react-native'
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

// Assets
import {
    bgExclamation
} from '../Assets/app/shared'

// Helper
import { dpi } from '../Helper/HelperGlobal'

// Components
import CColors from './CColors'
import CButton from './CButton'
import CText from './CText'

const CHaveNoQuota = ({
    onRefresh,
}) => {
    const reduxState = useSelector(state => state);
    const isMobile = reduxState.widthListener < 768;
    const { t } = useTranslation()
    const dynamicStyles = isMobile ? styleMobile : styleDesktop;

    return (
        <View style={dynamicStyles.container}>
            <View style={dynamicStyles.contentContainer}>
                <Image source={bgExclamation} style={{
                    width: dpi(25),
                    height: dpi(25),
                    marginRight: dpi(8)
                }} />
                <View style={{ maxWidth: "70%" }}>
                    <CText style={{ fontSize: dpi(8), color: CColors.black, marginBottom: dpi(6) }}>Anda Tidak Memiliki Paket Data</CText>
                    <CText style={{ fontSize: dpi(7) }}>Maaf, saat ini Anda tidak memiliki paket data. Silahkan klik Beli Paket.</CText>
                </View>
            </View>
            <CButton
                onPress={() => {
                    onRefresh()
                }}
                bold={true}
                styleProp={{ borderRadius: 50, borderWidth: 1, borderColor: CColors.black }}
                background={CColors.white}
                label={"Beli Paket"}
                txtColor={CColors.black}
            />
        </View >
    )
}

const styleDesktop = {
    container: {
        paddingBottom: dpi(3),
        width: "100%",
        height: "100%",
        justifyContent: 'space-between'
    },
    contentContainer: {
        width: "100%",
        marginTop: dpi(12),
        flexDirection: 'row',
        justifyContent: "center"
    }
};

const styleMobile = {
    container: {
        paddingBottom: dpi(3),
        width: "100%",
        height: "100%",
        justifyContent: 'space-between'
    },
    contentContainer: {
        width: "100%",
        marginTop: dpi(12),
        marginBottom: dpi(12),
        flexDirection: 'row',
        justifyContent: "center"
    }
};

export default CHaveNoQuota