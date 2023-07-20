
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

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

const ObjectList = ({ title, description, tabs, columns, actions, globalActions, search, data, pageSize, onAction }) => {

    const [pageData, setPageData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [activeTab, setActiveTab] = useState(tabs ? tabs[0].id : null);
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

        let filteredData = data.filter(record => {
            /*            return tabs ?
                            record.tabs.includes(activeTab) && record.name.toLowerCase().includes(searchText.toLowerCase()) :
                            record.name.toLowerCase().includes(searchText.toLowerCase());*/

            for (let prop in record) {

                if(typeof record[prop] == 'string' && record[prop].includes(text)){
                    return record;
                }else if(record[prop] == text){
                    return record;
                }
            }

        });

        setFilteredData(filteredData);
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

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * pageSize) % data.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    useEffect(() => {
        const endOffset = itemOffset + pageSize;
        setPageData(filteredData.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(filteredData.length / pageSize));
    }, [itemOffset, pageSize, filteredData]);

    return (
        <div className="container">

            {tabs && (
                <div className="tabs">
                    {tabs.map(tab => {
                        return (
                            <a key={tab.id} href="#" className={tab.id === activeTab ? "active" : ""} onClick={() => handleTabClick(tab)}>{tab.name}</a>
                        )
                    })}
                </div>
            )}

            <header className="table-header">


                <h1>{title}</h1>

                <h2>{description ? description : 'A list of your ' + title}</h2>

                <section className="controls">

                    {search && <div className="search">
                        <input type="text" placeholder="Search..." onKeyUp={(e) => handleSearch(e.target.value)} />
                    </div>}

                    {globalActions && (
                        <div className="global-actions">
                            {globalActions.map(globalAction => {
                                return (
                                    <button key={globalAction} className={"btn global-action-" + globalAction} onClick={() => handleAction(globalAction)}>{globalAction}</button>
                                )
                            })}
                        </div>
                    )}

                </section>

            </header>



            <table>
                <thead>
                    <tr>
                        {columns.map(column => {

                            let fieldName = column;
                            let label = column;
                            let style = {};

                            if(typeof column === "object"){
                                fieldName = column.name;
                                label = column.label;
                                style = column.width ? {width: column.width} : {};
                            }

                            return (
                                <th key={fieldName} style={style}>{label}</th>
                            )
                        })}
                        <th key={title + "-actions"}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(record => {
                        return (
                            <tr key={record.id}>
                                {columns.map(column => {
                                    let fieldName = typeof column === "object" ? column.name : column;
                                    let key = fieldName + '-' + record.id;
                                    return (
                                        <td key={key}>{record[fieldName]}</td>
                                    )
                                })}
                                <td key={"actions" + record.id}>
                                    {/*{actions.includes("edit") && <a href="#" onClick={() => handleAction("edit", record)}>Edit</a>}
                                    {actions.includes("delete") && <a href="#" onClick={() => handleAction("delete", record)}>Delete</a>}*/}

                                    {actions.map(action => {
                                        return (
                                            <a key={record.id + "-action-" + action} href="#" onClick={() => handleAction(action, record)}>{action}</a>
                                        )
                                    })}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="pagination">
                <ReactPaginate
                    breakLabel="&#8230;"
                    previousLabel="&#9664;"
                    nextLabel="&#9658;"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    renderOnZeroPageCount={null}
                />
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
