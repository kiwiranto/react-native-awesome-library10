import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CModal from './app/CModal';
import { iconWarning } from '../Assets/app/shared';

class CFactoryAdminPassword extends Component {
  render() {
    const { t, cancel, confirm } = this.props;

    return (
      <>
        <CModal
          visible={true}
          icon={iconWarning}
          title={t('CFactoryAdminPassword.Title')}
          description={t('CFactoryAdminPassword.DescriptionReskin')}
          labelAccept={t('CFactoryAdminPassword.ButtonConfirm')}
          labelCancel={t('CFactoryAdminPassword.ButtonCancel')}
          onPressAccept={() => { confirm(); }}
          onPressCancel={() => { cancel(); }}
        />
      </>
    );
  }
}

export default connect(() => ({}))(withTranslation()(CFactoryAdminPassword));
