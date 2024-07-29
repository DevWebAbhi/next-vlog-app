import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import userslice from './features/userslice'
import { combineReducers } from '@reduxjs/toolkit'
import vlogSlice from './features/vlogSlice';
import aiSlice  from './features/aiToolSlice';

const rootReducers = combineReducers({
    userslice,vlogSlice,aiSlice
});
export const makeStore = () => {
  return configureStore({
    reducer: rootReducers,
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
  })
}