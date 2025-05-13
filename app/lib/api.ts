import { readFromStorage, writeToStorage } from '@/app/lib/storage';
import { ScheduleOption, TagOption, Activity, Result } from '@/app/lib/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
const QUIZ_ID_KEY = 'quiz_id';

async function apiRequest<T>(
    endpoint: string, 
    options: { 
        method?: string, 
        body?: Record<string, any>,
        includeQuizId?: boolean 
    } = {}
): Promise<T> {
    const { method = 'GET', body = {}, includeQuizId = false } = options;
    let url = `${API_URL}${endpoint}`;
    
    if (includeQuizId) {
        const quizId = await readFromStorage<string>(QUIZ_ID_KEY);
        if (!quizId) {
            throw new Error('Quiz ID not found in storage');
        }
        
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}quiz_id=${quizId}`;
    }
    
    const fetchOptions: RequestInit = { method };
    
    if (method !== 'GET' && Object.keys(body).length > 0) {
        fetchOptions.headers = { 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
}

export async function startQuiz(): Promise<void> {
    const data = await apiRequest<{ quiz_id: number }>('/quiz', { method: 'POST' });
    await writeToStorage(QUIZ_ID_KEY, data.quiz_id.toString());
}

export async function getScheduleOptions(): Promise<ScheduleOption[]> {
    return await apiRequest<ScheduleOption[]>('/schedule');
}

export async function submitScheduleOptions(selectedIds: number[]): Promise<{ status: string }> {
    return await apiRequest<{ status: string }>('/schedule', {
        method: 'POST',
        body: { selected_ids: selectedIds },
        includeQuizId: true
    });
}

export async function getTagOptions(): Promise<TagOption[]> {
    return await apiRequest<TagOption[]>('/tags');
}

export async function submitTagOptions(selectedIds: number[]): Promise<{ status: string }> {
    return await apiRequest<{ status: string }>('/tags', {
        method: 'POST',
        body: { selected_ids: selectedIds },
        includeQuizId: true
    });
}

export async function getEssentialActivities(): Promise<string[]> {
    return await apiRequest<string[]>('/activities');
}

export async function submitEssentialActivities(selectedIds: number[]): Promise<{ status: string }> {
    return await apiRequest<{ status: string }>('/activities', {
      method: 'POST',
      body: { selected_ids: selectedIds },
      includeQuizId: true,
    });
}

export async function getSwipes(): Promise<Activity[]> {
    return await apiRequest<Activity[]>('/swipes', { includeQuizId: true });
}

export async function submitSwipesResults(acceptedIds: number[], rejectedIds: number[]): Promise<{ status: string }> {
    return await apiRequest<{ status: string }>('/swipes', {
        method: 'POST',
        body: { accepted_ids: acceptedIds, rejected_ids: rejectedIds },
        includeQuizId: true
    });
}

export async function getResults(): Promise<Result[]> {
    return await apiRequest<Result[]>('/results', { includeQuizId: true });
}
