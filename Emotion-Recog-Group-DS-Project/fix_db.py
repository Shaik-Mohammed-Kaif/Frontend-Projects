import sqlite3

def run_fix():
    print("Connecting to DB...")
    conn = sqlite3.connect('saas_database.db', timeout=10)
    try:
        conn.execute("ALTER TABLE users ADD COLUMN last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
        conn.commit()
        print("Successfully added last_login column")
    except Exception as e:
        print(f"Error adding last_login: {e}")
        
    try:
        conn.execute("ALTER TABLE users ADD COLUMN force_reset BOOLEAN DEFAULT 0")
        conn.commit()
        print("Successfully added force_reset column")
    except Exception as e:
        print(f"Error adding force_reset: {e}")
        
    try:
        cursor = conn.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        print("Current users columns:", columns)
    except Exception as e:
        print(f"Error listing columns: {e}")

if __name__ == '__main__':
    run_fix()
