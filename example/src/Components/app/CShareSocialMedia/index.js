// Core
import React, { Component } from 'react';
import {
  Image,
  Modal,
  View,
  TouchableOpacity,
  Platform,
  Clipboard,
  Linking
} from 'react-native';
import Share from 'react-native-share';

// Assets
import {
  iconCloseRound,
  iconFacebook,
  iconTwitter,
  iconInstagram,
  iconWhatsapp,
  iconLink,
  iconDots
} from '../../../Assets/app/shared';

import {
  storageAskForUserPermissions,
  ToastHandler
} from '../../../Helper/MobileHelper';
import { Colors, Fonts } from '../CThemes';

// Components
import CText from '../CText';
import { store } from '../../../Config/Store';
import { baseUrl } from '../../../Config/MainConfig';

export default class CShareSocialMedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUri: null,
      listSocialMedia: [],
      disableButton: false
    };
  }

  componentDidMount() {
    this._checkInstalledApps();
  }

  _checkInstalledApps = async () => {
    try {
      let instagram = true;
      let facebook = true;
      let twitter = true;
      let whatsapp = true;

      if (Platform.OS === 'ios') {
        instagram = await Linking.canOpenURL('instagram://');
        facebook = await Linking.canOpenURL('fb://');
        twitter = await Linking.canOpenURL('twitter://');
        whatsapp = await Linking.canOpenURL('whatsapp://');
      } else {
        instagram = await Share.isPackageInstalled('com.instagram.android');
        facebook = await Share.isPackageInstalled('com.facebook.katana');
        twitter = await Share.isPackageInstalled('com.twitter.android');
        whatsapp = await Share.isPackageInstalled('com.whatsapp');
      }

      this.setState({
        listSocialMedia: [
          {
            id: 'facebook',
            name: 'Facebook',
            icon: iconFacebook,
            installed: Platform.OS === 'ios' ? facebook : facebook.isInstalled
          },
          {
            id: 'twitter',
            name: 'Twitter',
            icon: iconTwitter,
            installed: Platform.OS === 'ios' ? twitter : twitter.isInstalled
          },
          {
            id: 'instagram',
            name: 'Instagram',
            icon: iconInstagram,
            installed: Platform.OS === 'ios' ? instagram : instagram.isInstalled
          },
          {
            id: 'whatsapp',
            name: 'Whatsapp',
            icon: iconWhatsapp,
            installed: Platform.OS === 'ios' ? false : whatsapp.isInstalled
          },
          {
            id: 'copy',
            name: 'Copy Link',
            icon: iconLink,
            installed: true
          },
          {
            id: 'other',
            name: 'Other',
            icon: iconDots,
            installed: true
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  };

  _handleButtonShare = async (id) => {
    try {
      this.setState({ disableButton: true, isLoading: true });

      const { imageUri } = this.props;
      const { memberData, language } = store.getState();
      const memberName = memberData?.data?.data?.attributes?.fullname || 'Penjelajah';
      const referralCode = memberData?.data?.data?.attributes?.referralCode;

      let shareOptions = {
        message: language === 'id' 
          ? `${memberName} telah bergabung dengan Telkomsel Orbit, sekarang giliranmu! Gabung dan dapatkan tambahan paket data 5GB dengan klik link ini ${baseUrl}id?r=${referralCode} atau gunakan kode "${referralCode}" pada saat pembayaran.`
          : `${memberName} has joined Telkomsel Orbit, now it's your turn! Join and get an additional 5GB data package by clicking this link ${baseUrl}id?r=${referralCode} or using the code "${referralCode}" in payments.`
      };
      
      switch (id) {
        case 'instagram':
          await storageAskForUserPermissions();

          shareOptions = {
            title: 'Share image to instastory',
            method: Share.InstagramStories.SHARE_BACKGROUND_IMAGE,
            backgroundImage: imageUri,
            social: Share.Social.INSTAGRAM_STORIES
          };
          break;

        case 'facebook':
          shareOptions = {
            ...shareOptions,
            title: 'Share to Facebook',
            social: Share.Social.FACEBOOK
          };
          break;

        case 'twitter':
          shareOptions = {
            ...shareOptions,
            title: 'Share to Twitter',
            social: Share.Social.TWITTER
          };
          break;

        case 'whatsapp':
          shareOptions = {
            ...shareOptions,
            title: 'Share to Whatsapp',
            social: Share.Social.WHATSAPP
          };
          break;
        default:
          break;
      }
      // console.log('shareOptions', shareOptions);

      const shareSingle = ['facebook', 'instagram', 'twitter', 'whatsapp'];

      if(shareSingle.includes(id)) {
        const shareResponse = await Share.shareSingle(shareOptions);
        console.log('shareResponse =>', shareResponse);
      } else if(id === 'copy') {
        await Clipboard.setString(shareOptions.message);
        ToastHandler('Copied to Clipboard');
      } else {
        await Share.open(shareOptions);
      }

      this.setState({ disableButton: false, isLoading: false });
    } catch (error) {
      console.log('error@_handleButtonShare =>', error);
      this.props.onSuccessShare();
      this.setState({ disableButton: false, isLoading: false });
      error?.error && ToastHandler(error.error);
    }
  };

  render() {
    const { visible, onClose } = this.props;
    const { listSocialMedia, disableButton } = this.state;

    return (
      <Modal
        animationType="fade"
        visible={visible}
        transparent
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 26, 65, 0.7)' }}>
          <View style={{
            marginHorizontal: 0,
            backgroundColor: Colors.white,
            borderRadius: 0,
            borderTopStartRadius: 20,
            borderTopEndRadius: 20
          }}>

            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <CText size={26} lineHeight={32} style={{ fontFamily: Fonts.telkomselBatikBold, color: Colors.tselDarkBlue }}>Share options</CText>

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 16,
                  top: 24
                }}
                onPress={() => onClose()}
              >
                <Image
                  source={iconCloseRound}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                padding: 25,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start'
              }}
            >
              {listSocialMedia.map((data, idx) => {
                if (data.installed) {
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={{ width: '33.3333%', alignItems: 'center', marginBottom: 20 }}
                      onPress={() => this._handleButtonShare(data.id)}
                      disable={disableButton}
                    >
                      <Image
                        resizeMode='contain'
                        source={data.icon}
                        style={{ width: 24, height: 24, marginBottom: 16 }}
                      />

                      <CText size={16} bold style={{ textTransform: 'capitalize' }}>{data.name}</CText>
                    </TouchableOpacity>
                  );
                } else {
                  return null;
                }
              })}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
