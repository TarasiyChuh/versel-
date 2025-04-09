// src/App.jsx
import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './menu/Sidebar';
import AuthButtons from './menu/AuthButtons';
import Search from './menu/Search';

import GameLibrary from './game/GameLibrary';
import GameDetails from './game/GameDetails';
import TopGamesPage from './game/TopGamesPage';
import FreeGames from './game/FreeGames';

import Register from './user/Register';
import Login from './user/Login';
import Account from './user/Account';

import ChatInitiator from './chat/ChatInitiator';
import ProfilePage from './chat/ProfilePage';
import ChatRoom from './chat/ChatRoom';
import Profile from './chat/MyProfile';
import ChatList from './chat/ChatList'

const SettingsPage = () => <div>Сторінка налаштувань (ще не реалізована)</div>;

function App() {
  const currentUserId = "67d2cc2761ccf6d642399ac6";

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-panel">
        {/* Плаваючі кнопки авторизації */}
        <AuthButtons />

        <Search />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<GameLibrary />} />
            <Route path="/game-details/:gameId" element={<GameDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/top" element={<TopGamesPage />} />
            <Route path="/free-games" element={<FreeGames />} />
            <Route path="/account" element={<Profile />} />
            <Route path="/account" element={<Account />} />
            <Route path="/users" element={<ChatInitiator currentUserId={currentUserId} />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/chat/:chatId" element={<ChatRoom currentUserId={currentUserId} />} />
            <Route path="/settings" element={<ChatList />} />
            <Route path="*" element={<div>404: Такої сторінки нема 😅</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
