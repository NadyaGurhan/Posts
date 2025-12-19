//Отдельный файл с подтягиванием всех постов и одного поста. Использовала axios по привычке, но можно и обычным встроенным fetch
import axios from 'axios';
import type { Post } from '../types/posts';
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; //взяла из ТЗ

export class PostsApi {
  //получить все посты с пагинацией
  static async getAll(limit: number, page: number): Promise<{ posts: Post[]; totalCount: number }> {
    /*трай-кэч использую в конструкции async/await для того, чтобы отлавливать возможные ошибки, если промис не выполнится (reject после пендинга).
    Это кажется максимально очевидным, но решила написать */
    try {
      const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`, {
        params: {
          _limit: limit,
          _page: page
        }
      });
//totalCount беру из HTTP заголовка ответа x-total-count; если заголовка нет, по умолчанию поставила 100, в https://jsonplaceholder.typicode.com/posts как раз 100 постов
      const totalCountHeader = response.headers['x-total-count'];
      const totalCount = totalCountHeader ? parseInt(String(totalCountHeader), 10) : 100;

      return {
        posts: response.data,
        totalCount
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  //Получить 1 пост по id
  static async getOne(id: number): Promise<Post> {
    try {
      const { data } = await axios.get<Post>(`${API_BASE_URL}/posts/${id}`);
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

