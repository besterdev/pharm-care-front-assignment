import { describe, expect, it } from 'vitest'
import { normalizeTasks } from './task'

describe('normalizeTasks', () => {
  it('uses stable keys and flags duplicate IDs and invalid dates', () => {
    const tasks = normalizeTasks([
      { id: 'same', customerName: 'Mai', serviceType: 'chat', createdAt: '2026-06-30T09:00:00.000Z' },
      { id: 'same', customerName: 'Ploy', serviceType: 'chat', createdAt: 'invalid-date' },
    ])

    expect(tasks.every((task) => task.key.startsWith('task-'))).toBe(true)
    expect(tasks[0].key).not.toBe(tasks[1].key)
    expect(tasks[0].dataIssues).toEqual(['duplicate_id'])
    expect(tasks[1].dataIssues).toEqual(['duplicate_id', 'invalid_created_at'])
  })
})
