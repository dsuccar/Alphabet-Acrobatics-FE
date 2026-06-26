import React, { Component } from 'react'
import { searchLyrics } from '../services/lyricService'

const MAX_HP = 3  // matches rapper lives from backend

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const CURSE_WORDS = /\b(fuck|shit|bitch|nigga|nigger|ass|damn|hell|crap|bastard|dick|cock|pussy|cunt|whore|slut|piss|motherfuck|faggot|retard)\b/i

function isCleanLine(line) {
  return !CURSE_WORDS.test(line) && !/[()]/.test(line)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

class GuessTheLyric extends Component {
  constructor(props) {
    super(props)
    this.state = {
      artistQuery: '',
      searching: false,
      searchError: null,
      hasSearched: false,
      songs: [],
      round: null,
      selectedChoice: null,
      result: null,
    }
    this.handleArtistChange = this.handleArtistChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleChoiceSelect = this.handleChoiceSelect.bind(this)
    this.startRound = this.startRound.bind(this)
    this.nextRound = this.nextRound.bind(this)
    this.restartGame = this.restartGame.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    this.autoSearchSelectedRapper()
  }

  componentWillUnmount() {
    this._isMounted = false
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
      round: null,
      selectedChoice: null,
      result: null,
    })

    try {
      const results = await searchLyrics({ q: artist })
      const songs = results.filter(
        song =>
          song.artistName.toLowerCase().includes(artist.toLowerCase()) &&
          song.plainLyrics
      )
      if (this._isMounted) {
        this.setState({ songs, searching: false }, () => {
          if (songs.length >= 4) this.startRound()
        })
      }
    } catch (err) {
      if (this._isMounted) {
        this.setState({ searchError: err.message, searching: false })
      }
    }
  }

  startRound() {
    const { songs } = this.state
    const correctSong = pickRandom(songs)
    console.log('Correct answer:', correctSong.trackName)
    const lines = correctSong.plainLyrics.split('\n').filter(line => line.trim() && isCleanLine(line))
    if (lines.length === 0) {
      this.startRound()
      return
    }
    const lyricLine = pickRandom(lines)
    const distractors = shuffle(songs.filter(s => s.id !== correctSong.id)).slice(0, 3)
    const choices = shuffle([correctSong, ...distractors])
    this.setState({ round: { correctSong, lyricLine, choices }, selectedChoice: null, result: null })
  }

  handleChoiceSelect(song) {
    const { round } = this.state
    const isCorrect = song.id === round.correctSong.id

    if (isCorrect) {
      this.setState({ selectedChoice: song, result: 'correct' })
      if (this.props.onCorrectAnswer) this.props.onCorrectAnswer()
    } else {
      this.setState({ selectedChoice: song, result: 'wrong' })
      if (this.props.onWrongAnswer) this.props.onWrongAnswer()
    }
  }

  nextRound() {
    this.startRound()
  }

  restartGame() {
    this.runSearch(this.state.artistQuery)
  }

  render() {
    const {
      artistQuery,
      searching,
      searchError,
      hasSearched,
      songs,
      round,
      selectedChoice,
      result,
    } = this.state

    const lives = this.props.lives != null ? this.props.lives : MAX_HP
    const gameOver = lives <= 0

    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'monospace' }}>
        {searching && <p>Searching...</p>}
        {searchError && <p style={{ color: 'red' }}>Error: {searchError}</p>}
        {hasSearched && !searching && !searchError && songs.length < 4 && (
          <p>Not enough songs found to play.</p>
        )}

        {round && (
          <div>

            {/* Lyric prompt */}
            <div style={{
              background: '#1a1a2e',
              color: '#e0e0e0',
              padding: '20px 24px',
              borderRadius: 10,
              margin: '12px 0',
              fontSize: 18,
              textAlign: 'center',
              lineHeight: 1.5,
              border: '2px solid #3f3f6e',
            }}>
              <em>"{round.lyricLine}"</em>
            </div>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: 12 }}>Which song is this from?</p>
            <p style={{ textAlign: 'center', color: '#aaa', fontSize: 12, marginBottom: 8 }}>[Answer: {round.correctSong.trackName}]</p>

            {/* Choices */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {round.choices.map((song, i) => {
                let bg = '#f0f0f0'
                let border = '2px solid #bbb'
                if (selectedChoice) {
                  if (song.id === round.correctSong.id) {
                    bg = '#c8e6c9'
                    border = '2px solid #388e3c'
                  } else if (selectedChoice.id === song.id) {
                    bg = '#ffcdd2'
                    border = '2px solid #d32f2f'
                  }
                }
                return (
                  <button
                    key={song.id}
                    onClick={() => !selectedChoice && this.handleChoiceSelect(song)}
                    style={{
                      background: bg,
                      border,
                      borderRadius: 8,
                      padding: '14px 10px',
                      fontSize: 13,
                      cursor: selectedChoice ? 'default' : 'pointer',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span style={{ marginRight: 8, opacity: 0.6 }}>{['A', 'B', 'C', 'D'][i]}.</span>
                    {song.trackName}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {result && !gameOver && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <p style={{ fontSize: 18, fontWeight: 'bold', color: result === 'correct' ? '#388e3c' : '#d32f2f' }}>
                  {result === 'correct'
                    ? `Hit! Boss takes damage.`
                    : `Wrong! It was "${round.correctSong.trackName}"`}
                </p>
                <button
                  onClick={this.nextRound}
                  style={{ padding: '8px 28px', fontSize: 15, cursor: 'pointer', borderRadius: 6 }}
                >
                  Next Round
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    )
  }
}

export default GuessTheLyric
