// implements a service to interact with the claim API

/*

claim topics
1 - basic kyc
2 - basic kyc, accredited investor
3 - basic kyc, accredited investor, qualified investor

*/

const sampleClaimTopics = [{
    id: 1,
    title: 'Claim Topic 1',
    description: 'This is the first claim topic',
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z'
}, {
    id: 2,
    title: 'Claim Topic 2',
    description: 'This is the second claim topic',
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z'
}, {
    id: 3,
    title: 'Claim Topic 3',
    description: 'This is the third claim topic',
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z'
}];

export default class ClaimTopicService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async getClaimTopics() {
        const response = sampleClaimTopics;
        return response.data;
    }

    async getClaimTopic(id) {
        const response = sampleClaimTopics.find(claimTopic => claimTopic.id === id);
        return response.data;
    }

    async createClaimTopic(claimTopic) {
        sampleClaimTopics.push(claimTopic);
        return true;
    }

    async updateClaimTopic(id, claimTopic) {
        const response = sampleClaimTopics.find(claimTopic => claimTopic.id === id);
        if (!response) {
            return false;
        }
        response.title = claimTopic.title;
        response.description = claimTopic.description;
        response.updatedAt = new Date().toISOString();
        return true;
    }

    async deleteClaimTopic(id) {
        const index = sampleClaimTopics.findIndex(claimTopic => claimTopic.id === id);
        if (index === -1) {
            return false;
        }
        sampleClaimTopics.splice(index, 1);
        return true;
    }
}