import React from 'react';
import {Box} from "@mui/material";

type Props = {
    children?: React.ReactNode
};

const Wrapper = ({children}: Props) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
            }}
        >
            {children}
        </Box>
    );
};

export default Wrapper;