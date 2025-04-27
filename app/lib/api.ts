import { readFromStorage, writeToStorage } from '@/app/lib/storage';
import { ScheduleOption } from '@/app/lib/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const QUIZ_ID_KEY = 'quiz_id';

async function fetchFromApi<T>(endpoint: string, options = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
}

async function submitWithQuizId<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    const quizId = await readFromStorage(QUIZ_ID_KEY);

    const payload = {
        quiz_id: parseInt(quizId, 10),
        ...data
    };
    
    return await fetchFromApi<T>(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
}

export async function startQuiz() {
    const data = await fetchFromApi<{ quiz_id: number }>('/quiz');
    const quizId = data.quiz_id;
    await writeToStorage(QUIZ_ID_KEY, quizId.toString());
}

export async function getScheduleOptions(): Promise<ScheduleOption[]> {
    return await fetchFromApi<ScheduleOption[]>('/schedule');
}

export async function submitScheduleOptions(selectedIds: number[]): Promise<{ status: string }> {
    return await submitWithQuizId<{ status: string }>('/schedule', {
        selectedt: selectedIds
    });
}

