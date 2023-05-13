import './TrainingCalendar.css';
import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import FullCalendar from "@fullcalendar/react";
import DayGridPlugin from "@fullcalendar/daygrid";
import TimeGridPlugin from "@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import MultiMonthPlugin from '@fullcalendar/multimonth';



function TrainingCalendar() {
    const [sessions, setSessions] = useState([{
        start: new Date(),
        end: new Date(),
        title: ''
    }])

    useEffect(() => {
        fetch('https://traineeapp.azurewebsites.net/gettrainings', {
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Error fetching training data');
                }
            }).then(responseData => {
                let trainingsData = [];
                responseData.map(item => {
                    const startDate = new Date(item.date);
                    const durationInMinutes = parseInt(item.duration, 10);
                    const endDate = new Date(startDate);
                    endDate.setMinutes(startDate.getMinutes() + durationInMinutes);
                    trainingsData.push(
                        {
                            start: startDate,
                            end: endDate,
                            title: item.activity +
                                ': ' + item.customer.firstname +
                                ' ' + item.customer.lastname,
                        }
                    )
                })
                setSessions(trainingsData)
            }).catch(err => console.error(err))
    }, [])

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
            <FullCalendar
                plugins={[
                    TimeGridPlugin,
                    DayGridPlugin,
                    MultiMonthPlugin,
                    InteractionPlugin
                ]}
                initialView={"multiMonthYear"}
                headerToolbar={{
                    start: "prev,today,next",
                    center: "title",
                    end: "timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear",
                }}
                events={sessions}
                selectable='true'
                height={"auto"}

            />
        </Container>

    );
}

export default TrainingCalendar;