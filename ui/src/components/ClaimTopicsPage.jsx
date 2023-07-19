import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Modal, Input } from 'antd';

import ObjectList from './ObjectList';

const ClaimTopicsPage = ({ service }) => {

  const [claimTopics, setClaimTopics] = useState([])
  const tabs = [
    {
      id: "all", name: "All", filter: [{
        key: 'status',
        value: ['active', 'inactive'],
      }]
    },
    { id: "active", name: "Active" },
    { id: "inactive", name: "Inactive" },
  ];
  const columns = [
    "claim topic",
    "claim topic id",
  ];
  const actions = [{
	id: "view",
    name: "View",
    onClick: (object) => {
        console.log("View", object);
    }
	}
  ];
  const globalActions = [
    "create",
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

  const children = [
    {
      'claim topic': "Object 1",
      'claim topic id': "This is object 1",
      status: "active",
      tabs: ["all", "active"],
    },
    {
      'claim topic': "Object 2",
      'claim topic id': "This is object 2",
      status: "inactive",
      tabs: ["all", "inactive"],
    },
    {
      'claim topic': "Object 3",
      'claim topic id': "This is object 3",
      status: "active",
      tabs: ["all", "active"],
    },
    {
      'claim topic': "Object 4",
      'claim topic id': "This is object 4",
      status: "inactive",
      tabs: ["all", "inactive"],
    },
    {
      'claim topic': "Object 5",
      'claim topic id': "This is object 5",
      status: "active",
      tabs: ["all", "active"],
    }
  ]
  const handleAction = (action, object) => {
    console.log(action, object);
  }

  return (
    <ObjectList
      title="Claim Topics"
      tabs={tabs}
      columns={columns}
      actions={actions}
      globalActions={globalActions}
      search={search}
      children={children}
      onAction={handleAction}
      onGlobalAction={handleAction}
    />);

};


export default ClaimTopicsPage;