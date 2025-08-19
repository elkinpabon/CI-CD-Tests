document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de perfil cargada correctamente');
    
    const tableRows = document.querySelectorAll('.grades-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Calcular promedio ponderado
    const grades = [
        { grade: 18.5, credits: 3 },
        { grade: 14.2, credits: 3 },
        { grade: 16.0, credits: 4 },
        { grade: 19.8, credits: 3 }
    ];
    
    const totalCredits = grades.reduce((sum, item) => sum + item.credits, 0);
    const weightedSum = grades.reduce((sum, item) => sum + (item.grade * item.credits), 0);
    const average = (weightedSum / totalCredits).toFixed(2);
    
    console.log(`Promedio ponderado: ${average}`);
});

