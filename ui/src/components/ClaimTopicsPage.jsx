import React, { useState } from 'react'

const ClaimTopicsPage = () => {
  const [topics, setTopics] = useState([])
  const [newTopic, setNewTopic] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleAddTopic = () => {
    if (newTopic !== '') {
      setTopics([...topics, newTopic])
      setNewTopic('')
    }
  }

  const handleRemoveTopics = () => {
    setTopics(topics.filter(topic => !(selectedTopics.includes(topic))))
    setSelectedTopics([])
    setIsModalVisible(false)
  }

  return (
    <div class="text-blue-500">
      <button 
        onClick={() => setIsModalVisible(true)} 
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Add Claim Topic
      </button>
      {topics.length > 0 &&
        <button
          onClick={() => setIsModalVisible(true)} 
          class="ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Remove Claim Topic(s)
        </button>
      }
      <ClaimTopicsList topics={topics} setSelectedTopics={setSelectedTopics}/>
      <AddClaimTopicDialog newTopic={newTopic}
                           setNewTopic={setNewTopic}
                           handleAddTopic={handleAddTopic}/>
      {isModalVisible &&
        <RemoveClaimTopicDialog handleRemoveTopics={handleRemoveTopics}/>
      }
    </div>
  )
}

const ClaimTopicsList = ({ topics, setSelectedTopics }) => (
  <ul class="list-decimal list-inside m-4">
    {topics.map((item, index) => 
      <ClaimTopicListItem key={index} item={item} setSelectedTopics={setSelectedTopics}/>
    )}
  </ul>
)

const ClaimTopicListItem = ({ item, setSelectedTopics }) => (
  <li class="m-2">
    <input 
      class="mr-2 leading-tight"
      type="checkbox" 
      onChange={(e) => setSelectedTopics(prevState => {
        if (e.target.checked) {
          return [...prevState, item]
        } else {
          return prevState.filter(topic => topic !== item)
        }
      })}
    />
    <span class="text-blue-700">{item}</span>
  </li>
)

const AddClaimTopicDialog = ({ newTopic, setNewTopic, handleAddTopic }) => (
  // Note: Tailwind does not provide modal/dialog out of the box. You might need to use libraries like Headless UI
  <div>
    <h2 class="text-blue-700 text-lg font-semibold">Add Claim Topic</h2>
    <input 
      type="text"
      value={newTopic} 
      onChange={e => setNewTopic(e.target.value)}
      placeholder="Enter claim topic"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-blue-700 leading-tight focus:outline-none focus:shadow-outline"
    />
    <button 
      onClick={handleAddTopic}
      class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add
    </button>
  </div>
)

const RemoveClaimTopicDialog = ({ handleRemoveTopics }) => (
  // Note: Tailwind does not provide modal/dialog out of the box. You might need to use libraries like Headless UI
  <div>
    <h2 class="text-blue-700 text-lg font-semibold">Remove Claim Topic(s)</h2>
    <p class="text-blue-700">Are you sure you want to remove the selected topic(s)?</p>
    <button 
      onClick={handleRemoveTopics}
      class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Remove
    </button>
  </div>
)

export default ClaimTopicsPage