import { create } from 'zustand';
/* eslint-disable no-console */
import { trackEvent } from '@aptabase/electron/renderer';

export interface AuthUser {
  user: string;
  token: string;
  handle: string;
  banner: number;
  configFile?: string;
}

export interface EvosStoreState {
  colorPrimary: string;
  colorSecondary: string;
  colorBackground: string;
  colorText: string;
  colorScrollBar: string;
  colorPaper: string;
  setColorPrimary: (color: string) => void;
  setColorSecondary: (color: string) => void;
  setColorBackground: (color: string) => void;
  setColorText: (color: string) => void;
  setColorScrollBar: (color: string) => void;
  setColorPaper: (color: string) => void;
  getFromStorage(arg0: string): any;
  mode: string;
  ip: string;
  authenticatedUsers: AuthUser[];
  activeUser: AuthUser | null;
  age: number;
  exePath: string;
  folderPath: string;
  gamePort: string;
  ticketEnabled: string;
  isDownloading: boolean;
  noLogEnabled: string;
  showAllChat: string;
  setShowAllChat: (showAllChat: string) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  init: () => void;
  toggleMode: () => void;
  setIp: (ip: string) => void;
  setAuthenticatedUsers: (
    user: string,
    token: string,
    handle: string,
    banner: number,
  ) => void;
  setGamePort: (gamePort: string) => void;
  setExePath: (exePath: string) => void;
  setFolderPath: (folderPath: string) => void;
  setTicketEnabled: (ticketEnabled: string) => void;
  setNoLogEnabled: (noLogEnabled: string) => void;
  updateAuthenticatedUsers: (
    user: string,
    token: string,
    handle: string,
    banner: number,
    configFile?: string,
  ) => void;
  switchUser: (user: string) => void;
  setDiscordId: (discord: number) => void;
  discordId: number;
  enableDiscordRPC: string;
  toggleDiscordRPC: () => void;
  isDev: boolean;
  setDev: (isDev: boolean) => void;
  gameExpanded: string;
  setGameExpanded: (gameExpanded: string) => void;
  branch: string;
  setBranch: (branch: string) => void;
  selectedArguments: Record<string, string | null>;
  setSelectedArguments: (
    selectedArguments: Record<string, string | null>,
  ) => void;
  needPatching: boolean;
  setNeedPatching: (isPatching: boolean) => void;
  locked: boolean;
  setLocked: (locked: boolean) => void;
  setOldBranch: (branch: string) => void;
  oldBranch: string;
  nobranchDownload: boolean;
  setNoBranchDownload: (nodownload: boolean) => void;
  stats: string;
  setStats: (stats: string) => void;
}

const EvosStore = create<EvosStoreState>((set, get) => ({
  isDev: false,
  stats: 'https://stats-production.evos.live/',
  colorPrimary: '#9cb8ba',
  colorSecondary: '#9cb8ba',
  colorBackground: '#000000fc',
  colorText: '#ffffff',
  colorScrollBar: '#6b6b6b',
  colorPaper: '#000000',
  mode: 'dark', // Default value while fetching from storage.
  ip: '',
  authenticatedUsers: [],
  activeUser: null,
  age: 0,
  exePath: '',
  folderPath: '',
  gamePort: '6050',
  ticketEnabled: 'false',
  isDownloading: false,
  noLogEnabled: 'false',
  showAllChat: 'true',
  discordId: 0,
  enableDiscordRPC: 'true',
  gameExpanded: 'true',
  branch: '',
  selectedArguments: {},
  needPatching: false,
  locked: false,
  oldBranch: '',
  nobranchDownload: false,

  setStats: async (stats: string) => {
    set({ stats });
  },

  setColorPrimary: async (colorPrimary: string) => {
    window.electron.ipcRenderer.setTheme(
      get().mode !== 'dark' ? get().colorPrimary : get().colorPaper,
      get().colorText,
    );
    set({ colorPrimary });
    try {
      await window.electron.store.setItem('colorPrimary', colorPrimary);
    } catch (error) {
      console.error('Error while saving colorPrimary to storage:', error);
    }
  },

  setColorSecondary: async (colorSecondary: string) => {
    window.electron.ipcRenderer.setTheme(
      get().mode !== 'dark' ? get().colorPrimary : get().colorPaper,
      get().colorText,
    );
    set({ colorSecondary });
    try {
      await window.electron.store.setItem('colorSecondary', colorSecondary);
    } catch (error) {
      console.error('Error while saving colorSecondary to storage:', error);
    }
  },
  setColorBackground: async (colorBackground: string) => {
    set({ colorBackground });
    try {
      await window.electron.store.setItem('colorBackground', colorBackground);
    } catch (error) {
      console.error('Error while saving colorBackground to storage:', error);
    }
  },

  setColorText: async (colorText: string) => {
    window.electron.ipcRenderer.setTheme(
      get().mode !== 'dark' ? get().colorPrimary : get().colorPaper,
      get().colorText,
    );
    set({ colorText });
    try {
      await window.electron.store.setItem('colorText', colorText);
    } catch (error) {
      console.error('Error while saving colorText to storage:', error);
    }
  },

  setColorPaper: async (colorPaper: string) => {
    window.electron.ipcRenderer.setTheme(
      get().mode !== 'dark' ? get().colorPrimary : colorPaper,
      get().colorText,
    );
    set({ colorPaper });
    try {
      await window.electron.store.setItem('colorPaper', colorPaper);
    } catch (error) {
      console.error('Error while saving colorPaper to storage:', error);
    }
  },

  setColorScrollBar: async (colorScrollBar: string) => {
    window.electron.ipcRenderer.setTheme(
      get().mode !== 'dark' ? get().colorPrimary : get().colorPaper,
      get().colorText,
    );
    set({ colorScrollBar });
    try {
      await window.electron.store.setItem('colorScrollBar', colorScrollBar);
    } catch (error) {
      console.error('Error while saving colorScrollBar to storage:', error);
    }
  },
  setNoBranchDownload: (nobranchDownload: boolean) => {
    set({ nobranchDownload });
  },

  setOldBranch: (branch: string) => {
    set({ oldBranch: branch });
  },

  setLocked: (locked: boolean) => {
    set({ locked });
  },

  setNeedPatching: (isPatching: boolean) => {
    set({ needPatching: isPatching });
  },

  setDiscordId: (discord: number) => {
    set({ discordId: discord });
  },
  // Helper async function to fetch values from storage
  getFromStorage: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await window.electron.store.getItem(key);
      return value || null;
    } catch (error) {
      console.error(`Error while fetching ${key} from storage:`, error);
      return null;
    }
  },

  init: async () => {
    let ip = (await get().getFromStorage('ip')) as string;
    const [
      mode,
      authenticatedUsers,
      activeUser,
      exePath,
      folderPath,
      gamePort,
      ticketEnabled,
      noLogEnabled,
      showAllChat,
      enableDiscordRPC,
      gameExpanded,
      branch,
      selectedArguments,
      colorPrimary,
      colorSecondary,
      colorBackground,
      colorText,
      colorScrollBar,
      colorPaper,
    ] = await Promise.all([
      get().getFromStorage('mode') as string,
      get().getFromStorage('authenticatedUsers') as AuthUser[],
      get().getFromStorage('activeUser') as AuthUser | null,
      get().getFromStorage('exePath') as string,
      get().getFromStorage('folderPath') as string,
      get().getFromStorage('gamePort') as string,
      get().getFromStorage('ticketEnabled') as string,
      get().getFromStorage('noLogEnabled') as string,
      get().getFromStorage('showAllChat') as string,
      get().getFromStorage('enableDiscordRPC') as string,
      get().getFromStorage('gameExpanded') as string,
      get().getFromStorage('branch') as string,
      get().getFromStorage('selectedArguments') as Record<
        string,
        string | null
      >,
      get().getFromStorage('colorPrimary') as string,
      get().getFromStorage('colorSecondary') as string,
      get().getFromStorage('colorBackground') as string,
      get().getFromStorage('colorText') as string,
      get().getFromStorage('colorScrollBar') as string,
      get().getFromStorage('colorPaper') as string,
    ]);

    let users: AuthUser[] = [];

    if (authenticatedUsers !== null && authenticatedUsers.length !== 0) {
      users = JSON.parse(authenticatedUsers.toString());
    }

    // Compatibility with old config files change ip to new values
    if (ip === 'arproxy.addalyn.baby') {
      ip = 'de.evos.live';
      get().setIp(ip);
    }
    if (ip === 'arproxy2.addalyn.baby') {
      ip = 'fr.evos.live';
      get().setIp(ip);
    }
    if (ip === 'arproxy3.addalyn.baby') {
      ip = 'fi.evos.live';
      get().setIp(ip);
    }

    set({
      mode: mode !== 'dark' && mode !== 'light' ? 'dark' : mode,
      ip: ip || '',
      authenticatedUsers: users || [],
      activeUser: activeUser || null,
      exePath: exePath || '',
      folderPath: folderPath || '',
      gamePort: gamePort || '6050',
      ticketEnabled: ticketEnabled || 'true',
      noLogEnabled: noLogEnabled || 'false',
      showAllChat: showAllChat || 'true',
      enableDiscordRPC: enableDiscordRPC || 'true',
      gameExpanded: gameExpanded || 'true',
      branch: branch || 'Original',
      selectedArguments: selectedArguments || {},
      colorPrimary: colorPrimary || '#9cb8ba',
      colorSecondary: colorSecondary || '#0000',
      colorBackground: colorBackground || '#000000fc',
      colorText: colorText || '#ffffff',
      colorScrollBar: colorScrollBar || '#6b6b6b',
      colorPaper: colorPaper || '#0000',
    });
    window.electron.ipcRenderer.setTheme(
      get().mode !== 'dark' ? get().colorPrimary : get().colorPaper,
      get().colorText,
    );
    get().switchUser(activeUser?.user || users[0]?.user || '');
  },

  setDev: (isDev: boolean) => {
    set({ isDev });
  },

  setShowAllChat: (showAllChat: string) => {
    set({ showAllChat });

    try {
      window.electron.store.setItem('showAllChat', showAllChat);
    } catch (error) {
      console.error('Error while saving showAllChat to storage:', error);
    }
  },

  toggleMode: async () => {
    const newMode = get().mode === 'dark' ? 'light' : 'dark';
    set({ mode: newMode });
    if (newMode === 'light') {
      set({ colorPrimary: '#0029ff' });
      set({ colorSecondary: '#ffffff' });
      set({ colorBackground: '#fffffffc' });
      set({ colorText: '#000000fc' });
      set({ colorScrollBar: '#0029ff' });
      set({ colorPaper: '#ffffff' });
    } else {
      set({ colorPrimary: '#9cb8ba' });
      set({ colorSecondary: '#9cb8ba' });
      set({ colorBackground: '#000000fc' });
      set({ colorText: '#ffffff' });
      set({ colorScrollBar: '#6b6b6b' });
      set({ colorPaper: '#000000' });
    }

    try {
      window.electron.ipcRenderer.setTheme(
        newMode === 'dark' ? '#0000' : '#0029ff',
        newMode !== 'dark' ? '#000000fc' : '#ffffff',
      );
      await window.electron.store.setItem('mode', newMode);
      await window.electron.store.setItem('colorPrimary', get().colorPrimary);
      await window.electron.store.setItem(
        'colorSecondary',
        get().colorSecondary,
      );
      await window.electron.store.setItem(
        'colorBackground',
        get().colorBackground,
      );
      await window.electron.store.setItem('colorText', get().colorText);
      await window.electron.store.setItem(
        'colorScrollBar',
        get().colorScrollBar,
      );
      await window.electron.store.setItem('colorPaper', get().colorPaper);
    } catch (error) {
      console.error('Error while saving mode to storage:', error);
    }
  },

  toggleDiscordRPC: async () => {
    const newMode = get().enableDiscordRPC === 'true' ? 'false' : 'true';
    set({ enableDiscordRPC: newMode });

    try {
      await window.electron.store.setItem('enableDiscordRPC', newMode);
    } catch (error) {
      console.error('Error while saving enableDiscordRPC to storage:', error);
    }
  },

  setIp: async (ip: string) => {
    set({ ip });

    trackEvent('Game Ip Changed', {
      ip,
    });

    try {
      await window.electron.store.setItem('ip', ip);
    } catch (error) {
      console.error('Error while saving ip to storage:', error);
    }
  },

  setIsDownloading: async (isDownloading: boolean) => {
    set({ isDownloading });
  },

  setExePath: async (exePath: string) => {
    set({ exePath });

    try {
      await window.electron.store.setItem('exePath', exePath);
    } catch (error) {
      console.error('Error while saving exePath to storage:', error);
    }
  },

  setFolderPath: async (folderPath: string) => {
    set({ folderPath });

    try {
      await window.electron.store.setItem('folderPath', folderPath);
    } catch (error) {
      console.error('Error while saving folderPath to storage:', error);
    }
  },

  setTicketEnabled: async (ticketEnabled: string) => {
    set({ ticketEnabled });

    try {
      await window.electron.store.setItem('ticketEnabled', ticketEnabled);
    } catch (error) {
      console.error('Error while saving ticketEnabled to storage:', error);
    }
  },

  setNoLogEnabled: async (noLogEnabled) => {
    set({ noLogEnabled });
    try {
      await window.electron.store.setItem('noLogEnabled', noLogEnabled);
    } catch (error) {
      console.error('Error while saving noLogEnabled to storage:', error);
    }
  },

  setGamePort: async (gamePort: string) => {
    set({ gamePort });

    try {
      await window.electron.store.setItem('gamePort', gamePort);
    } catch (error) {
      console.error('Error while saving gamePort to storage:', error);
    }
  },

  setAuthenticatedUsers: async (
    user: string,
    token: string,
    handle: string,
    banner: number,
  ) => {
    const currentAuthenticatedUsers = get().authenticatedUsers;
    const updatedAuthenticatedUsers = [
      ...currentAuthenticatedUsers,
      { user, token, handle, banner },
    ];
    set({ authenticatedUsers: updatedAuthenticatedUsers });

    try {
      await window.electron.store.setItem(
        'authenticatedUsers',
        JSON.stringify(updatedAuthenticatedUsers),
      );
    } catch (error) {
      console.error('Error while saving authenticatedUsers to storage:', error);
    }
  },

  updateAuthenticatedUsers: async (
    user: string,
    token: string,
    handle: string,
    banner: number,
    configFile?: string,
  ) => {
    const currentAuthenticatedUsers = get().authenticatedUsers;
    if (currentAuthenticatedUsers !== null) {
      const updatedAuthenticatedUsers = currentAuthenticatedUsers.map(
        (authUser: AuthUser) => {
          if (authUser.user === user) {
            return { user, token, handle, banner, configFile } as AuthUser;
          }
          return authUser as AuthUser;
        },
      );
      set({ authenticatedUsers: updatedAuthenticatedUsers });

      try {
        await window.electron.store.setItem(
          'authenticatedUsers',
          JSON.stringify(updatedAuthenticatedUsers),
        );
      } catch (error) {
        console.error(
          'Error while saving authenticatedUsers to storage:',
          error,
        );
      }
    }

    // update user
    get().switchUser(user);
  },

  switchUser: async (user: string) => {
    if (user !== undefined && user === '') {
      await window.electron.store.removeItem('activeUser');
    }
    const currentAuthenticatedUsers = get().authenticatedUsers;

    if (
      currentAuthenticatedUsers !== null &&
      currentAuthenticatedUsers.length !== 0
    ) {
      const selectedUser = currentAuthenticatedUsers.find(
        (authUser) =>
          authUser.user === user || authUser.user === user.toLowerCase(), // Comaptibility with old config files
      );

      if (selectedUser) {
        set({ activeUser: selectedUser });

        try {
          await window.electron.store.setItem('activeUser', selectedUser);
        } catch (error) {
          console.error('Error while saving activeUser to storage:', error);
        }
      }
    }
  },

  setGameExpanded: async (gameExpanded: string) => {
    set({ gameExpanded });

    try {
      await window.electron.store.setItem('gameExpanded', gameExpanded);
    } catch (error) {
      console.error('Error while saving gameExpanded to storage:', error);
    }
  },

  setBranch: async (branch: string) => {
    set({ branch });

    try {
      await window.electron.store.setItem('branch', branch);
    } catch (error) {
      console.error('Error while saving branch to storage:', error);
    }
  },

  setSelectedArguments: async (
    selectedArguments: Record<string, string | null>,
  ) => {
    set({ selectedArguments });

    try {
      await window.electron.store.setItem(
        'selectedArguments',
        selectedArguments,
      );
    } catch (error) {
      console.error('Error while saving selectedArguments to storage:', error);
    }
  },
}));

// Call the init function to fetch and set the values from storage.
EvosStore.getState().init();

export default EvosStore;
