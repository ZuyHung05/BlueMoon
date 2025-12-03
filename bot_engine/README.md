## Adding the `.env` File

The `.env` file is used to store sensitive environment variables required for the bot engine to function. Follow these steps to create and configure the `.env` file:

### 1. Create the `.env` File

In the `bot_engine` directory, create a new file named `.env`.

### 2. Add the Required Variables

Open the `.env` file and add the following variables:

```env
GOOGLE_API_KEY=<your-google-api-key>
DB_URI=<your-database-uri>
MODEL_NAME=gemini-2.0-flash  # Optional, defaults to "gemini-2.0-flash"