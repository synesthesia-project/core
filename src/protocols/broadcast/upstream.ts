import {Endpoint} from '../util/endpoint';
import {BroadcastMessage, Request, Response, PlayStateData, Notification} from './messages';

/**
 * The UpstreamEndpoint is the side of the protocol that shares synesthesia
 * information (e.g. a server).
 */
export class UpstreamEndpoint extends Endpoint<Request, Response, Notification> {

  private readonly recvPingData: (ping: number, diff: number) => void;

  public constructor(
      sendMessage: (msg: BroadcastMessage) => void,
      recvPingData: (ping: number, diff: number) => void) {
    super(sendMessage);
    this.recvPingData = recvPingData;
  }

  protected handleRequest(request: Request): Promise<Response> {
    return new Promise((resolve, reject) => {
      switch (request.type) {
        case 'ping': {
          const response: Response = {
            type: 'pong',
            timestampMillis: new Date().getTime()
          };
          resolve(response);
          return;
        }
      }
      reject(new Error('unknown request type'));
    });
  }

  protected handleNotification(notification: Notification) {
    switch (notification.type) {
      case 'ping': {
        this.recvPingData(notification.ping, notification.diff);
        break;
      }
      default:
        console.error('unknown notification:', notification);
    }
  }

  protected handleClosed() {
    console.log('connection closed');
  }

  public sendState(state: PlayStateData) {
    this.sendMessage({
      type: 'notification',
      notification: {
        type: 'playing_state',
        data: state
      }
    });
  }

}
