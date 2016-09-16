/**
 * Sift Polarity. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    // Listens for 'count' events from the Controller
    this.controller.subscribe('counts', this.onCounts.bind(this));
  }

  // TODO: link to docs
  presentView(value) {
    console.log('sift-polarity: presentView: ', value);
    this.onCounts(value.data);
  };

  // TODO: link to docs
  willPresentView(value) {
    console.log('sift-polarity: willPresentView: ', value);
  };

  onCounts(data) {
    console.log('sift-polarity: onCounts: ', data);
    Object.keys(data).forEach((k) => {
      document.getElementById(k).textContent = data[k];
    });
  }
}

registerSiftView(new MyView(window));
