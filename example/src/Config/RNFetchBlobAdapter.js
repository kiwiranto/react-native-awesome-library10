import RNFetchBlob from 'rn-fetch-blob';

const _RNFetchBlobAdapter = () => {
  return {
    get: (url, headers, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        RNFetchBlob.config({
          trusty: true
        })
          .fetch('GET', url, headers)
          .then(resolve, reject)
          .catch((errorMessage, statusCode) => {
            console.log(errorMessage, statusCode);
            reject(errorMessage);
          });

        if (timeout) {
          const e = new Error('Connection timed out');
          setTimeout(reject, timeout, e);
        }
      });
    },
    post: (url, headers, body, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        RNFetchBlob.config({
          trusty: true
        })
          .fetch('POST', url, headers, body)
          .then(resolve, reject)
          .catch((errorMessage, statusCode) => {
            console.log(errorMessage, statusCode);
          });

        if (timeout) {
          const e = new Error('Connection timed out');
          setTimeout(reject, timeout, e);
        }
      });
    },
    put: (url, headers, body, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        RNFetchBlob.config({
          trusty: true
        })
          .fetch('PUT', url, headers, body)
          .then(resolve, reject)
          .catch((errorMessage, statusCode) => {
            console.log(errorMessage, statusCode);
          });

        if (timeout) {
          const e = new Error('Connection timed out');
          setTimeout(reject, timeout, e);
        }
      });
    },
    delete: (url, headers) => {
      return RNFetchBlob.config({
        trusty: true
      })
        .fetch('DELETE', url, headers)
        .then((res) => {
          const response = res;

          return response;
        })
        .catch((errorMessage, statusCode) => {
          console.log(errorMessage, statusCode);
        });
    }
  };
};

export const RNFetchBlobAdapter = _RNFetchBlobAdapter();
