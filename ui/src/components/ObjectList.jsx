import './ObjectList.css';

import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

export const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleConfirm = () => {
        onConfirm({ name, description });
    }

    const handleCancel = () => {
        onCancel();
    }

    return (
        <>
            <h1>Are you sure?</h1>
            <p>{message}</p>
            <div className="dialog-buttons">
                <button className="btn cancel" onClick={handleCancel}>Cancel</button>
                <button className="btn" onClick={handleConfirm}>Continue</button>
            </div>
        </>
    )
}

const ObjectList = ({ title, description, tabs, columns, actions, globalActions, search, data, pageSize = 10, onAction }) => {

    const [pageData, setPageData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [activeTab, setActiveTab] = useState(tabs ? tabs[0].id : null);
    const [searchText, setSearchText] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);


    const handleAction = (action, confirm, object) => {
        
        if(confirm){
            const handleConfirm = () => {
                onAction(action, object);
                setShowDialog(false);
                setDialogContent(null);
            };

            setShowDialog(true);
            setDialogContent(<ConfirmationDialog title={title} message={confirm} onConfirm={handleConfirm} onCancel={handleCancel} />);

        }else if (onAction) {
            onAction(action, object);
        }
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
    }

    const handleSearch = (text) => {
        setSearchText(text);

        let filteredData = data.filter(record => {
            //todo: implement tab filtering

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

    const handleCancel = () => {
        setShowDialog(false);
        setDialogContent(null);
    }
    
    const handlePageClick = (event) => {
        const newOffset = (event.selected * pageSize) % data.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    useEffect(() => {

        console.log('filteredData');
        console.log(filteredData);

        const endOffset = itemOffset + pageSize;

        console.log('endOffset');
        console.log(endOffset);

        let pageData = filteredData.slice(itemOffset, endOffset);

        console.log('pageData');
        console.log(pageData);

        setPageData(pageData);
        setPageCount(Math.ceil(filteredData.length / pageSize));
    }, [itemOffset, pageSize, filteredData, showDialog]);

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
                                    <button key={globalAction.name} className={"btn global-action-" + globalAction.name} onClick={() => handleAction(globalAction.name, globalAction.confirmation)}>{globalAction.label}</button>
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
                                    {actions.map(action => {
                                        return (
                                            <a key={record.id + "-action-" + action.name} href="#" onClick={() => handleAction(action.name, action.confirmation, record)}>{action.label}</a>
                                        )
                                    })}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {pageData.length == 0 && <div className="empty">
                <p>No {title} found.</p>
            </div>}

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
