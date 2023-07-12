
import React, { useState } from 'react';

import './ObjectList.css';

function pluralize(str) {
    return str + "s";
}
function singularize(str) {
    return str.substring(0, str.length - 1);
}

export const CreateObjectDialog = ({ title, onSave, onCancel }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSave = () => {
        onSave({ name, description });
    }

    const handleCancel = () => {
        onCancel();
    }

    return (
        <div>
            <h2>Create New {title}</h2>
            <div className="form">
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

const ObjectList = ({ title, tabs, columns, actions, globalActions, search, children, onAction }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [searchText, setSearchText] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);

    const handleAction = (action, object) => {
        if (onAction) {
            onAction(action, object);
        }
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
    }

    const handleSearch = (text) => {
        setSearchText(text);
    }

    const handleCreate = () => {
        setShowDialog(true);
        setDialogContent(<CreateObjectDialog title={title} onSave={handleSave} onCancel={handleCancel} />);
    }

    const handleSave = (object) => {
        setShowDialog(false);
        setDialogContent(null);
        handleAction("create", object);
    }

    const handleCancel = () => {
        setShowDialog(false);
        setDialogContent(null);
    }

    const filteredChildren = children.filter(child => {
        return child.tabs.includes(activeTab) && child.name.toLowerCase().includes(searchText.toLowerCase());
    });

    return (
        <div className="container">
            <div className="row">
                <h1>{title}</h1>
                {// eslint-disable-next-line
                }
                {globalActions.includes("create") && <a href="#" className="btn" onClick={handleCreate}>Create New {singularize(title)}</a>}
            </div>
            <h2>A list of your {title}</h2>
            <div className="tabs">
                {tabs.map(tab => {
                    return (
                        <a key={tab.id} href="#" className={tab.id === activeTab ? "active" : ""} onClick={() => handleTabClick(tab)}>{tab.name}</a>
                    )
                })}
            </div>
            {search && <div className="search">
                <input type="text" placeholder="Search..." onChange={(e) => handleSearch(e.target.value)} />
                <button>Search</button>
            </div>}
            <table>
                <thead>
                    <tr>
                        {columns.map(column => {
                            return (
                                <th key={column}>{column}</th>
                            )
                        })}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredChildren.map(child => {
                        return (
                            <tr key={child.name}>
                                {columns.map(column => {
                                    return (
                                        <td key={column}>{child[column]}</td>
                                    )
                                })}
                                <td>
                                    {actions.includes("edit") && <a href="#" onClick={() => handleAction("edit", child)}>Edit</a>}
                                    {actions.includes("delete") && <a href="#" onClick={() => handleAction("delete", child)}>Delete</a>}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <a href="#">Previous</a>
                <a href="#">1</a>
                <a href="#" className="active">2</a>
                <a href="#">3</a>
                <a href="#">Next</a>
            </div>
            {showDialog && <div className="dialog">
                <div className="dialog-content">
                    {dialogContent}
                </div>
            </div>}
        </div>
    )
}

export default ObjectList;

// example usage:

// const tabs = [
//     { id: "all", name: "All" },
//     { id: "active", name: "Active" },
//     { id: "inactive", name: "Inactive" },
// ];

// const columns = [
//     "Name",
//     "Description",
//     "Status",
// ];

// const actions = [
//     "edit",
//     "delete",
// ];

// const globalActions = [
//     "create",
// ];

// const search = true;

// const children = [
//     {
//         name: "Object 1",
//         description: "This is object 1",
//         status: "active",
//         tabs: ["all", "active"],
//     },
//     {
//         name: "Object 2",
//         description: "This is object 2",
//         status: "inactive",
//         tabs: ["all", "inactive"],
//     },
//     {
//         name: "Object 3",
//         description: "This is object 3",
//         status: "active",
//         tabs: ["all", "active"],
//     },
//     {
//         name: "Object 4",
//         description: "This is object 4",
//         status: "inactive",
//         tabs: ["all", "inactive"],
//     },
//     { 
//         name: "Object 5",
//         description: "This is object 5",
//         status: "active",
//         tabs: ["all", "active"],
//     },
//     ]
//
// <ObjectList
//     title="Objects"
//     tabs={tabs}
//     columns={columns}
//     actions={actions}
//     globalActions={globalActions}
//     search={search}
//     children={children}
//     onAction={handleAction}
// />
