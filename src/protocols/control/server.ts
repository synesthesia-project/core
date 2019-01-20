import {Endpoint} from '../util/endpoint';
import {ControlMessage, Request, Response, PlayStateData, Notification} from './messages';

/**
 * The ServerEndpoint is the side of the control protocol that should
 * be used by the synesthesia server
 */
export class ServerEndpoint extends Endpoint<Request, Response, Notification> {

  private readonly playStateUpdated: (state: PlayStateData) => void;

  public constructor(
    sendMessage: (msg: ControlMessage) => void,
    playStateUpdated: (state: PlayStateData) => void) {
    super(sendMessage);
    this.playStateUpdated = playStateUpdated;
  }

  protected handleRequest(request: Request): Promise<Response> {
    return new Promise((resolve, reject) => {
      reject(new Error('unknown request type'));
    });
  }

  protected handleNotification(notification: Notification) {
    switch (notification.type) {
      case 'state':
        this.playStateUpdated(notification.data);
        return;
    }
    console.error('unknown notification:', notification);
  }

  protected handleClosed() {
    console.log('connection closed');
  }

}
