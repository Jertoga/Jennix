// forum.test.js
import { jest } from '@jest/globals';

// Mock Firebase modules
jest.mock('https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js', () => ({
  initializeApp: jest.fn(() => ({}))
}));

jest.mock('https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null
  })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn()
}));

jest.mock('https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  addDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn()
}));

// Import Firebase modules for accessing in tests
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  onAuthStateChanged, signOut 
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  query, orderBy, setDoc, doc, getDoc 
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';

describe('Jennix Forum Functionality', () => {
  // Setup DOM elements
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="authButton" class="sign-in-button">Sign In</button>
      <button id="logoutBtn">Log Out</button>
      <section id="forumSection" style="display:none;">
        <textarea id="postText"></textarea>
        <button id="postBtn">Post</button>
        <div id="posts"></div>
      </section>
      <form id="signInForm">
        <input type="email" id="signInEmail" />
        <input type="password" id="signInPassword" />
      </form>
      <form id="signUpForm">
        <input type="text" id="signUpUsername" />
        <input type="email" id="signUpEmail" />
        <input type="password" id="signUpPassword" />
      </form>
      <div id="signInModal" class="modal"></div>
      <div id="signUpModal" class="modal"></div>
    `;
  });

  // Clean up after each test
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Authentication', () => {
    test('sign in form submits with correct credentials', async () => {
      // Setup
      const email = 'test@example.com';
      const password = 'password123';
      document.getElementById('signInEmail').value = email;
      document.getElementById('signInPassword').value = password;
      
      // Mock successful sign-in
      signInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: '123' } });
      
      // Setup modal close function
      window.closeSignInModal = jest.fn();
      
      // Simulate form submission
      const event = { preventDefault: jest.fn() };
      await document.getElementById('signInForm').onsubmit(event);
      
      // Assertions
      expect(event.preventDefault).toHaveBeenCalled();
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), 
        email, 
        password
      );
      expect(window.closeSignInModal).toHaveBeenCalled();
    });
    
    test('sign in form shows error on failure', async () => {
      // Setup
      const error = new Error('Invalid credentials');
      signInWithEmailAndPassword.mockRejectedValueOnce(error);
      
      // Mock alert
      window.alert = jest.fn();
      
      // Simulate form submission
      const event = { preventDefault: jest.fn() };
      await document.getElementById('signInForm').onsubmit(event);
      
      // Assertions
      expect(event.preventDefault).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(`Error: ${error.message}`);
    });
    
    test('sign up form validates username length', async () => {
      // Setup
      document.getElementById('signUpUsername').value = 'ab'; // Too short
      document.getElementById('signUpEmail').value = 'test@example.com';
      document.getElementById('signUpPassword').value = 'password123';
      
      // Mock alert
      window.alert = jest.fn();
      
      // Simulate form submission
      const event = { preventDefault: jest.fn() };
      await document.getElementById('signUpForm').onsubmit(event);
      
      // Assertions
      expect(event.preventDefault).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Username must be between 3 and 20 characters.');
      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });
    
    test('sign up form creates user and profile successfully', async () => {
      // Setup
      const username = 'testuser';
      const email = 'test@example.com';
      const password = 'password123';
      const uid = 'user123';
      
      document.getElementById('signUpUsername').value = username;
      document.getElementById('signUpEmail').value = email;
      document.getElementById('signUpPassword').value = password;
      
      // Mock successful user creation
      createUserWithEmailAndPassword.mockResolvedValueOnce({ 
        user: { uid } 
      });
      
      // Mock document references
      doc.mockReturnValueOnce('userDocRef');
      
      // Setup success functions
      window.alert = jest.fn();
      window.closeSignUpModal = jest.fn();
      
      // Simulate form submission
      const event = { preventDefault: jest.fn() };
      await document.getElementById('signUpForm').onsubmit(event);
      
      // Assertions
      expect(event.preventDefault).toHaveBeenCalled();
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), 
        email, 
        password
      );
      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', uid);
      expect(setDoc).toHaveBeenCalledWith('userDocRef', {
        username,
        email
      });
      expect(window.alert).toHaveBeenCalledWith('Account created!');
      expect(window.closeSignUpModal).toHaveBeenCalled();
    });
    
    test('logout button signs user out', () => {
      // Simulate logout click
      document.getElementById('logoutBtn').onclick();
      
      // Assertions
      expect(signOut).toHaveBeenCalled();
    });
    
    test('auth state change shows forum when logged in', async () => {
      // Setup
      const uid = 'user123';
      const username = 'testuser';
      const forumSection = document.getElementById('forumSection');
      const logoutBtn = document.getElementById('logoutBtn');
      const authButton = document.getElementById('authButton');
      
      // Mock document retrieval
      doc.mockReturnValueOnce('userDocRef');
      getDoc.mockResolvedValueOnce({
        data: () => ({ username })
      });
      
      // Grab the auth state callback
      const authCallback = onAuthStateChanged.mock.calls[0][1];
      
      // Simulate logge
