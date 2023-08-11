import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

class CPopUp extends Component {
   render() {
      const { widthListener, popUpData, isLoading } = this.props;
      const isMobile = widthListener < 768;
      const dynamicStyles = isMobile ? styleMobile : styleDesktop;

      return (
         <View style={dynamicStyles.containerMask}>
            <View style={dynamicStyles.container}>
               <Image
                  source={popUpData.icon}
                  resizeMode={'contain'}
                  style={dynamicStyles.icon}
               />

               <Text style={dynamicStyles.title}>
                  {popUpData.title}
               </Text>

               <Text style={dynamicStyles.description}>
                  {popUpData.message}
               </Text>

               <View style={dynamicStyles.buttonContainer}>
                  {
                     popUpData.buttonSecondary &&
                     <TouchableOpacity
                        style={dynamicStyles.secondaryButton}
                        onPress={this.props.onPressSecondary}>
                        <Text
                           style={dynamicStyles.secondaryButtonTitle}>
                           {popUpData.buttonSecondary}
                        </Text>
                     </TouchableOpacity>
                  }

                  <TouchableOpacity
                     style={[dynamicStyles.primaryButton, !popUpData.buttonSecondary && { width: '75%' }]}
                     onPress={this.props.onPressPrimary}
                  >
                     <Text
                        style={dynamicStyles.primaryButtonTitle}>
                        {popUpData.buttonPrimary}
                     </Text>
                  </TouchableOpacity>
               </View>

               {
                  isLoading &&
                  <View style={dynamicStyles.popupLoaderContainer}>
                     <View style={dynamicStyles.popupLoader}>
                        <ActivityIndicator size={50} color='#ff4c47' />
                     </View>
                  </View>
               }
            </View>
         </View>
      );
   };
};

const mapStateToProps = (state) => {
   const { widthListener } = state;

   return {
      widthListener
   };
};

export default connect(mapStateToProps)(CPopUp);

const styleDesktop = {
   containerMask: {
      width: '100%',
      height: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 26, 65, 0.7)'
   },
   container: {
      width: '100%',
      maxWidth: 544,
      paddingVertical: 32,
      paddingHorizontal: 64,
      alignItems: 'center',
      borderRadius: 16,
      backgroundColor: '#fff',
      overflow: 'hidden'
   },

   icon: {
      width: 120,
      height: 120,
      marginBottom: 32
   },
   title: {
      marginBottom: 16,
      fontFamily: 'Muli-Bold',
      fontSize: 20,
      textAlign: 'center',
      color: '#1a1a1a'
   },
   description: {
      marginBottom: 48,
      fontFamily: 'Muli-Regular',
      fontSize: 16,
      textAlign: 'center',
      color: '#1a1a1a'
   },

   buttonContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
   },
   secondaryButton: {
      width: '50%',
      height: 48,
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      backgroundColor: '#fff'
   },
   secondaryButtonTitle: {
      fontFamily: 'Muli-Bold',
      fontSize: 20,
      textAlign: 'center',
      color: '#646464'
   },
   primaryButton: {
      width: '50%',
      height: 48,
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 32,
      backgroundColor: '#ff4c47'
   },
   primaryButtonTitle: {
      fontFamily: 'Muli-Bold',
      fontSize: 20,
      textAlign: 'center',
      color: '#ffffff'
   },

   popupLoaderContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.80)'
   },
   popupLoader: {
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: 'rgba(255,255,255,1)',
      boxShadow: '4px 6px 24px 0 rgba(32, 32, 35, 0.1)'
   }
};

const styleMobile = {
   containerMask: {
      width: '100%',
      height: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 26, 65, 0.7)'
   },
   container: {
      width: '90%',
      padding: 24,
      alignItems: 'center',
      borderRadius: 16,
      backgroundColor: '#ffffff',
      overflow: 'hidden'
   },

   icon: {
      width: 90,
      height: 90,
      marginBottom: 24
   },
   title: {
      marginBottom: 16,
      fontFamily: 'Muli-Bold',
      fontSize: 18,
      textAlign: 'center',
      color: '#1a1a1a'
   },
   description: {
      marginBottom: 24,
      fontFamily: 'Muli-Regular',
      fontSize: 14,
      textAlign: 'center',
      color: '#1a1a1a'
   },

   buttonContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
   },
   secondaryButton: {
      width: '50%',
      height: 40,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      backgroundColor: '#fff'
   },
   secondaryButtonTitle: {
      fontFamily: 'Muli-Bold',
      fontSize: 16,
      textAlign: 'center',
      color: '#646464'
   },
   primaryButton: {
      width: '50%',
      height: 40,
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 32,
      backgroundColor: '#ff4c47'
   },
   primaryButtonTitle: {
      fontFamily: 'Muli-Bold',
      fontSize: 16,
      textAlign: 'center',
      color: '#ffffff'
   },

   popupLoaderContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.8)'
   },
   popupLoader: {
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: 'rgba(255,255,255,1)',
      boxShadow: '4px 6px 24px 0 rgba(32, 32, 35, 0.1)'
   }
};