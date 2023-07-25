import React from 'react'
import { useParams } from 'react-router-dom';

function ViewClaimTopic({ service }) {

    let { topicId } = useParams();

    return (
        <div>
            {topicId}
        </div>
    );
}

export default ViewClaimTopic;