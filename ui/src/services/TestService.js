const getTestData = ()=>{
    const testData = [];

    for(let i=1; i<=200; i++){
        testData.push({
            id: i,
            name: "Object " + i,
            description: "This is object " + i,
            status: "active"
        });
    };

    return testData;
};

class TestService {
    async getClaimTopics() {
        return Promise.resolve(getTestData());
    }
}

export default TestService;