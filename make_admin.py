"""Назначает администратора локальному учебному сайту.

Запуск: py make_admin.py
Затем введите email уже зарегистрированного аккаунта.
Этот скрипт следует запускать локально, а не выкладывать на публичный сервер.
"""
from app import get_db_connection, init_db


def main() -> None:
    init_db()
    email = input("Email существующего аккаунта, которому дать роль администратора: ").strip().lower()
    if not email:
        print("Email не указан. Ничего не изменено.")
        return

    with get_db_connection() as connection:
        user = connection.execute(
            "SELECT id, full_name, email, role FROM users WHERE email = ? COLLATE NOCASE",
            (email,),
        ).fetchone()
        if user is None:
            print("Аккаунт с такой почтой не найден. Сначала зарегистрируйся на сайте.")
            return
        connection.execute("UPDATE users SET role = 'admin' WHERE id = ?", (user["id"],))

    print(f"Готово: для аккаунта {user['email']} ({user['full_name']}) включена роль администратора.")
    print("Выйди из аккаунта и войди снова, затем открой http://127.0.0.1:5000/admin")


if __name__ == "__main__":
    main()
