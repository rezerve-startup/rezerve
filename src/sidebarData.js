import React from 'react'
import * as AiIcons from 'react-icons/ai'
import * as BiIcons from 'react-icons/bi'
import * as MdIcons from 'react-icons/md'
import * as FiIcons from 'react-icons/fi'

export const sidebarData = [
    {
        title: 'Messages',
        path: '/messages',
        icon: <AiIcons.AiOutlineMessage />,
        cName: 'nav-text'
    },
    {
        title: 'Appointments',
        path: '/appointments',
        icon: <BiIcons.BiNotepad />,
        cName: 'nav-text'
    },
    {
        title: 'Help',
        path: '/help',
        icon: <BiIcons.BiHelpCircle />,
        cName: 'nav-text'
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <FiIcons.FiSettings />,
        cName: 'nav-text'
    },
]