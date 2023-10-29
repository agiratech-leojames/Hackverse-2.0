import { AppBar, Avatar, Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography, Badge } from '@mui/material'
import React, { useState } from 'react'
import './navBar.css'
import metamask from '../../assets/MetaMask_Fox.png'
import nft from '../../assets/nft3.webp'

import Logout from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import NetworkConnection from '../../helpers/networkConnection';
import { getWalletData, walletStatus } from '../../redux/counter/counterSlice';
import { useLocation, useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';



function NavBar() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: isWalletConnected ? '#44b700' : '#D9434E',
      color: isWalletConnected ? '#44b700' : '#D9434E',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  // const location = useLocation();

  // const dashboardPath = '/dashboard';
  // const nftPath = '/nft';
  // const bridgePath = '/bridge';

  // const isDashboardActive = location.pathname === dashboardPath;
  // const isNftActive = location.pathname === nftPath;
  // const isBridgeActive = location.pathname === bridgePath

  const [isDashboardActive, setIsDashboardActive] = useState(true);
  const [isNftActive, setIsNftActive] = useState(false);
  const [isBridgeActive, setIsBridgeActive] = useState(false);

  const handleDashboard = () => {
    setIsDashboardActive(true);
    setIsNftActive(false);
    setIsBridgeActive(false);
    navigate('/dashboard')
  };

  const handleNft = () => {
    setIsDashboardActive(false);
    setIsNftActive(true);
    setIsBridgeActive(false);
    navigate('/nft')
   };

  const handleBridge = () => {
    setIsDashboardActive(false);
    setIsNftActive(false);
    setIsBridgeActive(true);
    navigate('/bridge')
  };


  const isWalletConnected = useSelector(walletStatus);
  const { connectNetwork, logout } = NetworkConnection();
  const walletData = useSelector(getWalletData);

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <AppBar position='sticky' sx={{ bgcolor: '#D3D3D3', height: "15vh !important" }}>
      <Toolbar sx={{ display: 'flex', height: "100%", justifyContent: 'space-between', alignItems: "center" }}>

        <Box sx={{ display: 'flex', alignItems: 'center', flex: '1', ml: '1.5rem' }}>
          <Avatar
            alt="Meta Mask"
            src={nft}
            sx={{ width: 70, height: 70, cursor: 'pointer' }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flex: '6' }}>
          <Typography
            variant='h6'
            onClick={handleDashboard}
            sx={{
              color: isDashboardActive ? '#2676D2' : '#051F3F',
              cursor: 'pointer',
              fontWeight: 'bolder'
            }}
          >
            Dashboard
          </Typography>

          <Typography
            variant='h6'
            onClick={handleNft}
            sx={{
              color: isNftActive ? '#2676D2' : '#051F3F',
              
              cursor: 'pointer',
              fontWeight: 'bolder'
            }}
          >
            NFT
          </Typography>
          <Typography
            variant='h6'
            onClick={handleBridge}
            sx={{
              color: isBridgeActive ? '#2676D2' : '#051F3F',
              cursor: 'pointer',
              fontWeight: 'bolder'
            }}
          >
            Bridge
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: '2.5' }}>
          {isWalletConnected ?
            <Box onClick={logout}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '1rem',
                padding: '0 2rem',
                cursor: 'pointer',
                bgcolor: '#2676D2',
                mr: '3rem',
                bgcolor:'#051F3F'
              }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar
                  alt="Meta Mask"
                  src={metamask}
                  sx={{ width: 60, height: 60, cursor: 'pointer' }}
                />
              </StyledBadge>
              <Typography variant='subtitle2' sx={{ ml: '1rem' }}>{walletData?.account.slice(0, 4)}....{walletData?.account.slice(-4)}</Typography>
            </Box>
            :
            <Box sx={{mr: '2rem'}}> 
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar
                alt="Meta Mask"
                src={metamask}
                sx={{ width: 60, height: 60, cursor: 'pointer' }}
                onClick={connectNetwork}

              />
            </StyledBadge>
            </Box>
          }
        </Box>
        <Box sx={{ flex: '0.5' }} >
          <Tooltip>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 56, height: 56, bgcolor: '#2676D2' }} alt="Remy Sharp" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: '10%',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  )
}

export default NavBar