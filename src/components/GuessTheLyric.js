import React, { Component } from 'react'
import { getLyrics } from './services/lyricService'

class GuessTheLyric extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lyrics: null,
      loading: false,
      error: null,
      randomLine: null,
      guess: '',
      result: null,
    }
    this.handleFetch = this.handleFetch.bind(this)
    this.handleGuess = this.handleGuess.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  async handleFetch() {
    this.setState({ loading: true, error: null, result: null })

    try {
      const data = await getLyrics({
        trackName: 'The Chain',
        artistName: 'Fleetwood Mac',
      })

      const lines = data.plainLyrics
        ?.split('\n')
        .filter(Boolean)

      const randomLine = lines
        ? lines[Math.floor(Math.random() * lines.length)]
        : null

      this.setState({ lyrics: data, randomLine, loading: false })
    } catch (err) {
      this.setState({ error: err.message, loading: false })
    }
  }

  handleChange(e) {
    this.setState({ guess: e.target.value })
  }

  handleGuess() {
    const { guess, lyrics } = this.state
    const isCorrect = lyrics?.trackName
      .toLowerCase()
      .includes(guess.toLowerCase())

    this.setState({ result: isCorrect ? 'Correct!' : 'Wrong, try again!' })
  }

  render() {
    const { loading, error, randomLine, guess, result } = this.state

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
      <div>
        <button onClick={this.handleFetch}>Get a Lyric</button>

        {randomLine && (
          <div>
            <p><em>"{randomLine}"</em></p>
            <input
              type="text"
              value={guess}
              onChange={this.handleChange}
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