import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Modal, Input } from 'antd';

import ObjectList from './ObjectList';

const ClaimTopicsPage = ({ service }) => {

  const [claimTopics, setClaimTopics] = useState([])

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

  // useEffect(() => {
  //   service.getClaimTopics().then((claimTopics) => {
  //     setClaimTopics(claimTopics.map((claimTopic) => {
  //       return {
  //         name: claimTopic.name,
  //         description: claimTopic.description,
  //         status: claimTopic.status,
  //         tabs: ["all", claimTopic.status],
  //       }
  //     }))
  //   })
  // }, [service])

  const search = true;

  const data = [];

  for(let i=1; i<=200; i++){
    data.push({
      id: i,
      name: "Object " + i,
      description: "This is object " + i,
      status: "active"
    });
  };


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
      data={data}
      onAction={handleAction}
      onGlobalAction={handleAction}
    />);

};


export default ClaimTopicsPage;