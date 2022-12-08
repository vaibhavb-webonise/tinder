import React from 'react'
import { Dialog, CircularProgress } from '@mui/material';
function LoadingScreen({ open, alertText }) {
    return (

        <Dialog open={open} className="loading-dialog">
            <div className="loading-screen">
                <CircularProgress color="secondary" className="spinner" />
                <h2>{alertText ?? 'Loading ... please Wait'} </h2>
            </div>
        </Dialog>
    )
}

export default LoadingScreen
