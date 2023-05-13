import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { ResponsiveBar } from '@nivo/bar'


function TrainingStatistic() {
    const [customerList, setCustomerList] = useState([]);
    const [trainingNames, setTrainingNames] = useState([]);

    const [trainingList, setTrainingList] = useState([]);
    const [customerNames, setCustomerNames] = useState([]);

    const updateCustomerList = (trainingsData, tempTrainingNames) => {
        const groupedByCustomer = {};
        for (const training of trainingsData) {
            const { name, duration, customer } = training;
            if (groupedByCustomer[customer]) {
                groupedByCustomer[customer].push({ name, duration });
            } else {
                groupedByCustomer[customer] = [{ name, duration }];
            }
        }
        const uniqueTrainingNames = Array.from(new Set(tempTrainingNames.map((training) => training)));
        setTrainingNames(uniqueTrainingNames);

        const updatedCustomerList = [];
        for (const customer in groupedByCustomer) {
            const trainingItems = {};

            // Initialize all training durations as zero
            for (const name of trainingNames) {
                trainingItems[name] = 0;
            }

            // Update the durations for existing trainings
            for (const training of groupedByCustomer[customer]) {
                trainingItems[training.name] = training.duration;
            }

            updatedCustomerList.push({ customer, ...trainingItems });
        }
        setCustomerList(updatedCustomerList);
    }

    const updateTrainingList = (trainingsData, tempCustomerNames) => {
        const groupedByTraining = {};
        for (const training of trainingsData) {
            const { name, duration, customer } = training;
            if (groupedByTraining[name]) {
                groupedByTraining[name].push({ customer, duration });
            } else {
                groupedByTraining[name] = [{ customer, duration }];
            }
        }
        const uniqueCustomerNames = Array.from(new Set(tempCustomerNames.map((customer) => customer)));
        setCustomerNames(uniqueCustomerNames);

        const updatedTrainingList = [];
        for (const training in groupedByTraining) {
            const customerItems = {};

            // Initialize all training durations as zero
            for (const name of customerNames) {
                customerItems[name] = 0;
            }

            // Update the durations for existing trainings
            for (const customer of groupedByTraining[training]) {
                customerItems[customer.customer] = customer.duration;
            }

            updatedTrainingList.push({ training, ...customerItems });
        }
        setTrainingList(updatedTrainingList);
    }

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
                let tempCustomerNames = [];
                let tempTrainingNames = [];

                responseData.map(item => {
                    const durationInMinutes = parseInt(item.duration, 10);
                    tempCustomerNames.push(item.customer.firstname + ' ' + item.customer.lastname)
                    tempTrainingNames.push(item.activity);
                    trainingsData.push(
                        {
                            name: item.activity,
                            duration: durationInMinutes,
                            customer: item.customer.firstname +
                                ' ' + item.customer.lastname,
                        }
                    )
                })

                updateCustomerList(trainingsData, tempTrainingNames);
                updateTrainingList(trainingsData, tempCustomerNames);

            }).catch(err => console.error(err))
    }, [])

    return (
        <div>
            <h2>Customers Chart</h2>
            <Container sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', height: '300px' }}>
                <ResponsiveBar
                    data={customerList}
                    keys={trainingNames}
                    indexBy="customer"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ scheme: 'nivo' }}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: '#38bcb2',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: '#eed312',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'customer',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'duration',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    role="application"
                    ariaLabel="Nivo bar chart demo"
                    barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
                />
            </Container>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '80%', height: '1px', backgroundColor: '#000', margin: '20px 0' }}></div>
            </div>
            <h2>Trainings Chart</h2>
            <Container sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', height: '300px' }}>
                <ResponsiveBar
                    data={trainingList}
                    keys={customerNames}
                    indexBy="training"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ scheme: 'nivo' }}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: '#38bcb2',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: '#eed312',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'training',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'duration',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    role="application"
                    ariaLabel="Nivo bar chart demo"
                    barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
                />
            </Container>
        </div>
    );
}

export default TrainingStatistic;