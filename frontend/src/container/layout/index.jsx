import React from 'react'
import NavBar from './navBar'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Box, Grid, Stack } from '@mui/material'

function Layout() {
  return (
      <Box>
        <NavBar/>
        <Stack direction={"row"} >
          <Box sx={{ width: "100%", p: 5 }}>
            <Outlet />
          </Box>
        </Stack>
      </Box>
  )
}

export default Layout