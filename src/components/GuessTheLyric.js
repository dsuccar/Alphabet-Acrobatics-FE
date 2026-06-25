import React, { Component } from 'react'
import { searchLyrics } from './services/lyricService'

class GuessTheLyric extends Component {
  constructor(props) {
    super(props)
    this.state = {
      artistQuery: '',
      searching: false,
      searchError: null,
      hasSearched: false,
      songs: [],
      selectedSong: null,
      randomLine: null,
      guess: '',
      result: null,
    }
    this.handleArtistChange = this.handleArtistChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelectSong = this.handleSelectSong.bind(this)
    this.handleGuessChange = this.handleGuessChange.bind(this)
    this.handleGuess = this.handleGuess.bind(this)
  }

  componentDidMount() {
    this.autoSearchSelectedRapper()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedRapper?.name !== this.props.selectedRapper?.name) {
      this.autoSearchSelectedRapper()
    }
  }

  autoSearchSelectedRapper() {
    const artist = this.props.selectedRapper?.name
    if (artist) {
      this.setState({ artistQuery: artist })
      this.runSearch(artist)
    }
  }

  handleArtistChange(e) {
    this.setState({ artistQuery: e.target.value })
  }

  handleSearch(e) {
    e.preventDefault()
    const artist = this.state.artistQuery.trim()
    if (!artist) return
    this.runSearch(artist)
  }

  async runSearch(artist) {
    this.setState({
      searching: true,
      searchError: null,
      hasSearched: true,
      songs: [],
      selectedSong: null,
      randomLine: null,
      result: null,
    })

    try {
      const results = await searchLyrics({ q: artist })
      const songs = results.filter(
        song => song.artistName.toLowerCase() === artist.toLowerCase()
      )
      this.setState({ songs, searching: false })

      if (songs.length > 0) {
        const song = songs[Math.floor(Math.random() * songs.length)]
        this.handleSelectSong(song)
      }
    } catch (err) {
      this.setState({ searchError: err.message, searching: false })
    }
  }

  handleSelectSong(song) {
    const lines = song.plainLyrics?.split('\n').filter(Boolean)
    const randomLine = lines ? lines[Math.floor(Math.random() * lines.length)] : null

    this.setState({ selectedSong: song, randomLine, guess: '', result: null })
  }

  handleGuessChange(e) {
    this.setState({ guess: e.target.value })
  }

  handleGuess() {
    const { guess, selectedSong } = this.state
    const isCorrect = selectedSong?.trackName
      .toLowerCase()
      .includes(guess.toLowerCase())

    this.setState({ result: isCorrect ? 'Correct!' : 'Wrong, try again!' })
  }

  render() {
    const {
      artistQuery,
      searching,
      searchError,
      hasSearched,
      songs,
      selectedSong,
      randomLine,
      guess,
      result,
    } = this.state

    return (
      <div>
        <form onSubmit={this.handleSearch}>
          <input
            type="text"
            value={artistQuery}
            onChange={this.handleArtistChange}
            placeholder="Search an artist..."
          />
          <button type="submit">Search Artist</button>
        </form>

        {searching && <p>Searching...</p>}
        {searchError && <p>Error: {searchError}</p>}

        {hasSearched && !searching && !searchError && songs.length === 0 && (
          <p>No songs found for "{artistQuery}".</p>
        )}

        {!selectedSong && songs.length > 0 && (
          <ul>
            {songs.map(song => (
              <li key={song.id}>
                <button onClick={() => this.handleSelectSong(song)}>
                  {song.trackName}{song.albumName ? ` (${song.albumName})` : ''}
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedSong && randomLine && (
          <div>
            <p><em>"{randomLine}"</em></p>
            <input
              type="text"
              value={guess}
              onChange={this.handleGuessChange}
              placeholder="Name that song..."
            />
            <button onClick={this.handleGuess}>Submit Guess</button>
            {result && <p>{result}</p>}
          </div>
        )}
      </div>
    )
  }
}

export default GuessTheLyric
