/**
 * Sift Polarity. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
  }

  loadView(state) {
    console.log('sift-polarity: loadView', state);
    switch (state.type) {
      case 'email-thread':
        return { html: 'email-thread.html', data: state.params.detail };
      case 'summary':
        return { html: 'summary.html' };
      default:
        console.error('sift-polarity: unknown Sift type: ', state.type);
    }
  }
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());