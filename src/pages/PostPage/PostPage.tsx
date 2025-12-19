import { useState, useEffect, type JSX } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { PostsApi } from '../../services/PostsApi';
import type { Post } from '../../types/posts';
import styles from './PostPage.module.css';

//Страница для просмотра одного поста
export function PostPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();//id из url с помощью хука useParams
  const location = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true); //Загрузка
  
  // Получаем сохраненную страницу и лимит из state, если они есть, чтобы при нажатии на кнопку назад переход осуществлялся на ту же страницу, где расположен пост, подробности которого смотрел пользователь
  const savedPage = location.state?.page || 1;
  const savedLimit = location.state?.limit || 10;

  //подтягиваю 1 пост
  useEffect(() => {
    if (!id) return; //останавливаю дальнейшее исполнение, если айдишка не пришла
    const fetchPost = async () => {
      try {
        const data = await PostsApi.getOne(Number(id));// в хук useParams мы получаем id как string, поэтому перевожу тут в number
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (!post) return <div>Пост не найден</div>;

  return (
    <div className={styles.container}>
      <Link to={`/?_page=${savedPage}&_limit=${savedLimit}`}>← Назад</Link>
      <article className={styles.post}>
        <img 
          src={`https://picsum.photos/800/400?random=${post.id}`} // решила чуть симпатичнее сделать отображение, поэтому добавила рандомную картинку
          alt={post.title}
          className={styles.postImage}
        />
        <div className={styles.postHeader}>
          <h1>{post.title}</h1>
          <div className={styles.postMeta}>
            {/* в API особо ничего не было, кроме айди и тайтла + описания, поэтому решила вывести все, что там было, выбор невелик */}
            <span>ID: {post.id}</span>
            <span>User ID: {post.userId}</span>
          </div>
        </div>
        <div className={styles.postBody}>
          <p>{post.body}</p>
        </div>
      </article>
    </div>
  );
}
