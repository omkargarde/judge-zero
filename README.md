## code style

This project follows the [![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config) for consistent and clean code formatting.

## Running PostgreSQL with Docker

```bash
docker run --name my-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
```

## judge0 installation
1. **Download and Extract Judge0**  
   - Download the Judge0 release archive:
     ```bash
     wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
     ```
   - Unzip the downloaded archive:
     ```bash
     unzip judge0-v1.13.1.zip
     ```

2. **Set Up Secure Passwords**  
   - **Generate random passwords** for Redis and Postgres:
     - Visit [Random Password Generator](https://www.random.org/passwords/?num=1&len=32&format=plain&rnd=new) and copy the first password.
     - Open the `judge0.conf` file:
       ```bash
       nano judge0-v1.13.1/.env
       ```
     - Update the `REDIS_PASSWORD` with the generated password.
     - Repeat the process for `POSTGRES_PASSWORD` using a new random password.

3. **Start Judge0 Services**  
   - Navigate to the Judge0 folder:
     ```bash
     cd judge0-v1.13.1
     ```
   - Start the database and Redis services:
     ```bash
     docker-compose up db redis
     ```
   - Wait for a few seconds:
     ```bash
     sleep 10s
     ```
   - Start the remaining services:
     ```bash
     docker-compose up
     ```
   - Wait a few more seconds:
     ```bash
     sleep 5s
     ```

4. **Verify the Installation**  
   - Open your browser and visit:
     ```
     http://localhost:2358/docs
     ```
   - You should see the Judge0 API documentation page, meaning your Judge0 instance is running successfully!

---


## Environment Variables

The following environment variables are used to configure authentication and security settings in the application:

### `SALT_ROUNDS`
- **Default Value:** `10`
- **Purpose:** Controls the computational complexity of password hashing using bcrypt. Higher values increase security but also increase the time required to hash passwords.
- **Recommended Range:** `10`–`14` for most applications. For development, lower values (e.g., `8`) may be used for faster hashing, but production should use at least `10`.
- **Usage Example:**
    ```
    SALT_ROUNDS=12
    ```

### `JWT_MAX_AGE`
- **Default Value:** `3600` (seconds, i.e., 1 hour)
- **Purpose:** Specifies the expiration time for JSON Web Tokens (JWTs), controlling how long a token remains valid after issuance.
- **Usage Example:**
    ```
    JWT_MAX_AGE=86400  # 24 hours
    ```
- **Note:** Adjust this value based on your application's security requirements. Shorter durations enhance security but may require users to log in more frequently.