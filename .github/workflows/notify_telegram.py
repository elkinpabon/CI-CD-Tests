#!/usr/bin/env python3
"""Send vulnerability notifications to Telegram"""
import json
import os
import sys
import requests
from datetime import datetime
import re

def escape_markdown(text):
    """Escape special markdown characters for Telegram"""
    if not text:
        return ""
    # Escape markdown special characters
    special_chars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']
    for char in special_chars:
        text = text.replace(char, '\\' + char)
    return text

def send_telegram_notification():
    """Read vulnerability report and send Telegram notification"""
    
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        print('⚠️ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
        return False
    
    try:
        with open('vulnerability_report.json') as f:
            report = json.load(f)
        
        vulnerabilities = report.get('vulnerabilities', [])
        summary = report.get('summary', {})
        timestamp = report.get('timestamp', '')
        
        # Get commit info from GitHub Actions environment
        commit_message = os.getenv('GITHUB_COMMIT_MESSAGE', 'Unknown')
        commit_author = os.getenv('GITHUB_ACTOR', 'Unknown')
        
        # Parse timestamp to readable format
        try:
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            readable_time = dt.strftime('%d/%m/%Y %H:%M:%S')
        except:
            readable_time = timestamp
        
        if vulnerabilities:
            # Message for vulnerabilities found
            message = f"🚨 *VULNERABILIDADES DETECTADAS* 🚨\n\n"
            message += f"📊 *Resumen:*\n"
            message += f"• Total: {len(vulnerabilities)} vulnerabilidades\n"
            message += f"• Críticas: {summary.get('critical', 0)}\n"
            message += f"• Altas: {summary.get('high', 0)}\n"
            message += f"• Medias: {summary.get('medium', 0)}\n"
            message += f"• Bajas: {summary.get('low', 0)}\n\n"
            message += f"🔍 *Top 5 vulnerabilidades:*\n"
            
            for i, vuln in enumerate(vulnerabilities[:5], 1):
                file_path = vuln.get('file', 'unknown').split('/')[-1]
                line = vuln.get('line', '?')
                vuln_type = vuln.get('type', 'Unknown')
                confidence = vuln.get('confidence', 0)
                
                message += f"\n{i}. *{escape_markdown(vuln_type)}* \\({confidence*100:.0f}%\\)\n"
                message += f"   📄 `{escape_markdown(file_path)}:{line}`"
            
            message += f"\n\n"
            message += f"👤 Usuario: `{escape_markdown(commit_author)}`\n"
            message += f"💬 Commit: `{escape_markdown(commit_message)}`\n"
            message += f"⏰ Hora: `{readable_time}`\n"
            message += f"🔗 Repo: `elkinpabon/CI\\-CD\\-Tests`"
        else:
            # Message when no vulnerabilities found
            message = f"✅ *SIN VULNERABILIDADES DETECTADAS* ✅\n\n"
            message += f"📊 *Análisis completado exitosamente*\n\n"
            message += f"Archivos escaneados: {report.get('files_scanned', 0)}\n"
            message += f"Vulnerabilidades encontradas: 0\n\n"
            message += f"👤 Usuario: `{escape_markdown(commit_author)}`\n"
            message += f"💬 Commit: `{escape_markdown(commit_message)}`\n"
            message += f"⏰ Hora: `{readable_time}`\n"
            message += f"🔗 Repo: `elkinpabon/CI\\-CD\\-Tests`"
        
        # Send to Telegram
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'MarkdownV2'
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            print('✅ Notificación enviada a Telegram exitosamente')
            return True
        else:
            print(f'❌ Error enviando notificación: {response.text}')
            return False
            
    except FileNotFoundError:
        print('⚠️ vulnerability_report.json no encontrado')
        return False
    except Exception as e:
        print(f'❌ Error: {e}')
        return False

if __name__ == '__main__':
    success = send_telegram_notification()
    sys.exit(0 if success else 1)
