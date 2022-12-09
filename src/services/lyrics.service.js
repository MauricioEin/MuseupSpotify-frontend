import axios from 'axios'


const API_KEY = '4e363a325cb491b46e4c3c11b59c8cb7'
const BASE_URL = `https://api.musixmatch.com/ws/1.1/track.search?apikey=${API_KEY}`


export const getLyrics =  async songTitle => {


  console.log('got to service with', songTitle)


  // &${query}&f_has_lyrics=1
  try {


    const res = await axios.get('https://api.musixmatch.com/ws/1.1/track.search?apikey=4e363a325cb491b46e4c3c11b59c8cb7&q_artist=Doja%20Cat&q_track=Need%20to%20Know&f_has_lyrics=1')
    console.log('res.data', res.data)
    return res.data
  } catch (err) {
    console.error('ERROR!', err)
  }
}

