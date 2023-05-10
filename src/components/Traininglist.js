import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import AddTraining from "./AddTraining";
import EditTraining from "./EditTraining";
import { API_URL } from "../constants";



function Traininglist() {
    const [trainings, setTrainings] = useState([]);
    const [toggleCustomers, setToggleCustomers] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [columnDefs] = useState([
        { field: 'date', sortable: true, filter: true },
        { field: 'duration', sortable: true, filter: true },
        { field: 'activity', sortable: true, filter: true },
        { field: 'name', sortable: true, filter: true, width: 100 },
        {
            cellRenderer: params => <EditTraining params={params.data} updateTraining={updateTraining} />,
            width: 120
        },
        {
            cellRenderer: params => <Button size='small' color='error' onClick={() => deleteTraining(params)}>
                Delete</Button>, width: 120
        }
    ])

    const getTrainings = () => {
        fetch('http://traineeapp.azurewebsites.net/api/trainings')
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    alert('something wrong in GET request')
            })
            .then(data => {
                setTrainings(data.content);
                setToggleCustomers(current => !current);
            })
            .catch(err => console.error(err))
    }

    const getCustomerName = async (link) => {
        try {
            const response = await fetch(link);
            const data = await response.json();
            return data.firstname;
        }
        catch (error) {
            console.log("error fetching the customer name!");
            return "";
        }
    }

    const addTraining = (training) => {
        fetch(API_URL + '/trainings', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(training)

        })
            .then(response => {
                if (response.ok)
                    getTrainings();
                else
                    alert('something wrong: ' + response.statusText)
            })
            .catch(err => console.error(err))
    }

    const deleteTraining = (params) => {
        if (window.confirm('Are you sure?'))
            fetch(params.data.links[0].href, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setOpen(true);
                        setMessage("Training deleted successfully");
                        getTrainings();
                    }
                    else {
                        alert('Something went wrong in deletion')
                    }
                })
                .catch(err => console.error(err))
    }

    const updateTraining = (updatedTraining, url) => {
        fetch(url, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(updatedTraining)
        })
            .then(response => {
                if (response.ok) {
                    setOpen(true);
                    setMessage("Training updated successfully");
                    getTrainings();
                }
                else
                    alert('Something wrong')
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getTrainings();
    }, [])

    useEffect(() => {
        const getCustomerNames = async () => {
            const updatedItems = [];
            for (const training of trainings) {
                const name = await getCustomerName(training.links[2].href);
                updatedItems.push({ ...training, name });
            }
            setTrainings(updatedItems);
        };

        getCustomerNames();
    }, [toggleCustomers])

    return (
        <>
            <AddTraining addTraining={addTraining} />
            <div className='ag-theme-material' style={{ width: '90%', height: 600, margin: 'auto' }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
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

export default Traininglist;