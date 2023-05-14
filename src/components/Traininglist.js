import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import AddTraining from "./AddTraining";
import EditTraining from "./EditTraining";
import { API_URL } from "../constants";
import Dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';



function Traininglist() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let trainingsLink = searchParams.get('trainingsLink')
    if (trainingsLink && trainingsLink.startsWith('http://')) {
        trainingsLink = trainingsLink.replace('http://', 'https://');
    }
    let customerName = searchParams.get('customerName');
    let customerLink = searchParams.get('customerLink');
    if (customerLink && customerLink.startsWith('http://')) {
        customerLink = customerLink.replace('http://', 'https://');
    }

    let editablePage = true;
    if (!trainingsLink) {
        trainingsLink = 'https://traineeapp.azurewebsites.net/api/trainings';
        editablePage = false;
    }
    const [trainings, setTrainings] = useState([]);
    const [toggleCustomers, setToggleCustomers] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const dateFormatter = (params) => {
        const date = params.value;
        return Dayjs(date).format('DD.MM.YYYY HH:mm');
    }

    const [columnDefs] = useState([
        { field: 'date', sortable: true, filter: true, valueFormatter: dateFormatter },
        { field: 'duration', sortable: true, filter: true },
        { field: 'activity', sortable: true, filter: true },
        { field: 'name', sortable: true, filter: true, hide: editablePage },
        {
            cellRenderer: params => <EditTraining params={params.data} updateTraining={updateTraining} />,
            width: 120, hide: !editablePage
        },
        {
            cellRenderer: params => <Button size='small' color='error' onClick={() => deleteTraining(params)}>
                Delete</Button>, width: 120, hide: !editablePage
        }
    ])

    const getTrainings = () => {
        fetch(trainingsLink)
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    alert('something wrong in GET request')
            })
            .then(data => {
                if (data.content.length > 0 && data.content[0].hasOwnProperty("date")) {
                    setTrainings(data.content);
                    setToggleCustomers(current => !current);
                } else {
                    setTrainings([]);
                }
            })
            .catch(err => console.error(err))
    }

    const getCustomerName = async (link) => {
        let httpsLink = link;
        if (httpsLink && httpsLink.startsWith('http://')) {
            httpsLink = httpsLink.replace('http://', 'https://');
        }
        try {
            const response = await fetch(httpsLink);
            const data = await response.json();
            return data.firstname + " " + data.lastname;
        }
        catch (error) {
            console.log("error fetching the customer name!");
            return "";
        }
    }

    const addTraining = (training) => {
        const a = customerLink;
        const b = trainingsLink;
        if (editablePage) {
            training.customer = customerLink;
        }

        fetch('https://traineeapp.azurewebsites.net/api/trainings', {
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
        let httpsLink = params.data.links[0].href;
        if (httpsLink && httpsLink.startsWith('http://')) {
            httpsLink = httpsLink.replace('http://', 'https://');
        }
        if (window.confirm('Are you sure?'))
            fetch(httpsLink, { method: 'DELETE' })
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
        let httpsLink = url;
        if (httpsLink && httpsLink.startsWith('http://')) {
            httpsLink = httpsLink.replace('http://', 'https://');
        }
        fetch(httpsLink, {
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
        if (!editablePage) {
            getCustomerNames();
        }
    }, [toggleCustomers])

    function onExportClick() {
        gridRef.current.api.exportDataAsCsv();
    }
    const gridRef = useRef();

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {editablePage ?
                    <h3 style={{ margin: '10px' }} >Trainings for {customerName}</h3> : <h3>Trainings for All Customers</h3>}
                {editablePage &&
                    <AddTraining addTraining={addTraining} />}
                <Button style={{ margin: '10px' }} variant="outlined" onClick={() => onExportClick()}>
                    Download CSV
                </Button>
            </div>
            {trainings.length > 0 ? (
                <div className="ag-theme-material" style={{ width: "90%", height: 600, margin: "auto" }}>
                    <AgGridReact
                        rowData={trainings}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={10}
                        ref={gridRef}
                    />
                </div>
            ) : (
                <div>No trainings available.</div>
            )}
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