jest.mock('../models/index'); // Mock Sequelize instance

// Import the functions to be tested
const { saveNewUser, getUser, loginUser } = require('../models/userFunctions');
const { isValidPassword, User } = require('../models/user'); // Import the User model from models/user.js

jest.mock('../models/user', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  const UserMock = dbMock.define('User', {}, { logging: false });

  // Mock Sequelize methods with Jest mocks
  UserMock.create = jest.fn();  // Mock `create` method
  UserMock.findOne = jest.fn(); // Mock `findOne` method

  return {
    User: UserMock,
  };
});

describe('Foundation tests: Mocked Server Functions', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests to avoid interference
  });

  it('TC1: should save user data to the mocked database', async () => {
    const userData = {
      username: 'mockuser',
      password: 'Password123'
    };

    // Set what User.create() should return when called
    User.create.mockResolvedValue(userData); // Use Jest's `mockResolvedValue`

    const result = await saveNewUser(userData);
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual(userData);
  });

  it('TC2: should get user data from the mocked database', async () => {
    const mockUser = {
      username: 'mockuser',
      password: 'Password123'
    };

    // Set what User.findOne() should return when called
    User.findOne.mockResolvedValue(mockUser); // Use Jest's `mockResolvedValue`

    const result = await getUser('mockuser');
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'mockuser' } });
    expect(result).toEqual(mockUser);
  });

  it('TC3: should return null if user is not found', async () => {
    // Set User.findOne() to return null to simulate user not found
    User.findOne.mockResolvedValue(null);

    const result = await getUser('nonexistentuser');
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

describe('Login tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests to avoid interference
  });

  it('TC1: Successfull login', async () => {
      const userData = {
        username: 'testuser',
        password: 'Password123'
      };
         // Save the user
      await saveNewUser(userData);

       // Mock `User.findOne` for the `loginUser` function
       User.findOne.mockResolvedValue(userData);

      // Attempt to log in
      const result = await loginUser(userData.username, userData.password);
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledWith({ where: { username: userData.username } });
      expect(result).toEqual({ message: 'Logged in successfully!' });
  });

  it('TC2: Login should fail for incorrect password', async () => {
    const userData = {
      username: 'testuser',
      password: 'Password123'
    };

    // Mock `User.findOne` to return the user
    User.findOne.mockResolvedValue(userData);

    // Attempt to log in with incorrect password
    await expect(loginUser(userData.username, 'WrongPassword')).rejects.toThrow('Incorrect password');
  });
    
  it('TC3: Login should fail for non-existent user', async () => {
    // Mock `User.findOne` to return null (user not found)
    User.findOne.mockResolvedValue(null);

    // Attempt to log in with non-existent user
    await expect(loginUser('nonexistentuser', 'Password123')).rejects.toThrow('User not found');
  });

  


  });
}); 