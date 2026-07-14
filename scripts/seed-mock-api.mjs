import { readFile } from 'node:fs/promises'

const inputUrl = process.argv[2]?.trim()

if (!inputUrl) {
  throw new Error('Usage: npm run seed:mock -- https://<project>.mockapi.io/api/v1')
}

const baseUrl = inputUrl.replace(/\/+$/, '')
const tasksUrl = `${baseUrl}/tasks`
const databaseUrl = new URL('../db.json', import.meta.url)
const database = JSON.parse(await readFile(databaseUrl, 'utf8'))

if (!Array.isArray(database.tasks)) {
  throw new Error('db.json must contain a tasks array.')
}

const existingResponse = await fetch(tasksUrl)
if (!existingResponse.ok) {
  throw new Error(`Unable to access ${tasksUrl}: ${existingResponse.status}`)
}

const existingTasks = await existingResponse.json()
if (Array.isArray(existingTasks) && existingTasks.length > 0) {
  throw new Error('The remote tasks resource is not empty. Clear it before seeding to avoid duplicates.')
}

for (const task of database.tasks) {
  const payload = { ...task }
  delete payload.id
  const response = await fetch(tasksUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Unable to seed task ${task.id}: ${response.status}`)
  }
}

console.log(`Seeded ${database.tasks.length} tasks to ${tasksUrl}`)
