/**
 * Sift Polarity. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    // Register for storage update events on the "count" bucket so we can update the UI
    this.storage.subscribe(['count'], this.onStorageUpdate.bind(this));
  }

  // TODO: Link to the docs
  loadView(state) {
    console.log('sift-polarity: loadView', state);
    switch (state.type) {
      case 'email-thread':
        return { html: 'email-thread.html', data: { words: state.params.detail.words } };
      case 'summary':
        return { html: 'summary.html', data: this.getCounts() };
      default:
        console.error('sift-polarity: unknown Sift type: ', state.type);
    }
  }

  // Event: storage update
  onStorageUpdate(value) {
    console.log('sift-polarity: onStorageUpdate: ', value);
    return this.getCounts().then((counts) => {
      // Publish 'counts' event to view
      this.publish('counts', counts);
    });
  }

  getCounts() {
    return this.storage.get({
      bucket: 'count',
      keys: ['MESSAGES', 'WORDS']
    }).then((values) => {
      return {
        messages: values[0].value || 0,
        words: values[1].value || 0,
        wpm: ((values[1].value || 0)/(values[0].value || 1)).toFixed(2)
      };
    });
  }
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());