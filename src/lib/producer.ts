import {SendMessageCommand, SendMessageCommandInput, SQSClient} from '@aws-sdk/client-sqs';
import {SQSCommon} from '../abstract/sqsCommon';
import {PushQueueMessage} from '../types';
import SQSClientModule from './sqsClientModule';

class Producer extends SQSCommon {
    constructor(private readonly sqsClientModule: SQSClientModule) {
        super(sqsClientModule);
    }

    async send(pushQueueMessage: PushQueueMessage[]): Promise<void> {
        try {
            Promise.all(
                pushQueueMessage.map(async (message) => {
                    const messagePayload = {data: message, time: Date.now()};
                    const optionPayload: SendMessageCommandInput = {
                        DelaySeconds: 1,
                        MessageBody: JSON.stringify({...messagePayload}),
                        QueueUrl: this.sqsClientModule.option.queueURL,
                    };
                    const data = await this.sqsClient.send(new SendMessageCommand(optionPayload));
                }),
            );
        } catch (err) {
            console.log('Producer Send Error');
        }
    }
}

export default Producer;
