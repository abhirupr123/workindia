# SDE Assignment Workindia : Cricbuzz Platform

This repository consists of an API Server, where guest users and admins can come on the platform and browse across multiple matches and can see either of them in detail along with admins creating teams, matches and updating stats and scores.

## Tech Stack

This API server is implemented using Node.js as the Backend Framework alongg with MySQL as the database. The steps to run this server on the local environment are listed below-

### Perequisites

First, you should have MySQL and Node installed in your computer. After that follow these steps to run and create your database connection

- `npm init` to install the package.json file.
-  Install these libraries to continue with the further implementation
-  `npm install mysql bcryptjs crypto jsonwebtoken`.
-  To connect with the database, setup the MYSQL workbench and enter the following parameters in the connection logic
-  `host, password, user, database (name of the database)`.

## Contents

This repository consists of two files - `app.js` with the server API logic and `db.js` consisting of the database manipulation, inserting and fetching logic. `db.js` mainly consists of the following functions

- `create` - To create usernames for new admin logins with their email and passwords
- `get` - To fetch the userIDs of the existing users.
- `insert` - Admin function to insert matches in the matches table.
- `getmatches` - Guest function for the arriving guests to see the existing matches
- `details` - To view the details of te players playing the specific match

In addition to the already mentioned API endpoints, the `app.js` file contains two database function handlers - 

- `getStats` - To fetch the stats of a particular player ID.
- `addPlayer` - Admin function handler which is used to add a particular player to the team.
