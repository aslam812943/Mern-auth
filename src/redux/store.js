import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./User/userSlice.js";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from "redux-persist/es/persistStore";

// Define which parts of user state should be persisted
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['currentUser'], // Only persist non-sensitive user data
  blacklist: ['loading', 'error', 'token'] // Never persist loading states or tokens
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer)
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {

        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      }
    })
});

export const persistor = persistStore(store);