// Contact Management App - Main Application Logic
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { listContacts, getContact, createContact } from './graphql/queries';
import awsmobile from './aws-exports';

// Configure Amplify
Amplify.configure(awsmobile);

const client = generateClient();

class ContactApp {
    constructor() {
        this.contacts = [];
        this.init();
    }

    init() {
        this.loadContacts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Create contact form submission
        document.getElementById('createContactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createContact();
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            const createModal = document.getElementById('createModal');
            const detailModal = document.getElementById('detailModal');
            
            if (e.target === createModal) {
                this.closeCreateModal();
            }
            if (e.target === detailModal) {
                this.closeDetailModal();
            }
        });
    }

    async loadContacts() {
        try {
            this.showLoading();
            const result = await client.graphql({
                query: listContacts
            });
            
            this.contacts = result.data.listContacts || [];
            this.renderContacts();
        } catch (error) {
            console.error('Error loading contacts:', error);
            this.showError('Failed to load contacts. Please try again.');
        }
    }

    renderContacts() {
        const container = document.getElementById('contacts-container');
        
        if (this.contacts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-address-book"></i>
                    <h3>No contacts found</h3>
                    <p>Start by creating your first contact!</p>
                </div>
            `;
            return;
        }

        const contactsHtml = this.contacts.map(contact => `
            <div class="contact-card" onclick="app.viewContact('${contact.recordId}')">
                <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
                <div class="contact-email">
                    <i class="fas fa-envelope"></i>
                    ${contact.emailAddress}
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="contacts-grid">
                ${contactsHtml}
            </div>
        `;
    }

    async viewContact(recordId) {
        try {
            this.openDetailModal();
            this.showDetailLoading();
            
            const result = await client.graphql({
                query: getContact,
                variables: { recordId }
            });
            
            this.renderContactDetail(result.data.getContact);
        } catch (error) {
            console.error('Error loading contact details:', error);
            this.showDetailError('Failed to load contact details. Please try again.');
        }
    }

    renderContactDetail(contact) {
        const content = document.getElementById('contactDetailContent');
        
        const formatValue = (value) => value || 'Not provided';
        
        content.innerHTML = `
            <div class="contact-detail">
                <div class="contact-detail-label">First Name</div>
                <div class="contact-detail-value">${contact.firstName}</div>
            </div>
            
            <div class="contact-detail">
                <div class="contact-detail-label">Last Name</div>
                <div class="contact-detail-value">${contact.lastName}</div>
            </div>
            
            <div class="contact-detail">
                <div class="contact-detail-label">Date of Birth</div>
                <div class="contact-detail-value">${contact.dateOfBirth}</div>
            </div>
            
            <div class="contact-detail">
                <div class="contact-detail-label">Email Address</div>
                <div class="contact-detail-value">${contact.emailAddress}</div>
            </div>
            
            <div class="contact-detail">
                <div class="contact-detail-label">Phone Number</div>
                <div class="contact-detail-value">${formatValue(contact.phoneNumber)}</div>
            </div>
            
            <div class="contact-detail">
                <div class="contact-detail-label">Home Address</div>
                <div class="contact-detail-value">${formatValue(contact.homeAddress)}</div>
            </div>
            
            <div class="contact-detail">
                <div class="contact-detail-label">Favorite Color</div>
                <div class="contact-detail-value">${formatValue(contact.favoriteColor)}</div>
            </div>
            
            <div class="contact-detail">
                <div class="contact-detail-label">Record ID</div>
                <div class="contact-detail-value" style="font-family: monospace; font-size: 0.9rem;">${contact.recordId}</div>
            </div>
        `;
    }

    async createContact() {
        try {
            const form = document.getElementById('createContactForm');
            const formData = new FormData(form);
            
            const contactData = {
                firstName: formData.get('first-name'),
                lastName: formData.get('last-name'),
                dateOfBirth: formData.get('date-of-birth'),
                emailAddress: formData.get('email-address'),
                phoneNumber: formData.get('phone-number') || null,
                homeAddress: formData.get('home-address') || null,
                favoriteColor: formData.get('favorite-color') || null
            };

            const result = await client.graphql({
                query: createContact,
                variables: contactData
            });

            this.showSuccess('Contact created successfully!');
            this.closeCreateModal();
            form.reset();
            this.loadContacts(); // Reload the contacts list
        } catch (error) {
            console.error('Error creating contact:', error);
            this.showError('Failed to create contact. Please try again.');
        }
    }

    showLoading() {
        document.getElementById('contacts-container').innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading contacts...
            </div>
        `;
    }

    showDetailLoading() {
        document.getElementById('contactDetailContent').innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading contact details...
            </div>
        `;
    }

    showDetailError(message) {
        document.getElementById('contactDetailContent').innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i> ${message}
            </div>
        `;
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        const container = document.getElementById('message-container');
        container.innerHTML = `
            <div class="${type}">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
                ${message}
            </div>
        `;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }
    }

    openCreateModal() {
        document.getElementById('createModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeCreateModal() {
        document.getElementById('createModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('createContactForm').reset();
    }

    openDetailModal() {
        document.getElementById('detailModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeDetailModal() {
        document.getElementById('detailModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Global functions for HTML onclick handlers
function openCreateModal() {
    app.openCreateModal();
}

function closeCreateModal() {
    app.closeCreateModal();
}

function closeDetailModal() {
    app.closeDetailModal();
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ContactApp();
});
