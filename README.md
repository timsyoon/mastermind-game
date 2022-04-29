# Mastermind Game

![mastermind-gif](/assets/mastermind.gif)

Mastermind is a code-breaking game in which the computer sets a random sequence of numbers
and the player tries to guess the secret code within a certain amount of attempts. For each
attempt, the computer provides the player with feedback which the player can then use to improve
subsequent attempts. In this version of the game, the secret code will be 4 numbers and the player
will have 10 attempts.

## Installation

1. Install Node and NPM on your local machine by following [Setting up a Node development environment](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment).

2. Install Git by following [Getting Started - Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

3. In your local terminal/command prompt, clone the source code of this project by running the following command in the directory of your choice:

    ```
    git clone https://github.com/timsyoon/mastermind-game.git
    ```

4. Navigate into the newly cloned directory.

5. Install all dependencies by running

    ```
    npm install
    ```

6. Start the server by running

    ```
    npm start
    ```

7. Navigate to http://localhost:3000/ in your local browser. The game should now be displayed.

## How to play

1. Enter numbers in the current row, which is indicated by the presence of a check button on the very right of the table.

2. Click the check button to submit a guess. Feedback pegs (if any) will be displayed to the left of the check button, and any other feedback will be shown above the number bank.

3. Continue submitting guesses until the game is over.

## Features

- Prior guesses and their feedback pegs can be viewed during a game.
- If any text boxes are empty in the current row when the player clicks on the check button, the game shows relevant feedback and does not let the player proceed.
- Once a game is over, the secret code is displayed in the top row of the table.

## Thoughts

- I connected the app to a cloud-based MongoDB database ([MongoDB Atlas](https://www.mongodb.com/atlas/database)) via [Mongoose](https://mongoosejs.com/). I added a button (now hidden) that when clicked, sends a POST request to the /games route. The Game controller then saves the current state of the game to the database. A screenshot of a sample Game object can be viewed in this [pull request](https://github.com/timsyoon/mastermind-game/pull/8).

- Improvements can be made to the overall organization of the app. Currently, the entry point is the '/' route of the server, which then renders the view in `index.ejs`. This HTML embeds the `mastermind.js` script at the bottom of the `body` element. Once the page is loaded, a new instance of the `Game` class is created. Its various methods interact with the DOM as the game progresses and also sends requests to the server. The server performs most of the route handling in `index.js` itself, but I think a better approach would be to have the bulk of the route handling logic in controller files. That way the routes can forward requests to the controllers which would process the requests
and interact with the database.

- More routes can be added for the remaining Create, Read, Update, and Delete operations for both the Game and the User models. Future steps could include adding a login/register page to create User instances. Once a user is logged in, games can be associated with the user and saved to the database. Users may be interested in viewing past games and how they performed.

## Database Models

![models](/assets/database-models.jpg)

## Wireframe

![wireframe-game](/assets/wireframe-game.jpg)
