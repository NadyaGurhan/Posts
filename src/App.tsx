import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { PostPage } from './pages/PostPage/PostPage';
import './App.css';
import type { JSX } from 'react';

function App(): JSX.Element {
  return (
    //здесь прописываю Routes, при большом количестве Routes вынесла бы их в отдельный файл Router.tsx
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route 
            path="*" 
            element={
              <div className="not-found">
                <h1>404 - Страница не найдена</h1>
                <p>Это сайт на 2 страницы, конечно, она не найдена...</p>
                <a href="/">Вернуться на главную</a>
              </div>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;