#!/usr/bin/env python3
"""Send vulnerability notifications to Telegram"""
import json
import os
import sys
import requests
from urllib.parse import quote

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
        
        if not vulnerabilities:
            print('✅ No vulnerabilities to notify')
            return True
        
        # Build message
        summary = report.get('summary', {})
        message = f"""🚨 *VULNERABILIDADES DETECTADAS* 🚨

📊 *Resumen:*
• Total: {len(vulnerabilities)} vulnerabilidades
• Críticas: {summary.get('critical', 0)}
• Altas: {summary.get('high', 0)}
• Medias: {summary.get('medium', 0)}
• Bajas: {summary.get('low', 0)}

🔍 *Top 5 vulnerabilidades:*
"""
        
        for i, vuln in enumerate(vulnerabilities[:5], 1):
            file_path = vuln.get('file', 'unknown').split('/')[-1]
            line = vuln.get('line', '?')
            vuln_type = vuln.get('type', 'Unknown')
            confidence = vuln.get('confidence', 0)
            
            message += f"\n{i}. *{vuln_type}* ({confidence*100:.0f}%)\n"
            message += f"   📄 {file_path}:{line}"
        
        message += f"\n\n🔗 Repositorio: elkinpabon/CI-CD-Tests"
        message += f"\n⏰ Fecha: {report.get('timestamp', 'unknown')}"
        
        # Send to Telegram
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'Markdown'
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
