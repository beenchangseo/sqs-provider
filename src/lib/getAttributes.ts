import { GetQueueAttributesCommand, GetQueueAttributesCommandInput, GetQueueAttributesCommandOutput } from '@aws-sdk/client-sqs';
import {SQSCommon} from '../abstract/sqsCommon';
import SQSClientModule from './sqsClientModule';

class GetAttributes extends SQSCommon {
    constructor(private readonly sqsClientModule: SQSClientModule) {
        super(sqsClientModule);
    }

    async getAttributes(attributes: string[]): Promise<GetQueueAttributesCommandOutput> {
        try {
            const param: GetQueueAttributesCommandInput = {
                QueueUrl: this.sqsClientModule.option.queueURL,
                AttributeNames: attributes,
            }
            const data = await this.sqsClient.send(new GetQueueAttributesCommand(param));
            return data;
        } catch (err) {
            
        }
    }
}

export default GetAttributes
