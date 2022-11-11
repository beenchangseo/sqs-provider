import {SQSClient} from '@aws-sdk/client-sqs';
import {SQSClientModuleOption} from '../types';

class SQSClientModule {
    private static instance: SQSClientModule;
    private readonly sqsClient: SQSClient;
    private readonly sqsOption: SQSClientModuleOption;
    private readonly sqsClientPool = new Set<SQSClient>();

    constructor(public option: SQSClientModuleOption) {
        this.sqsOption = option;
        this.sqsClient = new SQSClient({region: this.sqsOption.region});
        if (SQSClientModule.instance) return SQSClientModule.instance;
        SQSClientModule.instance = this;
    }

    getSQSClient(): SQSClient {
        return this.sqsClient;
    }

    getSQSClientPool(): Set<SQSClient> {
        if (this.option.pool) {
            if (this.sqsClientPool.size === 0) {
                for (let i = 0; i < this.option.pool; i++) {
                    this.sqsClientPool.add(new SQSClient({region: this.sqsOption.region}));
                }
            } else {
                for (const client of this.sqsClientPool) {
                    client.destroy();
                }

                this.sqsClientPool.clear();

                for (let i = 0; i < this.option.pool; i++) {
                    this.sqsClientPool.add(new SQSClient({region: this.sqsOption.region}));
                }
            }
        } else {
        }
        return this.sqsClientPool;
    }
}

export default SQSClientModule;
