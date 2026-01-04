# Project: Cong Nghe Phan Mem

This project includes a bot engine powered by a chat model and a frontend interface for user interaction.

## Getting Started

Follow the steps below to set up and run the project.

---

## Backend: Bot Engine

The bot engine is located in the `bot_engine` directory. It uses Google Generative AI and a SQL database to process and respond to user queries.

### Steps to Run the Bot Engine

1. Navigate to the `bot_engine` directory:

   ```bash
   cd bot_engine
   ```

2. Create a `.env` file to store sensitive environment variables. Refer to the [bot engine README](bot_engine/README.md) for detailed instructions.

3. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the bot engine:

   ```bash
   python agent.py
   ```

---

## Frontend: User Interface

The frontend is located in the `frontend` directory. It provides a user-friendly interface to interact with the chat model.

### Steps to Run the Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

4. Open your browser and navigate to the URL displayed in the terminal (usually `http://localhost:3000`).

---

## Project Structure

```
cong_nghe_phan_mem/
├── bot_engine/       # Backend bot engine
│   ├── agent.py      # Main script for the bot engine
│   ├── utils.py      # Utility functions
│   ├── prompts/      # System prompts for the agent
│   └── README.md     # Bot engine documentation
├── frontend/         # Frontend user interface
│   ├── src/          # Source code for the frontend
│   ├── public/       # Static assets
│   └── README.md     # Frontend documentation
└── README.md         # Global project documentation
```

---

## Notes

- Ensure you have Python 3.8+ and Node.js installed on your system.
- The `.env` file for the bot engine should not be committed to version control.
- Use `yarn` for managing frontend dependencies and `pip` for backend dependencies.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

