import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Modal, Input } from 'antd';

import ObjectList from './ObjectList';

const ClaimTopicsPage = ({ service }) => {

  const [claimTopics, setClaimTopics] = useState([])
  const tabs = [
    { id: "all", name: "All" },
    { id: "active", name: "Active" },
    { id: "inactive", name: "Inactive" },
  ];
  const columns = [
    "Name",
    "Description",
    "Status",
  ];
  const actions = [
    "edit",
    "delete",
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
      name: "Object 1",
      description: "This is object 1",
      status: "active",
      tabs: ["all", "active"],
    },
    {
      name: "Object 2",
      description: "This is object 2",
      status: "inactive",
      tabs: ["all", "inactive"],
    },
    {
      name: "Object 3",
      description: "This is object 3",
      status: "active",
      tabs: ["all", "active"],
    },
    {
      name: "Object 4",
      description: "This is object 4",
      status: "inactive",
      tabs: ["all", "inactive"],
    },
    {
      name: "Object 5",
      description: "This is object 5",
      status: "active",
      tabs: ["all", "active"],
    },
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
    />);

};


export default ClaimTopicsPage;