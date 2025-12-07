"""Archivo con vulnerabilidades intencionales para prueba de Telegram v2"""

# SQL Injection
def get_user(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    return query

# Command Injection
def run_command(cmd):
    import os
    os.system(f"echo {cmd}")
    return

# Buffer Overflow
def unsafe_copy(source):
    buffer = [0] * 10
    for i in range(len(source)):
        buffer[i] = source[i]
    return buffer

# Code Injection
def eval_code(code):
    eval(code)
    return

# XSS vulnerability
def render_html(user_input):
    return f"<div>{user_input}</div>"
