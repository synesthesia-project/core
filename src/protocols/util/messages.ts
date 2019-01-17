export type RequestMessage<Request> = {
    type: 'request';
    requestId: number;
    request: Request;
};

export type ResponseMessage<Response> = {
    type: 'response';
    requestId: number;
    response: Response;
};

export type NotificationMessage<Notification> = {
    type: 'notification';
    notification: Notification;
};

/**
 * The type representing the messages that can be sent and received by a particular endpoint.
 */
export type Message<Request, Response, Notification> =
    RequestMessage<Request> | ResponseMessage<Response> | NotificationMessage<Notification>;
