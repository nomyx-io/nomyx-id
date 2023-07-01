// implements a service to interact with the claim API



const sampleClaims = [{
    id: 1,
    title: 'Claim 1',
    description: 'This is the first claim',
    status: 'new',
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z'
}, {
    id: 2,
    title: 'Claim 2',
    description: 'This is the second claim',
    status: 'new',
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z'
}, {
    id: 3,
    title: 'Claim 3',
    description: 'This is the third claim',
    status: 'new',
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z'
}];

export default class ClaimService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async getClaims() {
        const response = sampleClaims;
        return response.data;
    }

    async getClaim(id) {
        const response = sampleClaims.find(claim => claim.id === id);
        return response.data;
    }

    async createClaim(claim) {
        sampleClaims.push(claim);
        return true;
    }

    async updateClaim(id, claim) {
        const response = sampleClaims.find(claim => claim.id === id);
        if (!response) {
            return false;
        }
        response.title = claim.title;
        response.description = claim.description;
        response.status = claim.status;
        response.updatedAt = new Date().toISOString();
        return true;
    }

    async deleteClaim(id) {
        const response = sampleClaims.find(claim => claim.id === id);
        if (!response) {
            return false;
        }
        sampleClaims.splice(sampleClaims.indexOf(response), 1);
    }
}