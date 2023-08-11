import React from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import { Bar } from 'react-native-progress';
import { bgExclamation } from '../../../Assets/app/shared';
import CText from '../../CText';
import CButton from '../../CButton';
import { bgOrbitLoad } from '../../../Assets/app/wifi-setup';
import CColors from '../../CColors';

function Update({ appUpdateStatus, isForceUpdate, onPress, isLoading }) {
  const styles = {
    progressBar: {
      width: '65%',
      margin: 10
    },
    mainContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    mainContainerProgress: {
      position: 'absolute',
      width: '100%',
      height: 20,
      bottom: 0
    },
    loaderContainer: {
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 35,
      backgroundColor: '#fff',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowOpacity: 0.15,
      shadowRadius: 5
    }
  };

  if (isLoading) {
    return (
      <View style={styles.mainContainer} >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={50} color={CColors.tselRed} />
        </View>
      </View>
    );
  } else if (isForceUpdate) {
    return (
      <View style={styles.mainContainer} >
        <View
          style={{
            height: 348,
            elevation: 10,
            backgroundColor: '#fff',
            paddingTop: 10,
            width: 342,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            zIndex: -1
          }}
        >
          <Image
            source={bgExclamation}
            style={{
              width: 100,
              height: 100,
              marginBottom: 24
            }}
          />
          <CText
            bold
            style={{
              fontSize: 18,
              color: '#1a1a1a',
              marginBottom: 16
            }}
          >
            Perbarui Aplikasi MyOrbit Anda
          </CText>
          <CText
            style={{
              fontSize: 14,
              margin: 5,
              textAlign: 'center'
            }}
          >
            Segera perbarui aplikasi MyOrbit dan nikmati fitur-fitur Telkomsel Orbit
            selengkapnya!
          </CText>
          <CButton
            label="Perbarui"
            onPress={onPress}
            styleWrapper={{
              backgroundColor: '#ff4c47',
              height: 40,
              width: 136,
              borderRadius: 16
            }}
            txtColor="#fff"
            bold
          />
        </View>
      </View>
    );
  } else if (appUpdateStatus?.isUpdate) {
    return (
      <View style={styles.mainContainerProgress}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Image
              resizeMode="contain"
              source={bgOrbitLoad}
              style={{
                marginLeft: 10,
                width: 20,
                height: 20
              }}
            />
            <View style={styles.progressBar}>
              <Bar
                color="#ff4c47"
                unfilledColor="#e6e6e6"
                borderColor="#e6e6e6"
                borderRadius={5}
                progress={appUpdateStatus.progressDownload}
                width={null}
                height={10}
              />
            </View>
            <CText
              style={{
                textAlign: 'center',
                fontSize: 13
              }}
            >
              Updating {appUpdateStatus.progressDownload % 2 == 0 ? '...' : '..'}
            </CText>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }

}

export default Update;
