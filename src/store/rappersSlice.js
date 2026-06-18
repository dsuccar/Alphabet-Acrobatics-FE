import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchRappers = createAsyncThunk('rappers/fetch', async () => {
  const resp = await fetch('http://localhost:3000/rappers')
  return resp.json()
})

const rappersSlice = createSlice({
  name: 'rappers',
  initialState: {
    list: [],
    boss: null,
    selected: null
  },
  reducers: {
    selectRapper: (state, action) => {
      state.selected = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRappers.fulfilled, (state, action) => {
      state.list = action.payload.filter(rapper => rapper.isboss === false)
      state.boss = action.payload.find(rapper => rapper.isboss === true)
    })
  }
})

export const { selectRapper } = rappersSlice.actions
export default rappersSlice.reducer
