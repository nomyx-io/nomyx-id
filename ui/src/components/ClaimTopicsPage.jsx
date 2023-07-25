import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Modal, Input } from 'antd';


import ObjectList from './ObjectList';

const ClaimTopicsPage = ({ service }) => {

  const [claimTopics, setClaimTopics] = useState([]);

  const columns = [
    {label:"Id", name:"id"},
    {label:"Claim Topic", name:"name", width:"95%"}
  ];

  const actions = [
    // "view",
    {label:"View", name:"view", confirmation:"You are about to do something. Do you wish to proceed?"}
  ];
  const globalActions = [
    // {label:"Create Claim Topic", name:"create", confirmation:"You are about to do something. Do you wish to proceed?"}
    {label:"Create Claim Topic", name:"create"}
  ];

  useEffect( () => {
    async function getClaimTopics() {
      const result = await service.getClaimTopics();
      setClaimTopics(result);
    }

    getClaimTopics();

  }, [service]);

  const search = true;
  
  const handleAction = async (action, object) => {
    console.log(action, object);
    //create a claim topic
    // let claimTopicId = Math.round(Math.random()*10000000);
    // let response = await blockchainService.addClaimTopic(claimTopicId);

  }

  return (
      <ObjectList
          title="Claim Topics"
          description="Claim Topics describe the types of Claims that can be created for any Identity"
          columns={columns}
          actions={actions}
          globalActions={globalActions}
          search={search}
          data={claimTopics}
          pageSize={10}
          onAction={handleAction}
          onGlobalAction={handleAction}
      />
    );

};


export default ClaimTopicsPage;