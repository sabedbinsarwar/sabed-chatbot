import { Injectable } from '@nestjs/common';
import Fuse from 'fuse.js';

interface Show {
  name: string;
  genre: string[];
  seasons: number;
  episodes: number;
  seasonEpisodes?: { [season: string]: number };
}

@Injectable()
export class ChatService {
  private shows: Show[] = [
    // Live-action & famous series
    { name: "Game of Thrones", genre: ["fantasy", "drama", "adventure"], seasons: 8, episodes: 73, seasonEpisodes: { "1": 10, "2": 10, "3": 10, "4": 10, "5": 10, "6": 10, "7": 7, "8": 6 } },
    { name: "Breaking Bad", genre: ["crime", "drama", "thriller"], seasons: 5, episodes: 62, seasonEpisodes: { "1": 7, "2": 13, "3": 13, "4": 13, "5": 16 } },
    { name: "Friends", genre: ["comedy", "romance"], seasons: 10, episodes: 236 },
    { name: "Stranger Things", genre: ["sci-fi", "horror", "drama"], seasons: 5, episodes: 46 },
    { name: "The Office", genre: ["comedy"], seasons: 9, episodes: 201 },
    { name: "The Mandalorian", genre: ["sci-fi", "action", "adventure"], seasons: 3, episodes: 24 },
    { name: "The Crown", genre: ["drama", "history"], seasons: 5, episodes: 50 },
    { name: "The Witcher", genre: ["fantasy", "action", "adventure"], seasons: 3, episodes: 24 },
    { name: "Sherlock", genre: ["crime", "drama", "mystery"], seasons: 4, episodes: 13 },
    { name: "Westworld", genre: ["sci-fi", "drama", "thriller"], seasons: 4, episodes: 36 },
    { name: "Rick and Morty", genre: ["comedy", "sci-fi"], seasons: 6, episodes: 61 },
    { name: "Vikings", genre: ["action", "adventure", "history"], seasons: 6, episodes: 89 },
    { name: "Black Mirror", genre: ["sci-fi", "thriller"], seasons: 5, episodes: 22 },
    { name: "House of the Dragon", genre: ["fantasy", "drama"], seasons: 1, episodes: 10 },
    { name: "Better Call Saul", genre: ["crime", "drama"], seasons: 6, episodes: 63 },
    { name: "The Simpsons", genre: ["comedy", "animation"], seasons: 34, episodes: 750 },
    { name: "Lost", genre: ["drama", "mystery", "adventure"], seasons: 6, episodes: 121 },
    { name: "Dexter", genre: ["crime", "drama", "thriller"], seasons: 8, episodes: 96 },
    { name: "The Boys", genre: ["action", "comedy", "superhero"], seasons: 3, episodes: 24 },
    { name: "Peaky Blinders", genre: ["crime", "drama", "history"], seasons: 6, episodes: 36 },
      { name: "The Witcher", genre: ["fantasy", "action", "adventure"], seasons: 3, episodes: 24 },
    { name: "The Umbrella Academy", genre: ["superhero", "drama"], seasons: 3, episodes: 30 },
    { name: "Money Heist", genre: ["crime", "thriller"], seasons: 5, episodes: 41 },
    { name: "The Flash", genre: ["superhero", "action"], seasons: 9, episodes: 184 },
    { name: "Arrow", genre: ["superhero", "action"], seasons: 8, episodes: 170 },
    { name: "Legends of Tomorrow", genre: ["superhero", "action"], seasons: 7, episodes: 110 },
    { name: "Supernatural", genre: ["fantasy", "horror", "drama"], seasons: 15, episodes: 327 },
    { name: "Gotham", genre: ["crime", "drama"], seasons: 5, episodes: 100 },
    { name: "The Flash", genre: ["superhero", "action"], seasons: 9, episodes: 184 },
    { name: "Smallville", genre: ["superhero", "drama"], seasons: 10, episodes: 217 },
    { name: "Lost in Space", genre: ["sci-fi", "adventure"], seasons: 3, episodes: 29 },
    { name: "The Expanse", genre: ["sci-fi", "drama"], seasons: 6, episodes: 62 },
    { name: "Shadow and Bone", genre: ["fantasy", "adventure"], seasons: 2, episodes: 16 },
    { name: "The 100", genre: ["sci-fi", "drama"], seasons: 7, episodes: 100 },
    { name: "Teen Wolf", genre: ["supernatural", "drama"], seasons: 6, episodes: 100 },
    { name: "The Haunting of Hill House", genre: ["horror", "drama"], seasons: 1, episodes: 10 },
    { name: "The Haunting of Bly Manor", genre: ["horror", "drama"], seasons: 1, episodes: 9 },
    { name: "Vikings: Valhalla", genre: ["action", "history"], seasons: 2, episodes: 16 },
    { name: "Dark", genre: ["sci-fi", "thriller"], seasons: 3, episodes: 26 },
    { name: "You", genre: ["thriller", "drama"], seasons: 4, episodes: 40 },
    { name: "The Last Kingdom", genre: ["action", "history"], seasons: 5, episodes: 46 },
    { name: "The Walking Dead", genre: ["horror", "drama"], seasons: 11, episodes: 177 },
    { name: "Fear the Walking Dead", genre: ["horror", "drama"], seasons: 7, episodes: 90 },
    { name: "Loki", genre: ["superhero", "action"], seasons: 2, episodes: 12 },
    { name: "WandaVision", genre: ["superhero", "drama"], seasons: 1, episodes: 9 },
    { name: "Hawkeye", genre: ["superhero", "action"], seasons: 1, episodes: 6 },
    { name: "Ms. Marvel", genre: ["superhero", "action"], seasons: 1, episodes: 6 },
    { name: "Moon Knight", genre: ["superhero", "action"], seasons: 1, episodes: 6 },
    { name: "Obi-Wan Kenobi", genre: ["sci-fi", "action"], seasons: 1, episodes: 6 },

    // Anime shows
     { name: "Akame ga Kill!", genre: ["anime", "action", "adventure"], seasons: 1, episodes: 24 },
    { name: "Blue Exorcist", genre: ["anime", "action", "fantasy"], seasons: 2, episodes: 37 },
    { name: "Boruto", genre: ["anime", "action", "adventure"], seasons: 3, episodes: 250 },
    { name: "Re:Zero", genre: ["anime", "fantasy", "drama"], seasons: 2, episodes: 50 },
    { name: "KonoSuba", genre: ["anime", "comedy", "fantasy"], seasons: 2, episodes: 20 },
    { name: "No Game No Life", genre: ["anime", "fantasy", "adventure"], seasons: 1, episodes: 12 },
    { name: "Overlord", genre: ["anime", "fantasy", "action"], seasons: 3, episodes: 39 },
    { name: "Erased", genre: ["anime", "thriller", "mystery"], seasons: 1, episodes: 12 },
    { name: "Steins;Gate", genre: ["anime", "sci-fi", "drama"], seasons: 1, episodes: 24 },
    { name: "Parasyte", genre: ["anime", "horror", "action"], seasons: 1, episodes: 24 },
    { name: "Vivy: Fluorite Eye’s Song", genre: ["anime", "action", "sci-fi"], seasons: 1, episodes: 13 },
    { name: "Great Pretender", genre: ["anime", "comedy", "crime"], seasons: 2, episodes: 23 },
    { name: "Terror in Resonance", genre: ["anime", "thriller", "drama"], seasons: 1, episodes: 11 },
    { name: "Paranoia Agent", genre: ["anime", "mystery", "drama"], seasons: 1, episodes: 13 },
    { name: "Clannad", genre: ["anime", "romance", "drama"], seasons: 2, episodes: 44 },
    { name: "Clannad: After Story", genre: ["anime", "romance", "drama"], seasons: 1, episodes: 24 },
    { name: "Hellsing Ultimate", genre: ["anime", "action", "horror"], seasons: 1, episodes: 10 },
    { name: "Psycho-Pass", genre: ["anime", "sci-fi", "thriller"], seasons: 3, episodes: 41 },
    { name: "Code Geass", genre: ["anime", "action", "drama"], seasons: 2, episodes: 50 },
    { name: "Gintama", genre: ["anime", "comedy", "action"], seasons: 8, episodes: 367 },
    { name: "Samurai Champloo", genre: ["anime", "action", "adventure"], seasons: 1, episodes: 26 },
    { name: "Ergo Proxy", genre: ["anime", "sci-fi", "mystery"], seasons: 1, episodes: 23 },
    { name: "Akudama Drive", genre: ["anime", "action", "sci-fi"], seasons: 1, episodes: 12 },
    { name: "The Ancient Magus’ Bride", genre: ["anime", "fantasy", "romance"], seasons: 2, episodes: 24 },
    { name: "Granblue Fantasy", genre: ["anime", "fantasy", "action"], seasons: 1, episodes: 12 },
    { name: "Kabaneri of the Iron Fortress", genre: ["anime", "action", "drama"], seasons: 1, episodes: 12 },
    { name: "Yashahime", genre: ["anime", "action", "adventure"], seasons: 2, episodes: 48 },
    { name: "Zatch Bell!", genre: ["anime", "action", "adventure"], seasons: 3, episodes: 150 },
    { name: "Magi", genre: ["anime", "fantasy", "adventure"], seasons: 3, episodes: 75 },
  
    { name: "Naruto", genre: ["anime", "action", "adventure"], seasons: 5, episodes: 220 },
    { name: "Naruto Shippuden", genre: ["anime", "action", "adventure"], seasons: 21, episodes: 500 },
    { name: "One Piece", genre: ["anime", "action", "adventure"], seasons: 20, episodes: 1050 },
    { name: "Dragon Ball Z", genre: ["anime", "action", "adventure"], seasons: 9, episodes: 291 },
    { name: "Dragon Ball Super", genre: ["anime", "action", "adventure"], seasons: 5, episodes: 131 },
    { name: "Attack on Titan", genre: ["anime", "action", "drama"], seasons: 4, episodes: 87 },
    { name: "Death Note", genre: ["anime", "thriller", "mystery"], seasons: 1, episodes: 37 },
    { name: "My Hero Academia", genre: ["anime", "action", "superhero"], seasons: 6, episodes: 138 },
    { name: "Fullmetal Alchemist: Brotherhood", genre: ["anime", "action", "adventure"], seasons: 1, episodes: 64 },
    { name: "One Punch Man", genre: ["anime", "action", "comedy"], seasons: 2, episodes: 24 },
    { name: "Demon Slayer", genre: ["anime", "action", "fantasy"], seasons: 2, episodes: 44 },
    { name: "Tokyo Revengers", genre: ["anime", "action", "drama"], seasons: 1, episodes: 24 },
    { name: "Bleach", genre: ["anime", "action", "adventure"], seasons: 16, episodes: 366 },
    { name: "Black Clover", genre: ["anime", "action", "fantasy"], seasons: 4, episodes: 170 },
    { name: "Sword Art Online", genre: ["anime", "action", "adventure"], seasons: 4, episodes: 96 },
    { name: "Fairy Tail", genre: ["anime", "action", "adventure"], seasons: 9, episodes: 328 },
    { name: "Hunter x Hunter", genre: ["anime", "action", "adventure"], seasons: 6, episodes: 148 },
    { name: "JoJo's Bizarre Adventure", genre: ["anime", "action", "adventure"], seasons: 5, episodes: 190 },
    { name: "Tokyo Ghoul", genre: ["anime", "horror", "drama"], seasons: 2, episodes: 48 },
    { name: "Cowboy Bebop", genre: ["anime", "sci-fi", "action"], seasons: 1, episodes: 26 },
  ];

  
private basicResponses: { [key: string]: string } = {
  // Greetings
  hi: "Hello! How can I assist you today?",
  hello: "Hi there! Ready to chat about your favorite shows?",
  hey: "Hey! How’s it going?",
  "hi there": "Hello! How’s your day going?",
  "what's up": "Not much! Just here to help you find info about shows.",
  yo: "Hey there! Ready to chat?",
  sup: "Not much! Just here to help with shows.",
  "good morning": "Good morning! Ready to talk shows?",
  "good afternoon": "Good afternoon! What shows are you watching today?",
  "good evening": "Good evening! Want some series recommendations?",
  "good night": "Good night! Sleep well and dream about your favorite shows.",

  // Farewells
  bye: "Goodbye! Have a nice day!",
  goodbye: "See you later!",
  "see you": "Catch you later!",
  "talk later": "Sure, talk to you later!",
  "catch you later": "Bye for now!",

  // Gratitude
  thanks: "You're welcome!",
  "thank you": "Anytime! Happy to help.",
  "thx": "No problem!",
  
  // Questions about bot
  "what is your name": "I am Seiam's Bot, your friendly TV & anime guide!",
  "who are you": "I am your custom chatbot here to help with shows and anime.",
  "who created you": "I was made by Seiam, your friendly developer!",
  "how old are you": "I don’t have an age, but I’m always learning!",
  "are you real": "I exist in code and conversation!",
  "are you a bot": "Yes, I am a chatbot created to help you with shows.",
  "can you help me": "Of course! Ask me about any show or genre.",
  help: "Sure! I can tell you about seasons, episodes, and genres.",
  "what can you do": "I can tell you about TV shows, anime, seasons, episodes, and genres!",

  // Casual small talk
  "how are you": "I am a bot, but I’m feeling great! How about you?",
  "i am fine": "Glad to hear that! Want some show recommendations?",
  "i am good": "Awesome! Let’s chat about some shows.",
  "not good": "Oh no! Maybe talking about shows can cheer you up.",
  "what are you doing": "Just waiting to talk about your favorite shows!",
  "tell me a joke": "Why did the anime character bring a ladder? To reach new heights!",
  "favorite show": "I love all shows! What’s your favorite?",
  "favorite anime": "Anime are awesome! I can give you info about them too.",
  "favorite genre": "I like all genres equally! What’s yours?",

  // Slang & casual phrases
  lol: "Haha! Glad you’re having fun!",
  lmao: "😂 You made me laugh!",
  omg: "Oh my! Tell me more about what you’re watching!",
  "omg!": "Wow, sounds exciting!",
  wow: "Impressive! Which show are you talking about?",
  "cool": "Glad you think so!",
  "awesome": "Absolutely! Shows can be amazing!",
  "nice": "Nice! I love that show too!",
  "thanks a lot": "You’re welcome!",
  "thx a lot": "No problem!",

  // Common conversational fillers
  hmm: "Hmm… let me think. Maybe you’ll like some of these shows.",
  "i see": "I’m glad you understand!",
  "got it": "Perfect! Let’s continue.",
  okay: "Okay! What show do you want info about next?",
  ok: "Ok! Let’s chat more.",
  yep: "Yes! I can help you with that.",
  nope: "No worries! Maybe another show?",
  "maybe": "Maybe… let’s explore some shows together.",
  "i don’t know": "No worries! I can suggest some popular shows for you.",

  // Encouraging / positive replies
  "thank you so much": "You’re welcome! Happy to help!",
  "you are awesome": "Thanks! You’re awesome too!",
  "you are the best": "Aww, thanks! Let’s talk shows!",

  
};


  private fuse: Fuse<Show>;

  constructor() {
    // Initialize fuse.js with keys for fuzzy search
    this.fuse = new Fuse(this.shows, {
      keys: ['name', 'genre'],
      threshold: 0.4, // Adjust for fuzzy tolerance
    });
  }
getSuggestions(query: string): string[] {
  if (!query.trim()) return [];

  const input = query.toLowerCase().trim();

  // Suggest shows by name
  const showMatches = this.shows
    .filter((s) => s.name.toLowerCase().includes(input))
    .map((s) => s.name);

  // Suggest genres
  const genreMatches = this.shows
    .flatMap((s) => s.genre)
    .filter((g) => g.includes(input));

  // Combine and remove duplicates
  return Array.from(new Set([...showMatches, ...genreMatches])).slice(0, 10);
}

  sendMessage(message: string): string {
    const input = message.toLowerCase().trim();

    // 1️⃣ Check basic greetings first
    for (const key in this.basicResponses) {
      if (input.includes(key)) return this.basicResponses[key];
    }

    // 2️⃣ Check for season requests like "Game of Thrones season 2"
    const seasonMatch = input.match(/season (\d+)/i);
    const seasonNumber = seasonMatch ? seasonMatch[1] : null;

    // 3️⃣ Fuzzy search for shows
    const results = this.fuse.search(input);
    if (results.length > 0) {
      const show = results[0].item;

      if (seasonNumber && show.seasonEpisodes) {
        if (show.seasonEpisodes[seasonNumber]) {
          return `${show.name} Season ${seasonNumber} has ${show.seasonEpisodes[seasonNumber]} episodes.`;
        } else {
          return `Sorry, I don't have info for Season ${seasonNumber} of ${show.name}.`;
        }
      }

      return `${show.name} has ${show.seasons} seasons and ${show.episodes} episodes. Genres: ${show.genre.join(", ")}.`;
    }

    // 4️⃣ Search by genre if no show match
    const genreMatch = this.shows.filter((s) =>
      s.genre.some((g) => input.includes(g))
    );
    if (genreMatch.length) {
      return `Shows in this genre: ${genreMatch.map((s) => s.name).join(", ")}.`;
    }

    return "Sorry, I don't have information about that show or genre yet.";
  }
}