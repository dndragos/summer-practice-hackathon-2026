import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateMatches } from './matchmakingActions';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
    },
    event: {
      create: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('generateMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should group users by sport and create events when thresholds are met', async () => {
    const mockUsers = [
      { id: '1', availableToday: true, sportPreferences: [{ sportName: 'Tennis' }] },
      { id: '2', availableToday: true, sportPreferences: [{ sportName: 'Tennis' }] },
      { id: '3', availableToday: true, sportPreferences: [{ sportName: 'Tennis' }] },
      { id: '4', availableToday: true, sportPreferences: [{ sportName: 'Tennis' }] },
    ];

    (prisma.user.findMany as any).mockResolvedValue(mockUsers);
    (prisma.event.create as any).mockResolvedValue({ id: 'event-1' });

    const result = await generateMatches();

    expect(result.count).toBe(1);
    expect(prisma.event.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sportName: 'Tennis',
        }),
      })
    );
  });

  it('should not create matches if thresholds are not met', async () => {
    const mockUsers = [
      { id: '1', availableToday: true, sportPreferences: [{ sportName: 'Tennis' }] },
      { id: '2', availableToday: true, sportPreferences: [{ sportName: 'Tennis' }] },
      { id: '3', availableToday: true, sportPreferences: [{ sportName: 'Tennis' }] },
    ];

    (prisma.user.findMany as any).mockResolvedValue(mockUsers);

    const result = await generateMatches();

    expect(result.count).toBe(0);
    expect(prisma.event.create).not.toHaveBeenCalled();
  });
});
