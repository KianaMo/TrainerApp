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

export default function AddTraining({ addTraining }) {
    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState({
        date: Dayjs(),
        duration: '',
        activity: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        addTraining(training);
        setOpen(false);
        setTraining({
            date: '',
            duration: '',
            activity: ''
        })
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                New Training
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={training.date}
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