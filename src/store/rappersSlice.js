import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchRappers = createAsyncThunk('rappers/fetch', async () => {
  const resp = await fetch('http://localhost:3000/rappers')
  return resp.json()
})

export const fetchNextBoss = createAsyncThunk('rappers/fetchNextBoss', async ({ userId, rapperId }) => {
  const resp = await fetch(`http://localhost:3000/users/${userId}/get_boss?rapper_id=${rapperId}`)
  return resp.json()
})

const rappersSlice = createSlice({
  name: 'rappers',
  initialState: {
    list: [],
    bossList: [],
    bossIndex: 0,
    boss: null,
    selected: null,
    beatenBossIds: []
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
    builder.addCase(fetchNextBoss.fulfilled, (state, action) => {
      const { boss, beaten_boss_ids } = action.payload
      state.beatenBossIds = beaten_boss_ids || []

      if (boss) {
        const idx = state.bossList.findIndex(b => b.id === boss.id)
        if (idx !== -1) {
          state.bossIndex = idx
          state.boss = state.bossList[idx]
        }
      } else if (state.bossList.length > 0) {
        // every boss already beaten
        state.bossIndex = state.bossList.length
        state.boss = null
      }
    })
  }
})

export const { selectRapper, advanceBoss } = rappersSlice.actions
export default rappersSlice.reducer
