import React, { useState } from 'react';
import './ObjectList.css';
function pluralize(str) {
    return str + "s";
}
function singularize(str) {
    return str.substring(0, str.length - 1);
}
/*
const tabs = [
  {
    id: "all", name: "All", filter: [{
      key: 'status',
      value: ['active', 'inactive'],
    }]
  },
  { id: "active", name: "Active", filter: [{
    key: 'status',
    value: ['active'],
    }]
  },
  { id: "inactive", name: "Inactive", filter: [{
    key: 'status',
    value: ['inactive'],
    }]
  },
];
const columns = [
  "Name",
  "Description",
  "Status",
];
const actions = [{
    id: "edit",
    name: "Edit",
    onClick: (object) => {
        console.log("Edit", object);
    }
},{
    id: "delete",
    name: "Delete",
    onClick: (object) => {
        console.log("Delete", object);
    }
}];
const globalActions = [{
    id: "create",
    name: "Create",
    dialogContent: <div>Dialog Content</div>,
    onClick: () => {
        setShowDialog(true);
    }
}];
*/
const ObjectDialogChild = ({ children }) => {
    return (
        <div className="dialog-content">
            {children}
        </div>
    );
}
export const CreateObjectDialog = ({ title, onSave, onCancel, content }) => {
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
            <ObjectDialogChild childred={content} onSave={handleSave} onCancel={handleCancel} />
        </div>
    );
}
const ObjectList = ({ title, tabs, columns, actions, globalActions, search, children }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [searchText, setSearchText] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const handleAction = (action, object) => {
        const actionObj = actions.find(a => a.id === action);
        if (actionObj) {
            if (actionObj.dialogContent) {
                setShowDialog(true);
                setDialogContent(actionObj.dialogContent);
            } else {
                actionObj.onClick(object);
            }
        }
    }
    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
    }
    const handleSearch = (text) => {
        setSearchText(text);
    }
    const handleGlobalActionClick = (evt) => {
        const action = globalActions.find(action => action.name === evt.target.innerText);
        if (action) {
            if (action.dialogContent) {
                setShowDialog(true);
                setDialogContent(action.dialogContent);
            } else {
                action.onClick();
            }
        }
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
        if (searchText) {
            return Object.keys(child).some(key => {
                return child[key].includes(searchText);
            });
        }
        const isActive = child.tabs.includes(activeTab);
        const filter = tabs.find(tab => tab.id === activeTab).filter;
        if (filter) {
            return filter.every(f => f.value.includes(child[f.key]));
        }
        return isActive;
    });
    return (
        <div className="container">
            <div className="row">
                <h1>{title}</h1>
                {// eslint-disable-next-line
                }
                {globalActions.includes("create") && globalActions.map(action => {
                    return (
                        <button key={action.id} onClick={handleGlobalActionClick}>{action.name}</button>
                    )
                })}
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
                                    {actions.map(action => {
                                        return (
                                            <button key={action.id} onClick={() => handleAction(action.id, child)}>{action.name}</button>
                                        )
                                    })}
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