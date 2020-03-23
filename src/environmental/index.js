import dev from './dev';
import test from './test';
import prod from './prod';

export default {
  env: function() {
    if (process.env.NODE_ENV === 'development') {
      return dev;
    } else if (process.env.NODE_ENV === 'production') {
      return prod || process.env.NODE_URL;
    } else {
      return test;
    }
  }
};
