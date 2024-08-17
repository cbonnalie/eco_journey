Eco Journey is a collaborative project by Christian Bonnalie, 
Jarvis Kampe, and Alvaro Valdez-Duran from the University of Washington Tacoma, 
developed as part of the Database System Design course. 

We have aimed to create a platform that curates travel itineraries 
with an emphasis on raising awareness of potential ecological impact. 
Developed with JetBrains WebStorm v2024.1.5.

The project is divided into two main directories: client and server. 
The client directory contains the React application, 
while the server directory contains the Express server.

----------------------------------------------------------------------------------------

To run the application, navigate to /server/.env and replace the value NAME and PASSWORD 
with your own MySQL credentials.

Ensure that you have Node.js installed on your machine. If not, you can download it from
https://nodejs.org/en/download/package-manager

Ensure that you have MySQL installed on your machine, and that the ECO_JOURNEY
is currently in use.

Next, navigate to the root directory and run the following command: npm run install-deps

Once dependencies are installed, run the following command: npm run start

This will start both the client and server applications concurrently and the application
should now be available at http://localhost:3000.
