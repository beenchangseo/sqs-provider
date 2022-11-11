import {SQSClient} from '@aws-sdk/client-sqs';
import SQSClientModule from '../lib/sqsClientModule';

export abstract class SQSCommon {
    public readonly sqsClient: SQSClient;
    public readonly sqsClientPool: Set<SQSClient>;

    constructor(sqsClientModule: SQSClientModule) {
        this.sqsClient = sqsClientModule.getSQSClient();
        this.sqsClientPool = sqsClientModule.getSQSClientPool();
    }
}
