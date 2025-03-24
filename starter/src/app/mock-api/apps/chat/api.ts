import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
    chats as chatsData,
    contacts as contactsData,
    messages as messagesData,
    profile as profileData,
} from 'app/mock-api/apps/chat/data';
import { assign, cloneDeep, omit } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class ChatMockApi {
    private _chats: any[] = chatsData;
    private _contacts: any[] = contactsData;
    private _messages: any[] = messagesData;
    private _profile: any = profileData;


    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _httpClient: HttpClient) {
        // Register Mock API handlers
        this.registerHandlers();

        // Modify the chats array to attach certain data to it
        this._chats = this._chats.map((chat) => ({
            ...chat,
            // Get the actual contact object from the id and attach it to the chat
            contact: this._contacts.find(
                (contact) => contact.id === chat.contactId
            ),
            // Since we use same set of messages on all chats, we assign them here.
            messages: this._messages.map((message) => ({
                ...message,
                chatId: chat.id,
                contactId:
                    message.contactId === 'me'
                        ? this._profile.id
                        : chat.contactId,
                isMine: message.contactId === 'me',
            })),
        }));
    }

     private formatWebhookResponse(response: any): string {
        const data = response.output.data;
        const message = response.output.message;
    
        // Formatta i dati in un messaggio leggibile
        const formattedMessage = `
            ${message}
            <br><br>
            <strong>Dettagli Azienda:</strong>
            <ul>
                <li><strong>Nome:</strong> ${data.companyDetails.companyName}</li>
                <li><strong>Partita IVA:</strong> ${data.companyDetails.vatCode}</li>
                <li><strong>Indirizzo:</strong> ${data.address.streetName}, ${data.address.zipCode} ${data.address.town}</li>
                <li><strong>ATECO:</strong> ${data.atecoClassification.code} - ${data.atecoClassification.description}</li>
            </ul>
        `;
    
        return formattedMessage;
    } 

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Chats - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('api/apps/chat/chats').reply(() => {
            // Clone the chats
            const chats = cloneDeep(this._chats);

            // Return the response
            return [200, chats];
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Chat - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/chat')
            .reply(({ request }) => {
                // Get the chat id
                const id = request.params.get('id');

                // Clone the chats
                const chats = cloneDeep(this._chats);

                // Find the chat we need
                const chat = chats.find((item) => item.id === id);

                // Return the response
                return [200, chat];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Chat - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/chat/chat')
            .reply(({ request }) => {
                // Get the id and chat
                const id = request.body.id;
                const chat = cloneDeep(request.body.chat);

                // Prepare the updated chat
                let updatedChat = null;

                // Find the chat and update it
                this._chats.forEach((item, index, chats) => {
                    if (item.id === id) {
                        // Update the chat
                        chats[index] = assign({}, chats[index], chat);

                        // Store the updated chat
                        updatedChat = chats[index];
                    }
                });

                // Return the response
                return [200, updatedChat];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Send Message - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/chat/send-message')
            .reply(({ request }) => {
                // Get the message and chat ID
                const { chatId, messageText } = request.body;

                // Find the chat
                const chat = cloneDeep(this._chats.find((chat) => chat.id === chatId));

                // Create a new message
                const newMessage = {
                    id: String(Math.random() + 'ai-id'), // Generate a unique ID
                    chatId: chatId,
                    contactId: 'me', // Assume the message is sent by the user
                    value: messageText,
                    isMine: true,
                    createdAt: new Date(),
                };

                // Add the message to the chat
                chat.messages.push(newMessage);

                // Invia il messaggio al webhook di n8n
                const webhookUrl = 'http://localhost:5678/webhook-test/2ed0f06a-91e3-4176-8372-1b74c0a0b598';
                const payload = {
                    chatId,
                    messageText,
                    timestamp: new Date().toISOString(),
                };

                const call =  this._httpClient.post(webhookUrl, payload).subscribe({
                    next: (response: any) => {
                        console.log('Messaggio inviato al webhook di n8n:', response);
                        // Simulate an AI response
                        let aiResponse = {
                            id: String(Math.random() + 'ai-id'), // Generate a unique ID
                            chatId: chatId,
                            contactId: chat.contactId, // Assume the AI uses the contact ID of the chat
                            value: this.formatWebhookResponse(response),
                            isMine: false,
                            createdAt: new Date(),
                        }; 

                        // Add the AI response to the chat
                        chat.messages.push(aiResponse);
                    },
                    error: (error) => {
                        console.error('Errore durante l\'invio al webhook di n8n:', error);
                    },
                });

                console.log('call', call)

                // Update the chat in the mock data
                this._chats = this._chats.map((c) => (c.id === chatId ? chat : c));

                // Return the updated chat
                return [200, chat];
            });

               

        // -----------------------------------------------------------------------------------------------------
        // @ Contacts - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('api/apps/chat/contacts').reply(() => {
            // Clone the contacts
            let contacts = cloneDeep(this._contacts);

            // Sort the contacts by the name field by default
            contacts.sort((a, b) => a.name.localeCompare(b.name));

            // Omit details and attachments from contacts
            contacts = contacts.map((contact) =>
                omit(contact, ['details', 'attachments'])
            );

            // Return the response
            return [200, contacts];
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Contact Details - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/contact')
            .reply(({ request }) => {
                // Get the contact id
                const id = request.params.get('id');

                // Clone the contacts
                const contacts = cloneDeep(this._contacts);

                // Find the contact
                const contact = contacts.find((item) => item.id === id);

                // Return the response
                return [200, contact];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Profile - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('api/apps/chat/profile').reply(() => {
            // Clone the profile
            const profile = cloneDeep(this._profile);

            // Return the response
            return [200, profile];
        });
    }
}