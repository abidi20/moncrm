// api/stats.js
import express from "express"
import mysql from "mysql2/promise"

const router = express.Router()

// connexion à la base
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ton_mot_de_passe",
  database: "ta_base",
})

router.get("/stats", async (req, res) => {
  try {
    const [contacts] = await db.query("SELECT COUNT(*) AS total FROM contacts")
    const [interactions] = await db.query("SELECT COUNT(*) AS total FROM interactions WHERE MONTH(date) = MONTH(NOW())")
    const [opportunites] = await db.query("SELECT COUNT(*) AS total FROM opportunites WHERE statut = 'active'")
    const tauxConversion = 18.2 // tu peux le calculer depuis ta base si tu veux

    res.json({
      totalContacts: contacts[0].total,
      interactionsMois: interactions[0].total,
      opportunitesActives: opportunites[0].total,
      tauxConversion,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques" })
  }
})

export default router
