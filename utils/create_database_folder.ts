// This file is executed after npm install by the command `npx tsx utils/create_database_folder.ts`

import env from '#start/env'
import { existsSync, mkdirSync } from 'node:fs'

const dbPath = env.get('DB_PATH')

// Vérifier si le dossier existe
if (!existsSync(dbPath)) {
  console.log(`Le dossier ${dbPath} n'existe pas. Création en cours...`)
  try {
    // Créer le dossier avec ses parents
    mkdirSync(dbPath, { recursive: true })
    console.log(`Le dossier ${dbPath} a été créé avec succès.`)
  } catch (error) {
    console.error(`Erreur lors de la création du dossier ${dbPath} :`, error)
  }
} else {
  console.log(`Le dossier ${dbPath} existe déjà.`)
}
