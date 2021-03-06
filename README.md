# FdlmScratch

This project is a card picker for [Fiesta De Los Muertos](https://boardgamegeek.com/boardgame/285253/fiesta-de-los-muertos). It also allows to expend the game to a wider international audience.

## Install
- Run `npm install` to install front end.
- Run `cd backend; npm install` to install back end.
- Edit/create `backend/credentials.json` with your mongodb information. You can use `credentials.json.example` as an example for the format.

## Development server

In 2 terminals:
- Run `ng serve` for the front end.
- Run `cd backend; nodemon` for the backend. It will run on port 8000
- Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Roadmap
- Detect and filter out shitty images
    - Fallback to other languages for images
- Edit a card
- Upvote/downvote cards
- Remove player selection and use cookie/refresh token to assign 1 card per client
- Add tags to cards
- Options to narrow card selection or alter probability based on tags / score
- Change card difficulty from card detail
- Change difficulty filter from result or card-detail
- Memorize previously assigned cards to reduce the probability of/prevent reassigning a recently assigned card
- Use MongoDB transaction to avoid race conditions
- Add score on card based if it was discovered or not
- "Game" layer to be able to run multiple games on the same server
- Additional "gamemodes" (such as increase the number of noise cards)
- Add more language support (and revamp language support)
- Preframe the image to avoid jumping UI
- Change from promise/then to asyn/await
- Migrate backend to Typescript
    - Make better classes for the backend (class for filtering)
    - Share some classes between FE and BE
- Unit tests
- Geo fencing
- Disable cards instead of deleting them
- Pagination for list
- Sort list