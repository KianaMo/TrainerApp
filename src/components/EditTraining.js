import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function EditTraining(props) {
    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState({
        date: '',
        duration: '',
        activity: ''
    });

    const dateFormatter = (params) => {
        const date = params.value;
        return Dayjs(date).format('DD.MM.YYYY HH:mm');
    }

    const convertedDate = Dayjs('').format('MM/DD/YYYY');
    //const convertedDate = dateFormatter(Dayjs(training.date));


    const handleClickOpen = () => {
        setTraining(
            {
                date: props.params.date,
                duration: props.params.duration,
                activity: props.params.activity
            }
        )
        console.log(props.params);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        props.updateTraining(training, props.params.links[0].href);
        setOpen(false);
    }

    return (
        <div>
            <Button size="small" onClick={handleClickOpen}>
                Edit
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Training information</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={convertedDate}
                            onChange={newDate => setTraining({ ...training, date: newDate })}
                        />
                    </LocalizationProvider>
                    <TextField
                        value={training.duration}
                        onChange={e => setTraining({ ...training, duration: e.target.value })}
                        margin="dense"
                        label="Duration"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        value={training.activity}
                        onChange={e => setTraining({ ...training, activity: e.target.value })}
                        margin="dense"
                        label="Activity"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}