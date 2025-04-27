// src/utils/showToast.js
import Toast from 'react-native-toast-message';

const showToast = (type = 'success', message = 'Something happened',position='top') => {
  Toast.show({
    type,
    text1: message,
    position: position,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 40,
  });
};

export default showToast;
