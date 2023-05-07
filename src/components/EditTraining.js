import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditTraining(props) {
    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState({
        date: '',
        duration: '',
        activity: ''
    });

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
                    <TextField
                        value={training.date}
                        onChange={e => setTraining({ ...training, date: e.target.value })}
                        margin="dense"
                        label="Date:"
                        fullWidth
                        variant="standard"
                    />
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
                        label="Street Address"
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