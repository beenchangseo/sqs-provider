export interface SQSClientModuleOption {
    queueURL: string;
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    pool?: number;
}

export type PushType = 'login_push' | 'transfer_push' | 'order_push' | 'notice_push';

export interface PushQueueMessage {
    pushType: PushType;
    pushTitle: string;
    pushBody: string;
    pushToken: string;
    pushDetail: any;
}
