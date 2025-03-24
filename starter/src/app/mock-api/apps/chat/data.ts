/* eslint-disable */
import { DateTime } from 'luxon';

/* Get the current instant */
const now = DateTime.now();

/**
 * Attachments are common and will be filled from here
 * to keep the demo data maintainable.
 */
const _attachments = {
    media: [
        'images/cards/01-320x200.jpg',
        'images/cards/02-320x200.jpg',
        'images/cards/03-320x200.jpg',
        'images/cards/04-320x200.jpg',
        'images/cards/05-320x200.jpg',
        'images/cards/06-320x200.jpg',
        'images/cards/07-320x200.jpg',
        'images/cards/08-320x200.jpg',
    ],
    docs: [],
    links: [],
};

/**
 * Messages between the user and the AI
 */
export const messages = [
    {
        id: 'eb82cf4b-fa93-4bf4-a88a-99e987ddb7ea',
        chatId: 'ai-chat',
        contactId: 'ai',
        value: 'Hello! How can I assist you today?',
        createdAt: now
            .minus({ week: 1 })
            .set({
                hour: 19,
                minute: 4,
            })
            .toISO(),
    }
];

/**
 * Chat with the AI
 */
export const chats = [
    {
        id: 'ai-chat',
        contactId: 'ai',
        unreadCount: 0,
        muted: false,
        lastMessage: 'Sure, I’m here to help. What do you need?',
        lastMessageAt: now.toFormat('dd/MM/yyyy'),
    },
];

/**
 * AI Contact
 */
export const contacts = [
    {
        id: 'ai',
        avatar: 'images/avatars/ai-avatar.jpg', // You can add an AI avatar image
        name: 'AI Assistant',
        about: "Hi there! I'm your AI assistant.",
        details: {
            emails: [
                {
                    email: 'ai.assistant@company.com',
                    label: 'Work',
                },
            ],
            phoneNumbers: [],
            title: 'AI Assistant',
            company: 'Company',
            birthday: null,
            address: null,
        },
        attachments: _attachments,
    },
];

/**
 * User Profile
 */
export const profile = {
    id: 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df',
    name: 'Brian Hughes',
    email: 'hughes.brian@company.com',
    avatar: 'images/avatars/brian-hughes.jpg',
    about: "Hi there! I'm using FuseChat.",
};