# Login registration workflow

The workflow below explains step how to a build robust registeration process step by step

# Step 1

Creatinfg user and sending verification link to user email

1. FE: Send user form to backend
2. BE: receive user and do the following:
   -- get the password and encrypt
   -- create unique code and store it in the session table with email
   -- format url like `http://yourdomain.com/verify-user?c=qwem234&email.com`
   -- send the above link to the user email
3. BE: insert user to the user table
4. BE: response user saying check their email to verify the account

# Step 2

For user, opening email and following instruction to click the link received

1. FE: User clicks the link in their email and redirected to our webpage `http://yourdomain.com/verify-user?c=qwem234&email.com`
2. FE: Within our `verify-user` page, reveive the `c` & `e` from the query string
3. FE: Send the `c` & `e` to the server to verify
4. BE: Create new API endpoint to receive the `c` & `e`
5. BE: Verify `c` & `e` is exist in the session table and valid
   -- if valid, update user status to active and also `isEmailVerified: true`
   -- then send email notifying the account has been activated
   -- verify user the same
   -- else, the link is invalid
