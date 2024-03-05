# Hashira-Chat
-  It is a scalable webSocket-based chatting website that facilitates users to chat with each other by creating chat rooms.
-  Implemented an optimized layout by utilizing queues for message provision and consumption ,alongside node clusters for horizontally scaling the website with a round-robin load balancer.
 Catapulted system performance by harnessing the Redis Publish/Subscribe(Pub/Sub) messaging system.

## To run locally
- Clone the above repository .
- Get into the server directory and fill the `.env` file with refference to `.env.example` file .
- Install the `node modules`  required for the `client` and `server` directory by `npm install` .
- Then in the client directory : `npm run dev` 
- And similarly in the server : `npm start`
