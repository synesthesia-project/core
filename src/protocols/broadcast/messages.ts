import {Message} from '../util/messages';
import {CueFile} from '../../file';

export type PingRequest = {
  type: 'ping';
};

export type Request = PingRequest;

export type PingResponse = {
  type: 'pong';
  timestampMillis: number;
};

export type Response = PingResponse;

export type PlayStateData = {
  effectiveStartTimeMillis: number;
  file: CueFile;
};

export type PlayingNotification = {
  type: 'playing';
  data: PlayStateData;
};

export type StoppedNotification = {
  type: 'stopped';
};

export type PingStateNotification = {
  type: 'ping';
  ping: number;
  diff: number;
};

export type Notification = PlayingNotification | StoppedNotification | PingStateNotification;

export type BroadcastMessage = Message<Request, Response, Notification>;
