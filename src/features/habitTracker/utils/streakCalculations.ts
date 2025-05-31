import type { Habit, HabitCompletion } from '../types';
import { parseISO, subDays, isSameDay } from 'date-fns';

const getSortedCompletions = (completions: HabitCompletion[]): Date[] => {
  return completions.map(c => parseISO(c.date)).sort((a, b) => b.getTime() - a.getTime());
};
//calculator for streak?
const calculateStreakEndingOn = (habit: Habit, endDate: Date): number => {
    if (habit.frequency !== 'daily') return 0; 

    const sortedCompletions = getSortedCompletions(habit.completions);
    if (sortedCompletions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date(endDate); 

    for (let i = 0; i < 365 * 10; i++) { 
        const found = sortedCompletions.some(compDate => isSameDay(compDate, currentDate));
        if (found) {
            streak++;
            currentDate = subDays(currentDate, 1); 
        } else {
            break; 
        }
    }
    return streak;
};

export const calculateCurrentStreak = (habit: Habit, today: Date = new Date()): number => {
  if (habit.frequency !== 'daily') {
    const todayCompleted = getSortedCompletions(habit.completions).some(compDate => isSameDay(compDate, today));
    return todayCompleted ? 1 : 0;
  }
  const isTodayCompleted = getSortedCompletions(habit.completions).some(compDate => isSameDay(compDate, today));

  if (isTodayCompleted) {
    return calculateStreakEndingOn(habit, today);
  } else {
    return 0; 
  }
};

export const calculateLongestStreak = (habit: Habit): number => {
  if (habit.frequency !== 'daily') {
    return habit.completions.length > 0 ? 1 : 0; 
  }

  const sortedCompletions = getSortedCompletions(habit.completions);
  if (sortedCompletions.length === 0) return 0;

  let longestStreak = 0;

  for (let i = 0; i < sortedCompletions.length; i++) {
    const streakEndingThisDay = calculateStreakEndingOn(habit, sortedCompletions[i]);
    if (streakEndingThisDay > longestStreak) {
        longestStreak = streakEndingThisDay;
    }
  }
  return longestStreak;
};

export const isHabitCompletedOnDate = (habit: Habit, dateString: string): boolean => {
    const targetDate = parseISO(dateString);
    return habit.completions.some(comp => isSameDay(parseISO(comp.date), targetDate));
};