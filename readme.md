# Magic Eight ball smart contract

A contract simulating a magic eight ball. It will randomly return one of eight responses depending on the blockchain height.

## Usage

The contract uses one main method: `get-eight-ball-decision-at`.

### `get-eight-ball-decision-at`

This method takes in a uint `height`, gets the hash at that height, and uses the last byte of that hash to pick one of eight responses. The eight responses are:

- "It is certain."
- "Outlook good."
- "You may rely on it."
- "Ask again later."
- "Concentrate and ask again."
- "Reply hazy, try again."
- "My reply is no."
- "My sources say no."
