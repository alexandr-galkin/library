import { describe, expect, it, vi } from 'vitest';
import { GameSession } from './GameSession.js';
import { GameStatus } from '../core/GameStatus.js';

function createSession() {
  const state = { data: { currentLevel: 1 }, save: vi.fn() };
  const stats = { totalScore: 42, resetLevel: vi.fn() };
  const timer = { start: vi.fn(), stop: vi.fn(), pause: vi.fn(), resume: vi.fn() };
  const sound = { pauseAudio: vi.fn(), resumeAudio: vi.fn() };
  const level = { id: 1, objects: [], timeLimit: 30 };
  const session = new GameSession({
    state, stats, timer, sound,
    generateLevel: vi.fn(() => level),
  });
  return { session, state, stats, timer, sound, level };
}

describe('GameSession', () => {
  it('starts and loads the current level', () => {
    const { session, state, stats, timer } = createSession();
    expect(session.start()).toBe(true);
    expect(session.status).toBe(GameStatus.PLAYING);
    expect(session.active).toBe(true);
    expect(session.level.id).toBe(state.data.currentLevel);
    expect(stats.resetLevel).toHaveBeenCalledOnce();
    expect(timer.start).toHaveBeenCalledWith(30);
  });

  it('pauses and resumes the active session', () => {
    const { session, timer, sound } = createSession();
    session.start();
    expect(session.pause()).toBe(true);
    expect(session.status).toBe(GameStatus.PAUSED);
    expect(timer.pause).toHaveBeenCalledOnce();
    expect(sound.pauseAudio).toHaveBeenCalledOnce();
    expect(session.resume()).toBe(true);
    expect(session.status).toBe(GameStatus.PLAYING);
    expect(timer.resume).toHaveBeenCalledOnce();
    expect(sound.resumeAudio).toHaveBeenCalledOnce();
  });

  it('advances the level through the state boundary', () => {
    const { session, state, timer } = createSession();
    session.start();
    expect(session.next()).toBe(true);
    expect(state.data.currentLevel).toBe(2);
    expect(state.save).toHaveBeenCalledOnce();
    expect(timer.start).toHaveBeenCalledTimes(2);
  });

  it('does not allow duplicate completion transitions', () => {
    const { session } = createSession();
    session.start();
    expect(session.markCompleting()).toBe(true);
    expect(session.markCompleting()).toBe(false);
    expect(session.complete()).toBe(true);
    expect(session.complete()).toBe(false);
  });

  it('stops the session and returns to menu state', () => {
    const { session, timer, sound } = createSession();
    session.start();
    session.stop();
    expect(session.active).toBe(false);
    expect(session.status).toBe(GameStatus.MENU);
    expect(session.level).toBeNull();
    expect(timer.stop).toHaveBeenCalled();
    expect(sound.pauseAudio).toHaveBeenCalled();
  });
});
