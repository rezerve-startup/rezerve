import { Forum, CalendarViewDay, Help, Settings } from '@material-ui/icons';

export const sidebarData = [
  {
    title: 'Messages',
    path: '/messages',
    icon: <Forum />,
    cName: 'nav-text',
  },
  {
    title: 'Appointments',
    path: '/appointments',
    icon: <CalendarViewDay />,
    cName: 'nav-text',
  },
  {
    title: 'Help',
    path: '/help',
    icon: <Help />,
    cName: 'nav-text',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings />,
    cName: 'nav-text',
  },
];
