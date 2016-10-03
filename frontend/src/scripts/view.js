/**
 * Sift Polarity. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';
import { mapReason } from './common.js';

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
  }

  presentView(value) {
    console.log('sift-polarity: presentView: ', value);

    if (value.data && value.data.flag === true) {
      document.querySelector('#icon').setAttribute('style', null);
      document.querySelector('#subtitle').textContent = mapReason(value.data.reason);
    }
  };

  willPresentView(value) {
    console.log('sift-polarity: willPresentView: ', value);
  };

}

registerSiftView(new MyView(window));
