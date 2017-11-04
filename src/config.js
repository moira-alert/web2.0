// @flow
import type { Config } from './Domain/Config';
const config: Config = {
    apiUrl: '/api',
    supportEmail: 'devops@skbkontur.ru',
    contacts: [
        { type: 'email', validation: '^.+@.+\\..+$', icon: 'email' },
        {
            type: 'phone',
            validation: '^9\\d{9}$',
            icon: 'phone',
            title: 'kontur sms',
            help: 'phone number format 9*********',
        },
        { type: 'pushover', validation: '', img: 'pushover.ico', title: 'pushover user key' },
        { type: 'slack', validation: '^[@#][a-zA-Z0-9-_]+', img: 'slack.ico', title: 'slack #channel / @user' },
        {
            type: 'telegram',
            validation: '',
            img: 'telegram.ico',
            title: '#channel, @username, group',
            help:
                'required to grant @KonturMoiraBot admin privileges for channels,\nor /start command in groups and personal chats',
        },
        {
            type: 'twilio voice',
            validation: '^\\+79\\d{9}$',
            img: 'twilio_voice.ico',
            title: 'twilio voice',
            help: 'phone number format +79*********',
        },
    ],
    paging: {
        triggerList: 20,
        eventHistory: 100,
    },
};
export default config;
