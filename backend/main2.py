import psycopg2

try:
    conn = psycopg2.connect(
        host="db.lkuvnupemcccfkvrtthw.supabase.co",
        database="postgres",
        user="postgres",
        password="hello123",
        port=5432
    )
    print("✅ Connection successful!")
    conn.close()
except Exception as e:
    print("❌ Connection failed:")
    print(e)
