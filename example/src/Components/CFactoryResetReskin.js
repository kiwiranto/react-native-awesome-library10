import React, { Component } from 'react';
import { SET_MODAL_SHOW_STATUS, SET_MODEM_DATA } from '../Config/Reducer';
import { connect } from 'react-redux';
import { navigate } from '../Navigator/Navigator.mobile';
import { withTranslation } from 'react-i18next';
import CModal from './app/CModal';
import { iconWarning } from '../Assets/app/shared';

class CFactoryReset extends Component {

  componentDidMount() {
    const { setModalShowStatus } = this.props;
    setModalShowStatus(false);
  }

  _redirectToPairing = () => {
    const { setModalShowStatus } = this.props;
    setModalShowStatus(false, false);
    navigate('PairingProcessReset', { isReset: true, id: 1 }, this.props);
  }

  render() {
    const { modalShowStatus, t, setModalShowStatus } = this.props;
    const { showResetModal, isReset } = modalShowStatus;

    return (
      <>
        <CModal
          visible={showResetModal}
          icon={iconWarning}
          title={t('CFactoryReset.Title')}
          description={isReset ? t('CFactoryReset.DescriptionIsResetReskin') : t('CFactoryReset.Description')}
          labelAccept={isReset ? t('CFactoryReset.ButtonAccept') : t('CFactoryReset.ButtonHubungkan')}
          labelCancel={t('CFactoryReset.ButtunNantiSaja')}
          onPressAccept={() => { this._redirectToPairing(); }}
          onPressCancel={() => { setModalShowStatus(false); }}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  const { modalShowStatus, accessTokenData } = state;
  return {
    modalShowStatus,
    accessTokenData
  };
};

const mapDispatchToProps = dispatch => ({
  setModalShowStatus: status => dispatch({
    type: SET_MODAL_SHOW_STATUS,
    modalShowStatus: {
      showResetModal: status
    }
  }),
  setModemData: modemData =>
    dispatch({ type: SET_MODEM_DATA, dataOfModem: modemData })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CFactoryReset));
