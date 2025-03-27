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
        const message = response.output?.output.message ? response.output?.output.message : response.output?.message;
    
        // Se ci sono sia message che dati strutturati
        console.log('dataArrayLenght', response.output?.output?.length);
        console.log('response', response)
        if (response.output.output.length > 0) {
            const formattedSections = response.output.output.map((data, index) => {
                const companyName = data?.companyName || "Vuoto";
                const vatCode = data?.vatNumber || "Vuoto";
                const streetName = data?.address || "Vuoto";
                const region = data?.region || "Vuoto";
                const zipCode = data?.cap || "Vuoto";
                const town = data?.address?.town || "Vuoto";
                const sdiCode = data?.sdiCode || "Vuoto";
    
                return `
                    <strong>Dettagli Azienda ${index + 1}:</strong>
                    <ul>
                        <li><strong>Nome:</strong> ${companyName}</li>
                        <li><strong>Partita IVA:</strong> ${vatCode}</li>
                        <li><strong>Regione:</strong> ${region}</li>
                        <li><strong>Indirizzo:</strong> ${streetName}, ${zipCode} ${town}</li>
                        <li><strong>SDI code:</strong> ${sdiCode}</li>
                    </ul>
                `;
            }).join("<br>");
    
            return `
                ${message}<br><br>
                ${formattedSections}
            `;
        }
    
        // Se c'è solo un messaggio (message o naturalResponse), restituisci solo quello
        if (message) return `${message}`;
    
        // Fallback se non c'è nulla
        return "Nessuna informazione disponibile.";
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
                const webhookUrl = 'http://localhost:5678/webhook-test/b7e135f9-5e82-494c-93e9-98cfe2a4b207';
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
                            value: response.output,
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