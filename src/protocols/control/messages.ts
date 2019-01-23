import { Message } from '../util/messages';

export type Request = never;

export type Response = never;

export type FileByPath = {
    type: 'path';
    path: string;
};

export type FileByMeta = {
    type: 'meta';
    title: string;
    artist?: string;
    album?: string;
    lengthMillis: number;
};

export type File = FileByPath | FileByMeta;

export type LayerState =
    {
        type: 'playing';
        effectiveStartTimeMillis: number;
        /**
         * How fast is the song playing compared to it's natural speed,
         * where 1 = normal, 2 = double speed, 0.5 = half speed
         */
        playSpeed: number;
    } | {
        type: 'paused';
        positionMillis: number;
    };

export type Layer = {
    file: File;
    state: LayerState;
};

export type PlayStateData = {
    layers: Layer[];
};

export type PlayState = {
    type: 'state';
    data: PlayStateData;
};

export type Notification = PlayState;

export type ControlMessage = Message<Request, Response, Notification>;
