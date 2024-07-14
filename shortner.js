const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');
const r = require('convert-radix64');
const hasha = require('hasha');

const hashMap = {};

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAAUCZ8xXzS4r7jxMhlvPB6OzKIC0MRE8",
  authDomain: "urlshortner-b1883.firebaseapp.com",
  databaseURL: "https://urlshortner-b1883.firebaseio.com",
  storageBucket: "urlshortner-b1883.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const shorten = async (url) => {
  let hash = hasha(url, { encoding: "base64", algorithm: "md5" });
  hash = hash.slice(0, 4);

  hash = hash.replace(/\//g, '-').replace(/\+/g, '_'); // Replacing characters to make hash URL-safe

  hashMap[hash] = url;
  await writeUserData(url, r.from64(hash), hash);

  return hash;
};

const expand = async (shortcode) => {
  if (shortcode === undefined) {
    throw new Error('Shortcode is required');
  }

  const refPath = `/${r.from64(shortcode)}`;
  const urlRef = ref(db, refPath);

  const snapshot = await get(urlRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return data.url;
  } else {
    if (hashMap[shortcode]) {
      return hashMap[shortcode];
    } else {
      throw new Error('URL not found');
    }
  }
};

const writeUserData = async (url, shortcode, code) => {
  const refPath = `/${shortcode}`;
  const urlRef = ref(db, refPath);

  await set(urlRef, {
    code: code,
    url: url
  });
};

module.exports = { shorten, expand };
