// Core
import * as React from 'react';
import { TouchableOpacity, Image, Clipboard } from 'react-native';

// Helper
import { ToastHandler } from '../Helper/MobileHelper';

// Assets
import { iconCopyTextRevamp } from '../Assets/app/shared';

/**
 * Copy clipboard component.
 * @example
 * <CCopyClipboard content='ulala' />
 * <CCopyClipboard width={10} height={10} content='ulala' />
 * @param {any} props
 * @param {number} width - icon width.
 * @param {number} height - icon height.
 * @param {string} content - the contents of the copied text.
 */
const CCopyClipboard = ({ width = 24, height = 24, content = '' }) => {
  const writeToClipboard = async () => {
    await Clipboard.setString(content);
    ToastHandler('Copied to Clipboard');
  };

  return (
    <TouchableOpacity onPress={() => writeToClipboard()}>
      <Image source={iconCopyTextRevamp} resizeMode="contain" style={{ width, height }} />
    </TouchableOpacity>
  );
};

export default CCopyClipboard;
