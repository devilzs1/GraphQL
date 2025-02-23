import {ApolloServer} from '@apollo/server'
import {startStandaloneServer} from '@apollo/server/standalone'

import { typeDefs } from './schema.js'
import db from './_db.js'

const resolvers = {
    Query: {
        games() {
            return db.games;
        },
        authors() {
            return db.authors;
        },
        reviews() {
            return db.reviews;
        },
        review(_, args) {
            return db.reviews.find((review) => review.id === args.id);
        },
        game(_, args) {
            return db.games.find((game) => game.id === args.id);
        },
        author(_, args) {
            return db.authors.find((author) => author.id === args.id)
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((review) => review.game_id === parent.id)
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((review) => review.author_id === parent.id)
        }
    },
    Review: {
        game(parent) {
            return db.games.find((g) => g.id === parent.game_id)
        },
        author(parent) {
            return db.authors.find((a) => a.id === parent.author_id)
        }
    },
    Mutation: {
        addGame(_, args) {
            if (!args.game || !args.game.title || !args.game.platform) {
                throw new Error("Invalid input: game title and platform are required.");
            }
        
            let id;
            do {
                id = Math.floor(Math.random() * 10000).toString();
            } while (db.games.some((g) => g.id === id)); // sample learning - prefers to use uuid
        
            let game = {
                ...args.game,
                id
            };
            db.games.push(game);
            return game;
        }
        ,
        updateGame(_, args) {
            if (!args.id || !args.game) {
                throw new Error("Invalid input: id and game data are required.");
            }
            let updatedGame = null;
            db.games = db.games.map((g) => {
                if (g.id === args.id) {
                    updatedGame = {...g, ...args.game};
                    return updatedGame;
                }
                return g;
            });
            if (!updatedGame) {
                throw new Error(`Game with id ${args.id} not found.`);
            }
            return updatedGame;
        },
        deleteGame(_, args) {
            if (!args.id) {
                throw new Error("Invalid input: id is required.");
            }
        
            const gameIndex = db.games.findIndex((g) => g.id === args.id);
            if (gameIndex === -1) {
                throw new Error(`Game with id ${args.id} not found.`);
            }
        
            db.games.splice(gameIndex, 1); 
            return { message: "Game deleted successfully", remainingGames: db.games };
        }
        
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const {url} = await startStandaloneServer(server, {
    listen : {port : 4000},
});


console.log(`Server listening at : ${url}`);