import {
    DeleteMessageBatchCommand,
    Message,
    ReceiveMessageCommand,
    ReceiveMessageCommandInput,
    SQSClient,
} from '@aws-sdk/client-sqs';
import {SQSCommon} from '../abstract/sqsCommon';
import SQSClientModule from './sqsClientModule';

class Consumer extends SQSCommon {
    private receviMessageOption: ReceiveMessageCommandInput = {
        AttributeNames: ['SentTimestamp'],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ['All'],
        QueueUrl: this.sqsClientModule.option.queueURL,
        VisibilityTimeout: 15,
        WaitTimeSeconds: 10,
    };
    private running: boolean = false;

    constructor(private readonly sqsClientModule: SQSClientModule) {
        super(sqsClientModule);
    }

    setOption(option: ReceiveMessageCommandInput): void {
        this.receviMessageOption = option;
    }

    async boot(): Promise<void> {
        this.running = true;
        if (this.sqsClientModule.option.pool) {
            let promises = [];
            for (const pool of this.sqsClientPool) {
                const promise = async () => {
                    while (this.running) {
                        const messages = await this.receive(pool);
                        if (messages !== null) {
                            console.log(`receive messages : ${messages.length}`);
                            await this.delete(pool, messages);
                        }
                    }
                };
                promises.push(promise());
            }
            Promise.all(promises);
        } else {
            while (this.running) {
                const messages = await this.receive(this.sqsClient);
                if (messages !== null) {
                    console.log(`receive messages : ${messages.length}`);
                    await this.delete(this.sqsClient, messages);
                }
            }
        }
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    private async receive(sqsClient: SQSClient): Promise<Message[] | null> {
        try {
            const recvData = await sqsClient.send(
                new ReceiveMessageCommand(this.receviMessageOption),
            );

            if (recvData.Messages) return recvData.Messages;
            else return null;
        } catch (err) {
            console.log('Consumer receive Error');
        }
    }

    private async delete(sqsClient: SQSClient, messages: Message[]): Promise<void> {
        try {
            const deleteParams = {
                QueueUrl: this.sqsClientModule.option.queueURL,
                Entries: messages.map((message, index) => ({
                    Id: `${index}`,
                    ReceiptHandle: message.ReceiptHandle,
                })),
            };
            await sqsClient.send(new DeleteMessageBatchCommand(deleteParams));
        } catch (err) {
            console.log('Consumer delete Error');
        }
    }
}

export default Consumer;
