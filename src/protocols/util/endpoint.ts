import { Message, RequestMessage, ResponseMessage, NotificationMessage } from './messages';

/**
 * A generic abstract class that uses Promises to simplyfy implementation
 * of endpoints that handle request/response type messages.
 */
export abstract class Endpoint<Req, Res, Notif> {

  protected readonly sendMessage: (msg: Message<Req, Res, Notif>) => void;

  private readonly pendingRequests =
    new Map<number, { resolve: (resp: Res) => void }>();

  private nextRequestId = 0;

  protected constructor(sendMessage: (msg: Message<Req, Res, Notif>) => void) {
    this.sendMessage = sendMessage;
  }

  /**
   * Call this method when the connection receives a message
   */
  public recvMessage(msg: Message<Req, Res, Notif>): void {
    switch (msg.type) {
      case 'request': {
        this.handleRequest(msg.request)
          .then(response => this.sendMessage({
            type: 'response',
            requestId: msg.requestId,
            response
          }));
        break;
      }
      case 'response': {
        const r = this.pendingRequests.get(msg.requestId);
        if (r) {
          r.resolve(msg.response);
        } else {
          console.error('Got response for unrecognized request:', msg.requestId);
        }
        break;
      }
      case 'notification': {
        this.handleNotification(msg.notification);
        break;
      }
      default:
        console.log('unknown message', msg);
    }
  }

  /**
   * Call this method when the connection has been closed
   */
  public closed(): void {
    this.handleClosed();
  }

  protected abstract handleRequest(request: Req): Promise<Res>;

  protected abstract handleNotification(notification: Notif): void;

  protected abstract handleClosed(): void;

  protected sendRequest(request: Req): Promise<Res> {
    return new Promise(resolve => {
      const requestId = this.nextRequestId++;
      this.pendingRequests.set(requestId, { resolve });
      this.sendMessage({
        type: 'request',
        requestId,
        request
      });
    });
  }

  protected sendNotification(notification: N) {
    this.sendMessage({
      type: 'notification',
      notification
    });
  }

}
