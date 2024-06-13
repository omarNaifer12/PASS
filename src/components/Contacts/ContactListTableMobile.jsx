// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// Custom Hooks Imports
import useNotification from '@hooks/useNotification';
// Util Imports
import { saveToClipboard } from '@utils';
// Component Imports
import ContactProfileIcon from './ContactProfileIcon';

// JSDocs
const ContactListTableMobile = ({ contacts, deleteContact, handleSendMessage }) => {
  const { addNotification } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const theme = useTheme();

  const handleClick = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(contact.webId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleMenuItemClick = (action, contact) => () => {
    action(contact);
    handleClose();
  };

  const handleProfileClick = (contactData) => {
    <ContactProfileIcon contact={contactData} />;
  };

  const iconSize = {
    height: '24px',
    width: '24px'
  };

  const iconStyling = {
    width: '100%'
  };

  return (
    <Box>
      <Box
        sx={{
          my: '15px',
          p: '15px',
          background: theme.palette.primary.light,
          color: '#fff',
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        <Box>
          <Typography>Name</Typography>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: 15,
              transform: 'translateY(-50%)'
            }}
          >
            <Typography>Actions</Typography>
          </Box>
        </Box>
      </Box>
      {contacts?.map((contact) => (
        <Box key={contact.webId}>
          <Card
            sx={{
              my: '5px',
              position: 'relative'
            }}
          >
            <CardContent>
              <Box>
                <Typography variant="body1" component="div" noWrap>
                  {contact.givenName || ''} {contact.familyName || ''}
                </Typography>
                <Typography variant="body2" component="div" noWrap color="text.secondary">
                  {contact.webId}
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 5,
                    transform: 'translateY(-50%)'
                  }}
                >
                  <IconButton
                    id="actions-icon-button"
                    aria-controls={openMenu === contact.webId ? 'actions-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu === contact.webId ? 'true' : undefined}
                    onClick={(event) => handleClick(event, contact)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>

            <Menu
              id="actions-menu"
              anchorEl={anchorEl}
              open={openMenu === contact.webId}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'actions-icon-button'
              }}
            >
              <MenuItem
                component={Button}
                onClick={handleMenuItemClick(
                  () =>
                    saveToClipboard(contact.webId, 'webId copied to clipboard', addNotification),
                  contact
                )}
                startIcon={<ContentCopyIcon sx={iconSize} />}
                sx={iconStyling}
              >
                Copy WebId
              </MenuItem>
              <MenuItem
                component={Button}
                onClick={handleMenuItemClick(handleProfileClick, contact)}
                startIcon={<ContactProfileIcon contact={contact} sx={iconSize} />}
                sx={iconStyling}
              >
                Profile
              </MenuItem>
              <MenuItem
                component={Button}
                onClick={handleMenuItemClick(handleSendMessage, contact)}
                startIcon={
                  <SendIcon
                    sx={{
                      ...iconSize,
                      color: '#808080',
                      cursor: 'pointer'
                    }}
                  />
                }
                sx={iconStyling}
              >
                Message
              </MenuItem>
              <MenuItem
                component={Button}
                onClick={handleMenuItemClick(deleteContact, contact)}
                startIcon={<DeleteOutlineOutlinedIcon sx={iconSize} />}
                sx={iconStyling}
              >
                Delete
              </MenuItem>
            </Menu>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default ContactListTableMobile;
