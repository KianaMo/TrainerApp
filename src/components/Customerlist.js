import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import EditCustomer from "./EditCustomer";
import AddCustomer from "./AddCustomer";
import { API_URL } from "../constants";
import { useNavigate } from 'react-router-dom';

function Customerlist() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [columnDefs] = useState([
        { field: 'firstname', sortable: true, filter: true, width: 130 },
        { field: 'lastname', sortable: true, filter: true, width: 130 },
        { field: 'streetaddress', sortable: true, filter: true, width: 130 },
        { field: 'postcode', sortable: true, filter: true, width: 130 },
        { field: 'city', sortable: true, filter: true, width: 130 },
        { field: 'email', sortable: true, filter: true, width: 130 },
        { field: 'phone', sortable: true, filter: true, width: 130 },
        {
            cellRenderer: params => <EditCustomer params={params.data} updateCustomer={updateCustomer} />,
            width: 120
        },
        {
            cellRenderer: params => <Button size='small' color='error' onClick={() => deleteCustomer(params)}>
                Delete</Button>, width: 120
        },
        {
            cellRenderer: params =>
                <Button
                    className="link-button"
                    onClick={() =>
                        navigate(`/traininglist?trainingsLink=${params.data.links[2].href}&customerName=${params.data.firstname} ${params.data.lastname}&customerLink=${params.data.links[1].href}`)
                    }
                >
                    Trainings
                </Button>
            , width: 120
        }
    ])

    const getCustomer = () => {
        fetch('http://traineeapp.azurewebsites.net/api/customers')
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    alert('something wrong in GET request')
            })
            .then(data => setCustomer(data.content))
            .catch(err => console.error(err))
    }

    const addCustomer = (customer) => {
        fetch(API_URL + '/customers', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)

        })
            .then(response => {
                if (response.ok)
                    getCustomer();
                else
                    alert('something wrong: ' + response.statusText)
            })
            .catch(err => console.error(err))
    }

    const deleteCustomer = (params) => {
        if (window.confirm('Are you sure?')) {
            fetch(params.data.links[0].href, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setOpen(true);
                        setMessage("Customer deleted successfully");
                        getCustomer();
                    }
                    else {
                        alert('Something went wrong in deletion')
                    }
                })
                .catch(err => console.error(err))
        }
    }

    const updateCustomer = (updatedCustomer, url) => {
        fetch(url, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(updatedCustomer)
        })
            .then(response => {
                if (response.ok) {
                    setOpen(true);
                    setMessage("Customer updated successfully");
                    getCustomer();
                }
                else
                    alert('Something wrong')
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getCustomer();
    }, [])

    function onExportClick() {
        gridRef.current.api.exportDataAsCsv();
    }
    const gridRef = useRef();

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AddCustomer addCustomer={addCustomer} />
                <Button style={{ margin: '10px' }} variant="outlined" onClick={() => onExportClick()}>
                    Download CSV
                </Button>
            </div>
            <div className='ag-theme-material' style={{ width: '90%', height: 600, margin: 'auto' }}>
                <AgGridReact
                    rowData={customer}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
                    ref={gridRef}
                />
            </div>
            <Snackbar
                open={open}
                message={message}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
            />
        </>
    );
}

export default Customerlist;