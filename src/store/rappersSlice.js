import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchRappers = createAsyncThunk('rappers/fetch', async () => {
  const resp = await fetch('http://localhost:3000/rappers')
  return resp.json()
})

const rappersSlice = createSlice({
  name: 'rappers',
  initialState: {
    list: [],
    bossList: [],
    bossIndex: 0,
    boss: null,
    selected: null
  },
  reducers: {
    selectRapper: (state, action) => {
      state.selected = action.payload
    },
    advanceBoss: (state) => {
      const next = state.bossIndex + 1
      if (next < state.bossList.length) {
        state.bossIndex = next
        state.boss = state.bossList[next]
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRappers.fulfilled, (state, action) => {
      state.list = action.payload.filter(r => r.isboss === false)
      const bosses = action.payload
        .filter(r => r.isboss === true)
        .sort((a, b) => Number(a.difficulty) - Number(b.difficulty))
      state.bossList = bosses
      state.bossIndex = 0
      state.boss = bosses[0] || null
    })
  }
})

export const { selectRapper, advanceBoss } = rappersSlice.actions
export default rappersSlice.reducer
