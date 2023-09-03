import { useState } from 'react';

import MD5 from 'crypto-js/md5';

import {
  Avatar,
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { logoSmall } from 'renderer/lib/Resources';
import EvosStore from 'renderer/lib/EvosStore';
import { logout } from 'renderer/lib/Evos';
import { useNavigate } from 'react-router-dom';

export function truncateDynamicPath(filePath: string, maxChars: number) {
  if (filePath === '') return filePath;
  const parts = filePath.split('\\');
  const fileName = parts.pop() as string;
  const driveLetter = parts.shift() as string;

  let truncatedPath = `${driveLetter}`;
  let currentChars = driveLetter.length + 1 + fileName.length;

  parts.reduce((acc, part) => {
    if (currentChars + part.length + 1 <= maxChars) {
      truncatedPath = `${acc}\\${part}`;
      currentChars += part.length + 1;
    } else if (!truncatedPath.endsWith('\\.....')) {
      truncatedPath += '\\.....';
    }
    return truncatedPath;
  }, driveLetter);

  return `${truncatedPath}\\${fileName}`;
}

export default function SettingsPage() {
  const {
    ip,
    oldIp,
    gamePort,
    setGamePort,
    exePath,
    setExePath,
    ticketEnabled,
    setTicketEnabled,
    noLogEnabled,
    setNoLogEnabled,
    activeUser,
    updateAuthenticatedUsers,
    authenticatedUsers,
    proxyEnabled,
    setProxyEnabled,
    setOldIp,
    setIp,
  } = EvosStore();

  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGamePortChange = (event: { target: { value: string } }) => {
    if (event.target.value === '') {
      setGamePort('6050');
      return;
    }
    setGamePort(event.target.value);
  };

  const signOut = () => {
    logout(activeUser?.token ?? '');
    updateAuthenticatedUsers(
      activeUser?.user as string,
      '',
      activeUser?.handle as string,
      activeUser?.banner as number,
      activeUser?.configFile as string
    );
    navigate('/login');
  };

  const handleSelectFileClick = async (config: boolean) => {
    const filePath = await window.electron.ipcRenderer.getSelectedFile(config);
    if (config) {
      updateAuthenticatedUsers(
        activeUser?.user as string,
        activeUser?.token as string,
        activeUser?.handle as string,
        activeUser?.banner as number,
        (filePath as string) || ('' as string)
      );
      return;
    }
    setExePath(filePath || '');
  };

  const handleResetClick = () => {
    authenticatedUsers.forEach(async (user) => {
      await logout(user.token);
    });
    window.electron.store.clear();
    setTimeout(() => {
      navigate('/login');
      window.location.reload();
    }, 500);
  };

  const handleDeleteClick = () => {
    authenticatedUsers.forEach(async (user) => {
      await logout(user.token);
    });
    window.electron.store.removeItem('authenticatedUsers');
    setTimeout(() => {
      window.electron.store.removeItem('activeUser');
      navigate('/login');
      window.location.reload();
    }, 500);
  };

  const handlePasswordResetClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    signOut();
  };

  return (
    <>
      <Paper elevation={3} style={{ padding: '1em', margin: '1em' }}>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <Grid item xs={9}>
            <TextField
              label="Change Password (not implemented yet)"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled
              placeholder="Enter a new password"
              margin="normal"
              type="password"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                height: '56px',
                marginTop: '8px',
                backgroundColor: (theme) => theme.palette.primary.light,
              }}
              disabled
              onClick={handlePasswordResetClick}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {ticketEnabled === 'false' && (
        <Paper elevation={3} style={{ padding: '1em', margin: '1em' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={7}>
              <TextField
                placeholder={`Atlas Reactor config file for account ${activeUser?.handle}`}
                value={truncateDynamicPath(
                  activeUser?.configFile === undefined
                    ? ''
                    : activeUser?.configFile,
                  45
                )}
                style={{ flexGrow: 1, marginRight: '1em' }}
                variant="outlined"
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Avatar
                        alt="logo"
                        variant="square"
                        src={logoSmall()}
                        sx={{
                          flexShrink: 1,
                          width: 40,
                          height: 40,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSelectFileClick(true)}
                fullWidth
                sx={{
                  height: '56px',
                  backgroundColor: (theme) => theme.palette.primary.light,
                }}
              >
                Select Config File
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      <Paper elevation={3} style={{ padding: '1em', margin: '1em' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={7}>
            <TextField
              placeholder="Atlas Reactor path"
              value={truncateDynamicPath(exePath, 45)}
              style={{ flexGrow: 1, marginRight: '1em' }}
              variant="outlined"
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar
                      alt="logo"
                      variant="square"
                      src={logoSmall()}
                      sx={{
                        flexShrink: 1,
                        width: 40,
                        height: 40,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={5}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSelectFileClick(false)}
              fullWidth
              sx={{
                height: '56px',
                backgroundColor: (theme) => theme.palette.primary.light,
              }}
            >
              Select Atlas Reactor.exe
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} style={{ padding: '1em', margin: '1em' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField
              label="IP Address (if you wish to reset this, then reset the application)"
              variant="outlined"
              value={proxyEnabled === 'true' ? oldIp : ip}
              disabled
              placeholder="Enter IP address"
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Game Port (defaults to 6050)"
              variant="outlined"
              value={gamePort}
              onChange={handleGamePortChange}
              type="number"
              placeholder="Enter game port number"
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} style={{ padding: '1em', margin: '1em' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Switch />}
                label="Enable Ticket System"
                checked={ticketEnabled === 'true'}
                onChange={() => {
                  setTicketEnabled(ticketEnabled === 'true' ? 'false' : 'true');
                }}
              />
            </FormGroup>
            <span style={{ fontSize: '0.8em' }}>
              disabling this requires AtlasReactorConfig.json to be selected and
              created (not recommended)
            </span>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} style={{ padding: '1em', margin: '1em' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Switch />}
                label="Use a proxy server (experimental)"
                checked={proxyEnabled === 'true'}
                onChange={() => {
                  if (proxyEnabled === 'true') {
                    setIp(oldIp);
                    setTimeout(() => {
                      setProxyEnabled('false');
                    }, 100);
                    signOut();
                    return;
                  }
                  setOldIp(ip);
                  setTimeout(() => {
                    setIp('arproxy.addalyn.baby');
                  }, 100);
                  setTimeout(() => {
                    setProxyEnabled('true');
                  }, 100);

                  signOut();
                }}
                disabled={
                  MD5(ip).toString() !== '625a4f5430a34d3d469dd286fe3e3ef5' &&
                  oldIp === ''
                }
              />
            </FormGroup>
            <span style={{ fontSize: '0.8em' }}>
              Use a proxy server to connect to the game. This is useful if you
              are having connection issues.
              <br /> * Toggling this will log you out.
            </span>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} style={{ padding: '1em', margin: '1em' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Switch />}
                label="Add -nolog to launch options"
                checked={noLogEnabled === 'true'}
                onChange={() => {
                  setNoLogEnabled(noLogEnabled === 'true' ? 'false' : 'true');
                }}
              />
            </FormGroup>
            <span style={{ fontSize: '0.8em' }}>
              If you&apos;re experiencing crashes across multiple accounts,
              consider trying this solution. Keep in mind, though, that while it
              might help alleviate the issue, there&apos;s also a chance it
              could potentially exacerbate the problem and lead to further
              crashes, especially if you do not use multiple accounts.
            </span>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} style={{ padding: '1em', margin: '1em' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleDeleteClick}
              sx={{ height: '56px' }}
            >
              Delete All Accounts (this will log you out)
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleResetClick}
              sx={{ height: '56px' }}
            >
              Reset Application (this will log you out)
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
