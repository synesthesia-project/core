import * as React from 'react';

import { DownstreamEndpoint } from '@synesthesia-project/core/protocols/broadcast';
import { DEFAULT_SYNESTHESIA_PORT } from '@synesthesia-project/core/constants';

export class Stage extends React.Component<{}, {}> {

  public constructor(props: {}) {
    super(props);
    this.state = {};

    const endpoint = this.connect();
    endpoint.then(endpoint => {
      console.log('endpoint ready', endpoint);
    });
  }

  private connect(): Promise<DownstreamEndpoint> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${DEFAULT_SYNESTHESIA_PORT}/listen`);
      ws.addEventListener('open', () => {
        const endpoint = new DownstreamEndpoint(
          msg => ws.send(JSON.stringify(msg)),
          state => {
            console.log('new state', state);
            if (state) {
              state.layers.map(l =>
                endpoint.getFile(l.fileHash)
                  .then(file => console.log('received file', file))
                  .catch(err => console.error(err))
              );
            }
          }
        );
        ws.addEventListener('message', msg => {
          endpoint.recvMessage(JSON.parse(msg.data));
        });
        resolve(endpoint);
      });
      ws.addEventListener('error', err => {
        reject(err);
      });
      ws.addEventListener('close', err => {
        // TODO
      });
    });
  }

  public render() {
    return (
      <div>
        <div>
        </div>
      </div>
    );
  }
}
