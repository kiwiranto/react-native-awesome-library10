import { Platform } from 'react-native';
import CColors from '../Components/CColors';

// export const MIN_BROWSER_WIDTH_SCREEN = 1260;
export const MIN_CONTAINER_WIDTH_SCREEN = 1120;

export const StyleGlobal = {
  container: {
    position: 'relative',
    maxWidth: MIN_CONTAINER_WIDTH_SCREEN,
    width: '100%',
    paddingHorizontal: 32,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  boxShadow: {
    shadowColor: CColors.shadowThree,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 15
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  boxContent: {
    backgroundColor: CColors.white,
    borderRadius: 16,
    shadowColor: CColors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 56
  },
  textInput: {
    borderBottomWidth: 1,
    fontSize: 18,
    marginBottom: 24,
    color: CColors.blackTwo,
    paddingTop: 3,
    paddingBottom: 0
  },
  cardShadow: {
    shadowColor: CColors.shadowFour,
    shadowOffset: {
      width: 4,
      height: 6
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10
  }
};

export const globalShadow = {
  ...Platform.select({
    web: {
      shadowColor: CColors.black,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10
    }
  })
};

export const joinShadow = {
  ...Platform.select({
    web: {
      boxShadow: '4px 6px 24px 0 rgba(32, 32, 35, 0.1)'
    }
  })
};

export const cardShadow = {
  ...Platform.select({
    web: {
      shadowColor: CColors.shadow, shadowOffset: { width: 4, height: 6 }, shadowOpacity: 1, shadowRadius: 24
    }
  })
};
