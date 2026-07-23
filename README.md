# Study of associations between unrelated concepts
**My small website project to study how we associate unrelated concepts for example between animals and numbers** 

## How to run
This is the most basic NextJS app

To start development server run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Inspiration
This is inspired by a game we played with friends

## Structure
### Study
The website is organised into `studies`. Each study owns set of `VoteOptions`, which are the options to associate a concept with (e.g. numbers 0-9). Each study owns set of `Item`s, those are the target concepts (e.g. animals). The amount of `VoteOption`s should not change during the study, whereas `Item`s can.

### User
When participant first visits the website, an UUID is given to them (`src/app/proxy.ts`). This UUID is stored in cookies and indentifies the participant. No other identificator of the participant is stored. Therefore, the participant is anonymous as long as the POST and GET requests are not recorded.

//TODO: UUID is stored in cookies, which means that participant can easily delete it. Further protection will be needed to avoid spam

