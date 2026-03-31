import sqlite3
DATABASE = 'saas_database.db'
conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(emotion_history)")
columns = cursor.fetchall()
print("COLUMNS IN emotion_history:")
for col in columns:
    print(col)
conn.close()
