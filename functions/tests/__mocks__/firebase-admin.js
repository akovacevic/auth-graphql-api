const mockCollection = jest.fn();
const mockCollectionGroup = jest.fn();
const mockDoc = jest.fn();
const mockWhere = jest.fn();
const mockBatch = jest.fn();
const mockGet = jest.fn();
const mockGetAll = jest.fn();
const mockUpdate = jest.fn();
const mockAdd = jest.fn();
const mockSet = jest.fn();
const mockDelete = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockOffset = jest.fn();

const mockBatchDelete = jest.fn();
const mockBatchCommit = jest.fn();
const mockBatchUpdate = jest.fn();
const mockBatchSet = jest.fn();
const mockSetCustomClaims = jest.fn();

function buildDocFromHash(hash = {}) {
  return {
    exists: !!hash || false,
    id: hash.id || 'abc123',
    data() {
      const copy = { ...hash };
      delete copy.id;
      return copy;
    },
  };
}

function idHasCollectionName(id) {
  if(!id)
    return false
  return id.match('/');
}

function buildQuerySnapShot(requestedRecords) {
  const multipleRecords = requestedRecords.filter(rec => !!rec);
  const docs = multipleRecords.map(buildDocFromHash);

  return {
    empty: multipleRecords.length < 1,
    docs,
    forEach(callback) {
      return docs.forEach(callback);
    },
  };
}

class FakeFirestore {
  constructor(stubbedDatabase = {}) {
    this.isFetchingSingle = false;
    this.database = stubbedDatabase;
    this.parent = this.database;
  }

  set collectionName(collectionName) {
    this._collectionName = collectionName;
    this.recordToFetch = null;
  }

  get collectionName() {
    return this._collectionName;
  }

  collection(collectionName) {
    this.isFetchingSingle = false;
    this.collectionName = collectionName;
    mockCollection(...arguments);
    return this;
  }

  collectionGroup(collectionName) {
    this.isFetchingSingle = false;
    this.collectionName = collectionName;
    mockCollectionGroup(...arguments);
    return this;
  }

  where() {
    this.isFetchingSingle = false;
    mockWhere(...arguments);
    return this;
  }

  get() {
    mockGet(...arguments);

    if (this.recordToFetch) {
      return Promise.resolve(buildDocFromHash(this.recordToFetch));
    }
    let contentToReturn;
    const requestedRecords = this.database[this.collectionName] || [];
    if (this.isFetchingSingle) {
      if (requestedRecords.length < 1 || !this.recordToFetch) {
        contentToReturn = { exists: false };
      } else if (Array.isArray(requestedRecords)) {
        contentToReturn = buildDocFromHash(requestedRecords[0]);
      } else {
        contentToReturn = buildDocFromHash(requestedRecords);
      }
    } else {
      contentToReturn = buildQuerySnapShot(requestedRecords);
    }

    return Promise.resolve(contentToReturn);
  }

  getAll() {
    const requestedRecords = this.database[this.collectionName];

    mockGetAll(...arguments);

    const records = requestedRecords
      .map(record => buildDocFromHash(record))
      .filter(record => !!record.id);

    return Promise.resolve(records);
  }

  batch() {
    mockBatch(...arguments);
    return {
      delete() {
        mockBatchDelete(...arguments);
      },
      set() {
        mockBatchSet(...arguments);
      },
      update() {
        mockBatchUpdate(...arguments);
      },
      commit() {
        mockBatchCommit(...arguments);
        return Promise.resolve();
      },
    };
  }

  doc(id) {
    if (idHasCollectionName(id)) {
      const pathArray = id.split('/');
      id = pathArray.pop();
      this.collectionName = pathArray.join('/');
    }

    mockDoc(id);
    this.isFetchingSingle = true;
    this.records = this.database[this.collectionName] || [];
    this.recordToFetch = this.records.find(record => record.id === id);
    this.database = this.recordToFetch || []
    return this;
  }

  update(object) {
    mockUpdate(...arguments);
    return Promise.resolve(buildDocFromHash(object));
  }

  set(object) {
    mockSet(...arguments);
    return Promise.resolve(buildDocFromHash(object));
  }

  add(object) {
    mockAdd(...arguments);
    return Promise.resolve(buildDocFromHash(object));
  }

  delete() {
    mockDelete(...arguments);
    return Promise.resolve();
  }

  orderBy() {
    mockOrderBy(...arguments);
    return this;
  }

  limit() {
    mockLimit(...arguments);
    return this;
  } 

  offset() {
      mockOffset(...arguments);
      return this;
  }
}

const mockCreateUserWithEmailAndPassword = jest.fn();
const mockDeleteUser = jest.fn();
const mockSendVerificationEmail = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSendPasswordResetEmail = jest.fn();
const mockVerifyIdToken = jest.fn();
const mockImportUsers = jest.fn();

class FakeAuth {
  constructor(currentUser) {
    currentUser.sendEmailVerification = mockSendVerificationEmail;
    this.currentUserRecord = currentUser;
  }

  createUserWithEmailAndPassword() {
    mockCreateUserWithEmailAndPassword(...arguments);
    return Promise.resolve({ user: this.currentUserRecord });
  }

  deleteUser() {
    mockDeleteUser(...arguments);
    return Promise.resolve('👍');
  }

  signInWithEmailAndPassword() {
    mockSignInWithEmailAndPassword(...arguments);
    return Promise.resolve({ user: this.currentUserRecord });
  }

  sendPasswordResetEmail() {
    mockSendPasswordResetEmail(...arguments);
  }

  verifyIdToken() {
    mockVerifyIdToken(...arguments);
    return Promise.resolve(this.currentUserRecord);
  }

  setCustomUserClaims() {
    mockSetCustomClaims(...arguments);
    return Promise.resolve(this.currentUserRecord);
  }

  importUsers() {
    mockImportUsers(...arguments);
    return Promise.resolve({
      errors: []
    });
  }

  get currentUser() {
    const { uid, ...data } = this.currentUser;
    return { uid, data };
  }
}


let database = {
    users: [
      { id: '1',
        uid: '1',
        email: 'homer@simpson.com',
        emailVerified: true,
        groups: [{
          id: 'it', 
          name: 'it', 
          roles:[{ 
              id: 'app1-admin',
              name: 'app1-admin',
              permissions: ['read', 'write', 'admin']
            }]
        }]
      },
      { id: '2',
        uid: '2',
        email: 'lisa@simpson.com',
        emailVerified: true,
        groups: [{
          id: 'marketing', 
          name: 'marketing', 
          roles:[{ 
              id: 'app1-reader',
              name: 'app1-reader',
              permissions: ['read']
            }]
        }]
      },
    ],
    groups: [
      { id: 'it', 
        name: 'it', 
        roles:[{ 
            id: 'app1-admin',
            name: 'app1-admin',
            permissions: ['read', 'write', 'admin']
          }],
        users: [
          { id: '1', uid: '1', email: 'homer@simpson.com', emailVerified: true}
        ]
      },
      { id: 'marketing',
        name: 'marketing',
        roles:[{ 
          id: 'app1-reader',
          name: 'app1-admin',
          permissions: ['read']
        }],
        users: [
          { id: '2', uid: '2', email: 'lisa@simpson.com', emailVerified: true}
        ]
      }
    ],
    roles: [
      { id: 'app1-admin', 
        name: 'app1-admin', 
        permissions: ['read', 'write', 'admin'],
        groups: [
          { id: 'it', 
            name: 'it'
          }
        ]
      },
      { id: 'app1-reader', 
        name: 'app1-reader', 
        permissions: ['read'],
        groups: [
          { id: 'marketing',
            name: 'marketing'
          }
        ]
      }
    ]
}

const admin = {
  initializeApp: jest.fn(),
  credential: {
    applicationDefault: jest.fn()
  },
  auth: () => { return new FakeAuth({ uid: 'test', admin: true}) },
  firestore: () => { return new FakeFirestore(database)}
}

export { admin as default }
