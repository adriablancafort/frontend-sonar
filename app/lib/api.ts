import { readFromStorage, writeToStorage } from '@/app/lib/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const QUIZ_ID_KEY = 'quiz_id';

async function fetchFromApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
}

export async function getQuizId() {
    const data = await fetchFromApi<{ quiz_id: number }>('/quiz');
    const quizId = data.quiz_id;
    await writeToStorage(QUIZ_ID_KEY, quizId.toString());
}
