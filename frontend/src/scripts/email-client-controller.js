/**
 * Sift Polarity. Email client controller entry point.
 */
import { EmailClientController, registerEmailClientController } from '@redsift/sift-sdk-web';
import { mapReason } from './common.js';

export default class MyEmailClientController extends EmailClientController {
  constructor() {
    super();
  }

  loadThreadListView (listInfo) {
    if (listInfo) {
      return {
        template: '003_list_common_img',
        value: {
          image: {
            url: "assets/square_p.png"
          },
          subtitle: mapReason(listInfo.reason)
        }
      };
    }
  };
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerEmailClientController(new MyEmailClientController());
