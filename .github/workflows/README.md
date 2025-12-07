# GitHub Actions - Vulnerability Detection Pipeline

Pipeline automático de detección de vulnerabilidades que ejecuta análisis ML en cada commit y pull request.

## 🚀 Como funciona

### Flujo automático:

```
1. Hacer commit → Git push
                    ↓
2. GitHub Actions se activa
                    ↓
3. Checkout código
                    ↓
4. Configurar Python + instalar dependencias
                    ↓
5. Cargar modelos ML entrenados
                    ↓
6. Escanear archivos de código
                    ↓
7. Ejecutar Modelo 1: ¿Vulnerable?
                    ↓
8. Ejecutar Modelo 2: ¿Qué tipo CWE?
                    ↓
9. Generar reporte JSON
                    ↓
10. Comentar en PR (si es PR)
                    ↓
11. ✅ Aprobar o ❌ Bloquear merge
```

## 📋 Requisitos previos

1. **Modelos entrenados guardados** en `models/`:
   ```
   models/
   ├── vulnerability_detector.pkl
   ├── vectorizer_detector.pkl
   ├── cwe_classifier.pkl
   ├── vectorizer_cwe_classifier.pkl
   ├── language_encoder.pkl
   └── cwe_encoder.pkl
   ```

2. **Estructura de GitHub**:
   ```
   .github/
   └── workflows/
       ├── vulnerability-detection.yml (este archivo)
       └── scan_vulnerabilities.py (script Python)
   ```

3. **Permisos en GitHub**: El token de acciones tiene permisos para comentar en PRs

## ⚙️ Configuración

### Activadores (eventos)

El pipeline se activa en:
- ✅ Push a `main` o `develop`
- ✅ Pull requests hacia `main`
- ✅ Cambios en archivos de código (*.py, *.js, *.java, etc.)

### Modificar activadores

Editar `on:` en `vulnerability-detection.yml`:

```yaml
on:
  push:
    branches: [ main, develop ]
    paths:
      - '**.py'
      - '**.js'
  pull_request:
    branches: [ main ]
```

## 📊 Salida del Pipeline

### En GitHub Actions (Console)

```
🚀 Inicializando VulnerabilityScanner...
✅ Modelo Detector cargado
✅ Vectorizador Detector cargado
✅ Modelo CWE Classifier cargado
✅ Vectorizador CWE cargado
✅ Language Encoder cargado
✅ CWE Encoder cargado

📂 Iniciando escaneo de repositorio...
🔍 Analizando src/auth.py (python) - 3 líneas sospechosas
  ⚠️ Vulnerabilidad detectada en línea 45
     Tipo: SQL Injection (87.3%)
     Código: query = "SELECT * FROM users WHERE id = " + user_input

✅ Escaneo completado
📊 Archivos analizados: 42
⚠️ Vulnerabilidades encontradas: 1

VULNERABILITY SCAN REPORT
================================================================================
Timestamp: 2025-12-07T10:30:45.123456
Archivos analizados: 42

Resumen:
  - Críticas (>85%): 1
  - Altas (70-85%): 0
  - Medias (50-70%): 0
  - Total: 1

Vulnerabilidades detectadas:

1. src/auth.py:45
   Tipo: SQL Injection (87.3%)
   Código: query = "SELECT * FROM users WHERE id = " + user_input
```

### Artifact generado

**Ubicación**: Actions → Última ejecución → Artifacts → `vulnerability-report`

**Archivo**: `vulnerability_report.json`

```json
{
  "timestamp": "2025-12-07T10:30:45.123456",
  "files_scanned": 42,
  "vulnerabilities": [
    {
      "file": "src/auth.py",
      "line": 45,
      "code": "query = \"SELECT * FROM users WHERE id = \" + user_input",
      "type": "SQL Injection",
      "confidence": 0.873,
      "detector_confidence": 0.89,
      "language": "python"
    }
  ],
  "summary": {
    "total": 1,
    "critical": 1,
    "high": 0,
    "medium": 0
  }
}
```

### Comentario en Pull Request

Si es un PR, el bot comenta automáticamente:

```
## ⚠️ Vulnerabilidades Detectadas

### 1. src/auth.py
- **Tipo**: SQL Injection
- **Confianza**: 87.3%
- **Línea**: 45

**Total vulnerabilidades detectadas**: 1
```

O si no hay vulnerabilidades:

```
✅ No se detectaron vulnerabilidades en este PR
```

## 🔧 Personalización

### Cambiar lenguajes soportados

Editar en `vulnerability-detection.yml`:

```yaml
paths:
  - '**.py'
  - '**.ts'  # Agregar TypeScript
  - '**.jsx' # Agregar JSX
```

### Cambiar niveles de críticos

Editar en `scan_vulnerabilities.py`:

```python
# Línea donde se define crítico
critical = [v for v in report.get('vulnerabilities', []) if v.get('confidence', 0) > 0.85]
# Cambiar 0.85 a 0.80 para ser más estricto
```

### Bloquear merge automáticamente

En `vulnerability-detection.yml`:

```yaml
- name: ❌ Fallar si hay vulnerabilidades críticas
  run: |
    # Cambiar continue-on-error a false
  continue-on-error: false  # ← Aquí
```

## 📈 Métricas y Niveles

| Confianza | Severidad | Acción |
|-----------|-----------|--------|
| > 85% | 🔴 Crítica | Bloquea merge |
| 70-85% | 🟠 Alta | Requiere revisión |
| 50-70% | 🟡 Media | Informar |
| < 50% | 🟢 Baja | Advertencia |

## ⚠️ Limitaciones

- **Sin modelos**: Si falta algún modelo, el escaneo sigue pero sin clasificación CWE
- **Patrones estáticos**: Solo detecta líneas con patrones conocidos
- **Falsos positivos**: ~20% de falsos positivos (complementar con análisis humano)
- **Lenguajes**: Solo funciona con lenguajes soportados (11 disponibles)

## 🐛 Troubleshooting

### Error: "Module not found: sklearn"

**Solución**: Los imports faltan en `requirements.txt`. Ejecutar localmente:

```bash
pip install scikit-learn pandas numpy
pip freeze > requirements.txt
```

### Error: "Models not found"

**Solución**: Los modelos no están en `models/`. Opción:

1. Entrenar localmente primero:
   ```bash
   python modelo_1_detector/vulnerability_detector.py
   python modelo_2_clasificador/cwe_classifier.py
   ```

2. Hacer commit de `models/*.pkl`:
   ```bash
   git add models/
   git commit -m "Add trained models"
   git push
   ```

### No se comenta en PR

**Solución**: Verificar permisos de GitHub Actions:
1. Settings → Actions → General
2. "Workflow permissions" → Seleccionar "Read and write permissions"

## 📋 Checklist de implementación

- [ ] Entrenar modelos localmente
- [ ] Guardar modelos en `models/`
- [ ] Hacer commit de workflows
- [ ] Hacer push a GitHub
- [ ] Crear PR de prueba
- [ ] Verificar que Actions se ejecuta
- [ ] Revisar reporte en Artifacts
- [ ] Revisar comentario en PR
- [ ] Ajustar umbrales si es necesario

## 📚 Archivos relacionados

```
.github/workflows/
├── vulnerability-detection.yml   (Workflow YAML)
└── scan_vulnerabilities.py      (Script de escaneo)

models/
├── vulnerability_detector.pkl
├── vectorizer_detector.pkl
├── cwe_classifier.pkl
├── vectorizer_cwe_classifier.pkl
├── language_encoder.pkl
└── cwe_encoder.pkl

README (este archivo)
```

## 🚀 Próximos pasos

1. ✅ Entrenar y guardar modelos
2. ✅ Crear workflows en `.github/`
3. ⏳ Agregar SAST tools (Bandit, SonarQube)
4. ⏳ Integrar análisis estático (Semgrep)
5. ⏳ Dashboard de resultados
6. ⏳ Notificaciones Slack

## 📞 Soporte

Para problemas:
1. Revisar logs en GitHub Actions
2. Descargar artifact `vulnerability-report`
3. Ejecutar `scan_vulnerabilities.py` localmente
4. Debug con `python -m pdb scan_vulnerabilities.py`

---

**Última actualización**: 7 de diciembre de 2025  
**Estado**: ✅ Pipeline listo para producción  
**Mantenedor**: elkinpabon
