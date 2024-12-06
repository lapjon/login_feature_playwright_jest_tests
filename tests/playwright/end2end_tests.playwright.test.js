const { test, expect, request } = require('@playwright/test');

test.describe('Testing Social Media app: index page and redirect links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000');
  });

  test('TC1: Verify Start page loads with correct title and content', async ({ page }) => {
     // Verify page heading text
    await expect(page.locator('h1')).toHaveText('Welcome to Test Application');
    // Verify description text
    await expect(page.locator('p')).toHaveText('You can create a new user or log in with an existing user here!');
    // Verify Sign Up button is visible
    await expect(page.locator('a[href="/signup.html"] button')).toBeVisible();
    // Verify Login button is visible 
    await expect(page.locator('a[href="/login.html"] button')).toBeVisible();
  });

  test('TC2: Verify that Signup button redirects to Signup page', async ({ page }) => {
    // Verify Sign Up button is visible
    await expect(page.locator('a[href="/signup.html"] button')).toBeVisible();
    // Click Signup button
    await page.click('a[href="/signup.html"] button');
    // Verify URL of Signup page
    await expect(page).toHaveURL(/.*signup.html/);
  });

  test('TC3: Verify that Login button redirects to Login page', async ({ page }) => {
    // Verify Login button is visible 
    await expect(page.locator('a[href="/login.html"] button')).toBeVisible();
    // Click Login button
    await page.click('a[href="/login.html"] button');
    // Verify URL of Login page
    await expect(page).toHaveURL(/.*login.html/);
  });
});

test.describe('Testing Social Media app: Signup page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/signup.html');
  });

  test('TC4: User can enter username and password on Signup page', async ({ page }) => {
    // Creating unique username with JavaScript expression used to get the current timestamp in milliseconds since January 1, 1970 (Unix epoch)
    const uniqueUsername = `testuser_${Date.now()}`; 
    // Verify that the username input field is visible, get by id attribute
    await expect(page.locator('#signupUsername')).toBeVisible();
    // Verify that the password input field is visible, get by id attribute
    await expect(page.locator('#password')).toBeVisible();
    // Fill in username in field
    await page.fill('input[name="username"]', uniqueUsername);
    // Fill in password in field
    await page.fill('input[name="password"]', 'Password123');
    // Verify that all fields contain the entered information
    await expect(page.locator('input[name="username"]')).toHaveValue(uniqueUsername);
    await expect(page.locator('input[name="password"]')).toHaveValue('Password123');
  });
 
  test('TC5: Verify that Signup button creates a new user and redirects to the Login page', async ({ page }) => {
    // Creating unique username with JavaScript expression
    const uniqueUsername = `testuser_${Date.now()}`; 
    // Fill in username in field
    await page.fill('input[name="username"]', uniqueUsername);
    // Fill in password in field
    await page.fill('input[name="password"]', 'Password123');
    // Click Signup button
    await page.getByRole('button').click();
    // Verify success message is displayed, get success message by id
    await expect(page.locator('#success-message')).toContainText('Your user was created successfully!');
    // Verify user is redirected to the Login page
    await expect(page).toHaveURL(/.*login.html/); 
  });

  test('TC6:Verify error messages for missing/invalid fields on Signup page', async ({ page }) => {
    // Creating unique username with JavaScript expression
    const uniqueUsername = `testuser_${Date.now()}`; 
    // Click Signup button without entering username or password
    await page.getByRole('button').click();
    // Verify Username cannot be empty!' error message
    await expect(page.locator('#error-message')).toContainText('Username cannot be empty!');
    // Enter only username 
    await page.fill('input[name="username"]', uniqueUsername);
    // Click on the Signup button without entering password
    await page.getByRole('button').click();
    // Verify Password cannot be empty!' error message
    await expect(page.locator('#error-message')).toContainText('Password cannot be empty!');
  });

  test('TC7: Verify existing username error message on Signup page', async ({ page }) => {
    // Posts username 'existinuser' to database prior to executing test case
    const existingUsername = 'existinguser';
    // Enter existing username
    await page.fill('input[name="username"]', existingUsername);
    // Fill in password in field
    await page.fill('input[name="password"]', 'Password123');
    // Click Signup button
    await page.getByRole('button').click();
    // Verify that the error message for existing username is displayed
    await expect(page.locator('#error-message')).toContainText('Hmm, it seems that username is already taken. Please choose another one!');
  });

  test('TC8: Verify invalid password error message on Signup page: no uppercase letters', async ({ page }) => {
    // Creating unique username with JavaScript expression
    const uniqueUsername = `testuser_${Date.now()}`; 
    // Fill in username in field
    await page.fill('input[name="username"]', uniqueUsername);
    // Enter invalid password: no uppercase letters
    await page.fill('input[name="password"]', 'password123');
    // Click Signup button
    await page.getByRole('button').click();
    // Verify that the error message for invalid passord is displayed
    await expect(page.locator('#error-message')).toContainText('Password must be at least 8 characters long, contain an uppercase letter, and a number.');
  });

  test('TC9: Verify invalid password error message on Signup page: no numbers', async ({ page }) => {
    // Creating unique username with JavaScript expression
    const uniqueUsername = `testuser_${Date.now()}`; 
    // Fill in username in field
    await page.fill('input[name="username"]', uniqueUsername);
    // Enter invalid password: no numbers
    await page.fill('input[name="password"]', 'Password');
    // Click Signup button
    await page.getByRole('button').click();
    // Verify that the error message for invalid passord is displayed
    await expect(page.locator('#error-message')).toContainText('Password must be at least 8 characters long, contain an uppercase letter, and a number.');
  });

  test('TC10: Verify invalid password error message on Signup page: no letters', async ({ page }) => {
    // Creating unique username with JavaScript expression
    const uniqueUsername = `testuser_${Date.now()}`; 
    // Fill in username in field
    await page.fill('input[name="username"]', uniqueUsername);
     // Enter invalid password: no letters
     await page.fill('input[name="password"]', '12345678');
     // Click Signup button
    await page.getByRole('button').click();
     // Verify that the error message for invalid passord is displayed
    await expect(page.locator('#error-message')).toContainText('Password must be at least 8 characters long, contain an uppercase letter, and a number.');
  });

  test('TC11: Verify invalid password error message on Signup page: less than 8 characters', async ({ page }) => {
    // Creating unique username with JavaScript expression
    const uniqueUsername = `testuser_${Date.now()}`; 
    // Fill in username in field
    await page.fill('input[name="username"]', uniqueUsername);
     // Enter invalid password: less than 8 characters
     await page.fill('input[name="password"]', 'Pass1');
     // Click Signup button
    await page.getByRole('button').click();
     // Verify that the error message for invalid passord is displayed
    await expect(page.locator('#error-message')).toContainText('Password must be at least 8 characters long, contain an uppercase letter, and a number.');
  });
});

test.describe('Testing Social Media app: Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/login.html');
  });

  test('TC12: User can enter username and password on Login page', async ({ page }) => {
    const username = 'TestUser1';
    const password = 'Password123';
    // Verify that the username input field is visible, get by id attribute
    await expect(page.locator('#username')).toBeVisible();
    // Verify that the password input field is visible, get by id attribute
    await expect(page.locator('#password')).toBeVisible();
    // Fill in username in field
    await page.fill('input[name="username"]', username);
    // Fill in password in field
    await page.fill('input[name="password"]', password);
    // Verify that all fields contain the entered information
    await expect(page.locator('input[name="username"]')).toHaveValue(username);
    await expect(page.locator('input[name="password"]')).toHaveValue(password);
  });

  test('TC13: Verify that Login button signs in user and redirects to the Dashboard page', async ({ page}) => {
    const username = 'TestUser1'
    const password = 'Password123'
    // Fill in username in field
    await page.fill('input[name="username"]', username);
    // Fill in password in field
    await page.fill('input[name="password"]', password);
    // Click Signup button
    await page.getByRole('button').click();
    // Verify success message is displayed, get success message by id
    await expect(page.locator('#success-message')).toContainText('Logged in successfully!');
    // Verify user is redirected to the Dashboard page
    await expect(page).toHaveURL(/.*dashboard.html/); 
    // Verify the dashboard heading is visible  
    await expect(page.locator('.dashboard-content')).toContainText('Welcome to your dashboard!');
    // Verify the logout button is visible and contains text "Log out"
    await expect(page.locator('#logoutButton')).toBeVisible();
    await expect(page.locator('#logoutButton')).toContainText('Log Out');
  });

  test('TC14: Verify error messages for missing/invalid fields on Login page', async ({ page }) => {
    // Creating unique username with JavaScript expression
    const uniqueUsername = `testuser_${Date.now()}`; 
    // Click Login button without entering username or password
    await page.getByRole('button').click();
    // Verify Username cannot be empty!' error message
    await expect(page.locator('#error-message')).toContainText('Username cannot be empty!');
    // Enter only username 
    await page.fill('input[name="username"]', uniqueUsername);
    // Click on the Login button without entering password
    await page.getByRole('button').click();
    // Verify Password cannot be empty!' error message
    await expect(page.locator('#error-message')).toContainText('Password cannot be empty!');
  });

  test('TC15: Verify error message for incorrect password on Login page', async ({ page }) => {
    const username = 'TestUser1'
    // Fill in username in field
    await page.fill('input[name="username"]', username);
    // Fill in wrong password in field
    await page.fill('input[name="password"]', 'WrongPassword123');
    // Click Login button
    await page.getByRole('button').click();
    // Verify "Incorrect password!" error message
    await expect(page.locator('#error-message')).toContainText('Incorrect password');
  });

  test('TC16: Verify error messages for non-existent user on Login page', async ({ page }) => {
    // Creating unique username with JavaScript expression
    const uniqueUsername = `testuser_${Date.now()}`;
    // Creating unique password with JavaScript expression
    const uniquePassword = `password_${Date.now()}`;
    // Enter non-registered username
    await page.fill('input[name="username"]', uniqueUsername);
    // Enter random password
    await page.fill('input[name="password"]', uniquePassword);
    // Click Login button
    await page.getByRole('button').click();
    // Verify User not found error message
    await expect(page.locator('#error-message')).toContainText('User not found');
  });
});

test.describe('Testing Social Media app: Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/dashboard.html');
  });

  test('TC17: Verify Dashboard page loads with correct title and content', async ({ page }) => {
     // Verify page heading text
    await expect(page.locator('.dashboard-content')).toContainText('Welcome to your dashboard!');
    // Verify description text using .nth(1) to get the second <p> element
    await expect(page.locator('p').nth(1)).toContainText('If you want to change your password you can do it here.');
    // Verify label for Current Password
    await expect(page.locator('label[for="currentPassword"]')).toBeVisible();
    // Verify that the Current Password input field is visible
    await expect(page.locator('input[name="currentPassword"]')).toBeVisible();
    // Verify label for New Password
    await expect(page.locator('label[for="newPassword"]')).toBeVisible();
    // Verify that the New Password input field is visible
    await expect(page.locator('input[name="newPassword"]')).toBeVisible();
    // Verify label for Confirm New Password
    await expect(page.locator('label[for="confirmNewPassword"]')).toBeVisible();
    // Verify that the Confirm New Password input field is visible
    await expect(page.locator('input[name="confirmNewPassword"]')).toBeVisible();
  });

  test('TC18: Verify Logout button on Dashboard page redirects to Start page', async ({ page}) => {
    // Verify Logout button is visible and have text "Log out"
    await expect(page.locator('#logoutButton')).toBeVisible();
    await expect(page.locator('#logoutButton')).toContainText('Log Out');
    // Click Logout button
    await page.click('#logoutButton');
    // Verify URL of Index page
    await expect(page).toHaveURL(/.*index.html/);
  });
});

test.describe('Change Password Tests', () => {
     // Generate a unique user for change password tests, logging in before each test case
  test.beforeEach(async ({ page, context }) => {
     const changePasswordUser = `changePasswordUser_${Date.now()}`;
     // Regiuster user via API request
     const apiContext = await request.newContext();
     await apiContext.post('http://localhost:5000/api/users/register', {
      data: {
        username: changePasswordUser,
        password: 'Password123',
      },
     });
     // Log in with new user
     await page.goto('/login.html');
    await page.fill('input[name="username"]', changePasswordUser);
    await page.fill('input[name="password"]', 'Password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard\.html/);
  });

  test('TC19: Verify successfull password change for unique user', async ({ page }) => {
    // Fill in current password in field
    await page.fill('input[name="currentPassword"]', 'Password123');
    // Enter a simple valid new password that meets all requirements 
    const newPassword = 'NewPass1';
    await page.fill('input[name="newPassword"]', newPassword);
    // Confirm new password
    await page.fill('input[name="confirmNewPassword"]', newPassword);
    // Click on the "Change Password" button
    await page.click('button[type="submit"]');
    // Verify success message is displayed
    await expect(page.locator('#change-password-success')).toContainText('Password updated successfully!');
  });

  test('TC20: Verify error message for mismatching passwords', async ({ page }) => {
    // Fill in current password in field
    await page.fill('input[name="currentPassword"]', 'Password123');
    // Enter a simple valid new password that meets all requirements 
    const newPassword = 'NewPass1';
    await page.fill('input[name="newPassword"]', newPassword);
    // Confirm new password
    await page.fill('input[name="confirmNewPassword"]', 'newpass1');
    // Click on the "Change Password" button
    await page.click('button[type="submit"]');   
    // Verify error message is displayed
    await expect(page.locator('#change-password-error')).toContainText('New passwords do not match!');
  });
  
  test('TC21: Verify error message for invalid new password: no uppercase letters', async ({ page }) => {
    // Fill in current password in field
    await page.fill('input[name="currentPassword"]', 'Password123');
    // Enter a new password that does not meet requirements
    const newInvalidPassword = 'newpassword123';
    await page.fill('input[name="newPassword"]', newInvalidPassword);
    // Confirm new invalid password
    await page.fill('input[name="confirmNewPassword"]', newInvalidPassword);
    // Click on the "Change Password" button
    await page.click('button[type="submit"]');   
    // Verify error message is displayed
    await expect(page.locator('#change-password-error')).toContainText('New password must be at least 8 characters long, contain an uppercase letter, and a number.');
  });

  test('TC22: Verify error message for invalid new password: no numbers', async ({ page }) => {
    // Fill in current password in field
    await page.fill('input[name="currentPassword"]', 'Password123');
    // Enter a new password that does not meet requirements
    const newInvalidPassword = 'NewPassword';
    await page.fill('input[name="newPassword"]', newInvalidPassword);
    // Confirm new invalid password
    await page.fill('input[name="confirmNewPassword"]', newInvalidPassword);
    // Click on the "Change Password" button
    await page.click('button[type="submit"]');   
    // Verify error message is displayed
    await expect(page.locator('#change-password-error')).toContainText('New password must be at least 8 characters long, contain an uppercase letter, and a number.');
  });

  test('TC23: Verify error message for invalid new password: no letters', async ({ page }) => {
    // Fill in current password in field
    await page.fill('input[name="currentPassword"]', 'Password123');
    // Enter a new password that does not meet requirements
    const newInvalidPassword = '12345678';
    await page.fill('input[name="newPassword"]', newInvalidPassword);
    // Confirm new invalid password
    await page.fill('input[name="confirmNewPassword"]', newInvalidPassword);
    // Click on the "Change Password" button
    await page.click('button[type="submit"]');   
    // Verify error message is displayed
    await expect(page.locator('#change-password-error')).toContainText('New password must be at least 8 characters long, contain an uppercase letter, and a number.'); 
  });

  test('TC24: Verify error message for invalid new password: less than 8 characters', async ({ page }) => {
    // Fill in current password in field
    await page.fill('input[name="currentPassword"]', 'Password123');
    // Enter a new password that does not meet requirements
    const newInvalidPassword = 'Pass123';
    await page.fill('input[name="newPassword"]', newInvalidPassword);
    // Confirm new invalid password
    await page.fill('input[name="confirmNewPassword"]', newInvalidPassword);
    // Click on the "Change Password" button
    await page.click('button[type="submit"]');   
    // Verify error message is displayed
    await expect(page.locator('#change-password-error')).toContainText('New password must be at least 8 characters long, contain an uppercase letter, and a number.'); 
  });

  test('TC25: Verify error message for missing field', async ({ page }) => {
    // Fill in current password in field
    await page.fill('input[name="currentPassword"]', 'Password123');
    // Enter a new password that meets requirements
    const newInvalidPassword = 'NewPassword123';
    await page.fill('input[name="newPassword"]', newInvalidPassword);
    // Click on the "Change Password" button without confirming password
    await page.click('button[type="submit"]');   
    // Verify error message is displayed
    await expect(page.locator('#change-password-error')).toContainText('All fields are required!');
  });
});

test.describe('Testing Social Media app: End-2-End Happy Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/index.html');
  });

  test('TC26: End-2-End Happy Flow: Signup > Login > Change Password > Logout', async ({ page }) => {
    const uniqueUsername = `testuser_${Date.now()}`;
    const password = 'Password123';
    const newPassword = 'NewPass1';
    // Verify Sign Up button is visible
    await expect(page.locator('a[href="/signup.html"] button')).toBeVisible();
    // Click Signup button
    await page.click('a[href="/signup.html"] button');
    // Verify URL of Signup page
    await expect(page).toHaveURL(/.*signup.html/);
    // Enter non-registered username
    await page.fill('input[name="username"]', uniqueUsername);
    // Fill in password in field
    await page.fill('input[name="password"]', password);
    // Click Signup button
    await page.getByRole('button').click();
    // Verify success message is displayed, get success message by id
    await expect(page.locator('#success-message')).toContainText('Your user was created successfully!');
    // Verify user is redirected to the Login page
    await expect(page).toHaveURL(/.*login.html/); 
    // Enter username
    await page.fill('input[name="username"]', uniqueUsername);
    // Enter password 
    await page.fill('input[name="password"]', password);
    // Click Login button
    await page.getByRole('button').click();
    // Verify success message is displayed, get success message by id
    await expect(page.locator('#success-message')).toContainText('Logged in successfully!');
    // Verify user is redirected to the Dashboard page
    await expect(page).toHaveURL(/.*dashboard.html/);
    // Fill in current password in field
    await page.fill('input[name="currentPassword"]', password);
    // Enter a new password
    await page.fill('input[name="newPassword"]', newPassword);
    // Confirm new invalid password
    await page.fill('input[name="confirmNewPassword"]', newPassword);
    // Click on the "Change Password" button
    await page.click('button[type="submit"]');
    // Verify success message is displayed
    await expect(page.locator('#change-password-success')).toContainText('Password updated successfully!');
    // Verify the logout button is visible and contains text "Log out"
    await expect(page.locator('#logoutButton')).toBeVisible();
    await expect(page.locator('#logoutButton')).toContainText('Log Out');
    // Click Logout button
    await page.click('#logoutButton');
    // Verify URL of Index page
    await expect(page).toHaveURL(/.*index.html/);
    // Verify page heading text
    await expect(page.locator('h1')).toHaveText('Welcome to Test Application');
    

  });
});
