import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import Constants from "../utils/Constants"
import ObjectList from "./ObjectList";

const ClaimTopicsPage = ({ service }) => {

  const navigate = useNavigate();
  const [claimTopics, setClaimTopics] = useState([]);

  const columns = [
    {label:"Id", name:"attributes.topic"},
    {label:"Claim Topic", name:"attributes.displayName", width:"95%"}
  ];

  const actions = [
    // "view",
    // {label:"View", name:Constants.ACTION_VIEW_CLAIM_TOPIC, confirmation:"You are about to do something. Do you wish to proceed?"}
    {label:"View", name:Constants.ACTION_VIEW_CLAIM_TOPIC}
  ];

  const globalActions = [
    // {label:"Create Claim Topic", name:"create", confirmation:"You are about to do something. Do you wish to proceed?"}
    {label:"Create Claim Topic", name:Constants.ACTION_CREATE_CLAIM_TOPIC}
  ];

  const search = true;

  const handleAction = async (event, action, record) => {
    switch(action){
      case Constants.ACTION_CREATE_CLAIM_TOPIC:
        navigate("/topics/create");
        break;
      case Constants.ACTION_VIEW_CLAIM_TOPIC:
        let id = record.id;
        navigate("/topics/" + id);
        break;
    }
  }

  useEffect( () => {
    (async function() {
      const result = await service.getClaimTopics();
      setClaimTopics(result);
    })();
  }, [service]);

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