import React, { Component } from 'react'
import { searchLyrics } from './services/lyricService'

const MAX_HP = 3  // matches rapper lives from backend

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
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
      score: 0,
      streak: 0,
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
      round: null,
      score: 0,
      streak: 0,
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
      this.setState({ songs, searching: false }, () => {
        if (songs.length >= 4) this.startRound()
      })
    } catch (err) {
      this.setState({ searchError: err.message, searching: false })
    }
  }

  startRound() {
    const { songs } = this.state
    const correctSong = pickRandom(songs)
    const lines = correctSong.plainLyrics.split('\n').filter(Boolean)
    const lyricLine = pickRandom(lines)
    const distractors = shuffle(songs.filter(s => s.id !== correctSong.id)).slice(0, 3)
    const choices = shuffle([correctSong, ...distractors])
    this.setState({ round: { correctSong, lyricLine, choices }, selectedChoice: null, result: null })
  }

  handleChoiceSelect(song) {
    const { round, score, streak } = this.state
    const isCorrect = song.id === round.correctSong.id

    if (isCorrect) {
      const newStreak = streak + 1
      this.setState({
        selectedChoice: song,
        result: 'correct',
        score: score + 100 * newStreak,
        streak: newStreak,
      })
    } else {
      this.setState({ selectedChoice: song, result: 'wrong', streak: 0 })
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
      score,
      streak,
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
            {/* HUD */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '16px 0' }}>
              <span style={{ fontWeight: 'bold', marginRight: 12 }}>Score: {score}</span>
              {streak > 1 && (
                <span style={{ color: '#f57c00', fontWeight: 'bold' }}>{streak}x streak!</span>
              )}
            </div>

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
                    ? `Correct! +${100 * streak}`
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

        {/* Game Over */}
        {gameOver && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <h2 style={{ fontSize: 32, marginBottom: 8 }}>Game Over</h2>
            <p style={{ fontSize: 20, marginBottom: 20 }}>Final Score: <strong>{score}</strong></p>
            <button
              onClick={this.restartGame}
              style={{ padding: '10px 32px', fontSize: 16, cursor: 'pointer', borderRadius: 6 }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default GuessTheLyric
