import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Modal, Input } from 'antd';


const ClaimTopicListItem = ({ item, setSelectedTopics }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex items-center">
      <Checkbox
        className="mr-4"
        checked={isChecked}
        onChange={() => {
          setIsChecked(!isChecked);
          setSelectedTopics((prevState) =>
            isChecked ? prevState.filter((topic) => topic !== item) : [...prevState, item]
          );
        }}
      />
      {item}
    </div>
  );
}

const AddClaimTopicDialog = ({ visible, newTopic, setNewTopic, handleAddTopic, onCancel }) => {
  return (
    <Modal
      title="Add Claim Topic"
      visible={visible}
      onCancel={onCancel}
      onOk={handleAddTopic}
    >
      <Input
        value={newTopic}
        onChange={(e) => setNewTopic(e.target.value)}
      />
    </Modal>
  );
}

const RemoveClaimTopicDialog = ({ visible, handleRemoveTopics, onCancel }) => {
  return (
    <Modal
      title="Confirm Removal"
      visible={visible}
      onCancel={onCancel}
      onOk={handleRemoveTopics}
    >
      Are you sure you want to remove the selected claim topics?
    </Modal>
  );
}

const ClaimTopicsPage = ({ service }) => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

  // Fetch initial topics
  useEffect(() => {
    async function fetchTopics() {
      const fetchedTopics = await service.getClaimTopics();
      setTopics(fetchedTopics);
    }

    fetchTopics();
  }, [service]);

  // Setup event listeners
  useEffect(() => {
    service.onClaimTopicAdded && service.onClaimTopicAdded((claimTopic) => {
      setTopics((prevState) => [...prevState, claimTopic]);
    });

    service.onClaimTopicRemoved && service.onClaimTopicRemoved((claimTopic) => {
      setTopics((prevState) => prevState.filter((topic) => topic !== claimTopic));
    });

    return () => {
      // Clean up event listeners
      service.contract && service.contract.removeAllListeners('ClaimTopicAdded');
      service.contract && service.contract.removeAllListeners('ClaimTopicRemoved');
    };
  }, [service]);

  const handleAddTopic = async () => {
    if (newTopic !== '') {
      await service.addClaimTopic(newTopic);
      setNewTopic('');
      setAddModalVisible(false);
    }
  };

  const handleRemoveTopics = async () => {
    for (const topic of selectedTopics) {
      await service.removeClaimTopic(topic);
    }
    setSelectedTopics([]);
    setRemoveModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setAddModalVisible(true)}>
        Add Claim Topic
      </Button>
      {topics.length > 0 && (
        <Button
          type="primary"
          onClick={() => setRemoveModalVisible(true)}
          style={{ marginLeft: '10px' }}
        >
          Remove Claim Topic(s)
        </Button>
      )}
      {topics.map((topic, index) => (
        <ClaimTopicListItem key={index} item={topic} setSelectedTopics={setSelectedTopics} />
      ))}
      <AddClaimTopicDialog
        visible={addModalVisible}
        newTopic={newTopic}
        setNewTopic={setNewTopic}
        handleAddTopic={handleAddTopic}
        onCancel={() => setAddModalVisible(false)}
      />
      <RemoveClaimTopicDialog
        visible={removeModalVisible}
        handleRemoveTopics={handleRemoveTopics}
        onCancel={() => setRemoveModalVisible(false)}
      />
    </div>
  );
};


export default ClaimTopicsPage;