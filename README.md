# CHAT APP

A chat application.

## NOTE

### To run app:
  1. Fork and pull this repository.
  2. Add a .env file in the server repository and provide values for the following:
  <br>
    i. PORT: <br>
    ii. MONGO_URI: <br>
    iii. JWT_SECRET: 
  3. Open terminal, go the server repo and run the command: ```npm install &&& npm run dev```
  4. Go the client repo and repeat the command above.

### Bugs:
  1. Sent messages aren't received and saved in the database due to socket.emit() not firing in "client/src/pages/Root/Chat.jsx" (line 74)

## Contributing

Contributions are welcome! Please submit a pull request or create an issue if you encounter any bugs or have any suggestions for new features.

## Credits

This project was created by Abd'Quadri (mobolajiJinad).

## License

This project is licensed under the MIT License. See LICENSE for more information.
