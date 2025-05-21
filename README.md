## code style

This project follows the [![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config) for consistent and clean code formatting.

## Running PostgreSQL with Docker

```bash
docker run --name my-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
```
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