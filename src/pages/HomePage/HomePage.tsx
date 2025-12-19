import { useState, useEffect, type JSX } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PostsApi } from '../../services/PostsApi';
import type { Post } from '../../types/posts';
import styles from './HomePage.module.css';

//страница со списком постов
export function HomePage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();     //хук react-router-dom: query-параметры.
  
  // Читаем параметры из URL, если их нет - используем значения по умолчанию, 
  const limit = parseInt(searchParams.get('_limit') || '10', 10); //приходит строка, перевожу в число, если параметр не пришел, ставлю значение по умолчанию (10)
  const currentPage = parseInt(searchParams.get('_page') || '1', 10); //если параметр не пришел, ставлю значение по умолчанию (1)
  
  const [posts, setPosts] = useState<Post[]>([]); //все посты
  const [loading, setLoading] = useState(true); //Загрузка
  const [totalCount, setTotalCount] = useState(0); //общее количество постов

  // Функции для обновления параметров в URL: для количества постов на странице и номера страницы
  const updateLimit = (newLimit: number) => {
    const params = new URLSearchParams(searchParams); //копия query-параметров 
    params.set('_limit', newLimit.toString());
    params.set('_page', '1'); // перебрасываю на первую страницу, если изменить количество постов на странице
    setSearchParams(params);
  };

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('_page', newPage.toString());
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        //подтягиваю все посты с помощью PostsApi
        const data = await PostsApi.getAll(limit, currentPage);
        setPosts(data.posts);
        // totalCount — общее количество постов, в PostsApi возвращается данное значени
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [limit, currentPage]);

  const totalPages = Math.ceil(totalCount / limit); // считаю общее количество страниц при разном количестве карточек на одной странице

  return (
    <div className={styles.container}>
      <h1>Список постов</h1>
      <p>Всего постов: {totalCount} | Страница: {currentPage} из {totalPages}</p>
      {/* инпут для ввода количества постов на странице */}
      <div className={styles.controls}>
        <label>Показывать по: </label>
        <input 
          type="number" 
          min="1" 
          value={limit} 
          onChange={(e) => {
            const newLimit = parseInt(e.target.value, 10);
            if (!isNaN(newLimit) && newLimit > 0) {
              updateLimit(newLimit);
            }
          }}
          onBlur={(e) => {
            // Если поле пустое или невалидное, то возвращаю предыдущее значение
            const newLimit = parseInt(e.target.value, 10);
            if (isNaN(newLimit) || newLimit < 1) {
              e.target.value = limit.toString();
            }
          }}
        />
      </div>
{/* //условный рендеринг и тернарный оператор: ситуация, когда загрузка и когда посты подтянулись */}
      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : (
        <>
          <div className={styles.postList}>
            {posts.map(post => (
              <article key={post.id} className={styles.postCard}>
                <img 
                  src={`https://picsum.photos/400/200?random=${post.id}`} //картинка рандомная для более приятного визуального отображения
                  alt={post.title}
                  className={styles.postImage}
                />
                <div className={styles.postContent}>
                  <h2>
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p>{post.body}</p>
                  <Link to={`/post/${post.id}`} className={styles.button}>Узнать подробнее →</Link>
                </div>
              </article>
            ))}
          </div>
{/* пагинация в случае, когда более 1 страницы */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={currentPage === 1} onClick={() => updatePage(currentPage - 1)}>←</button> 
              {/* //кнопка ← заблокирована, когда currentPage === 1. При клике вызывает updatePage(currentPage - 1). */}
              
              {/* создаём массив страниц: */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                //показываем первую, последнюю, текущую и соседние страницы, можно и изменить, но так в основном стандартно:
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={currentPage === page ? styles.active : ''}
                      onClick={() => updatePage(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className={styles.ellipsis}>...</span>;
                }
                return null;
              })}
              
              <button disabled={currentPage === totalPages} onClick={() => updatePage(currentPage + 1)}>→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
