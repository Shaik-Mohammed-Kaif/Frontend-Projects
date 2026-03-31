import sqlite3
DATABASE = 'saas_database.db'
conn = sqlite3.connect(DATABASE)
try:
    conn.execute("ALTER TABLE system_settings ADD COLUMN confidence_threshold REAL DEFAULT 0.70")
    print("Added confidence_threshold")
except:
    print("confidence_threshold already exists")
    
try:
    conn.execute("ALTER TABLE system_settings ADD COLUMN alert_cooldown INTEGER DEFAULT 30")
    print("Added alert_cooldown")
except:
    print("alert_cooldown already exists")

# Initialize default values if row 1 is missing them
row = conn.execute("SELECT * FROM system_settings WHERE id=1").fetchone()
if not row:
    conn.execute("INSERT INTO system_settings (id, admin_email, alert_enabled, confidence_threshold, alert_cooldown) VALUES (1, 'admin@emotionai.com', 1, 0.70, 30)")
    print("Created default settings row")
else:
    # Ensure current row isn't NULL for new columns
    conn.execute("UPDATE system_settings SET confidence_threshold=0.70 WHERE confidence_threshold IS NULL")
    conn.execute("UPDATE system_settings SET alert_cooldown=30 WHERE alert_cooldown IS NULL")

conn.commit()
conn.close()
print("Migration Complete.")
