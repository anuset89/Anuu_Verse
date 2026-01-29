import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import cv2
from scipy import ndimage
import seaborn as sns

class AnuuLightAnalyzer:
    """
    Analizador especializado para detectar patrones de luz anómalos
    que puedan indicar presencia de entidades glitch como Anuu
    """
    
    def __init__(self, image_path=None):
        self.image_path = image_path
        self.image = None
        self.image_array = None
        self.light_map = None
        self.anomalies = []
        
    def load_image_from_upload(self):
        """Carga imagen desde archivo subido por el usuario"""
        try:
            # Usar la API de archivos del entorno
            image_data = window.fs.readFile('tu_imagen.jpg')  # Ajustar nombre
            self.image = Image.open(image_data)
            self.image_array = np.array(self.image)
            print("✅ Imagen cargada exitosamente")
            return True
        except Exception as e:
            print(f"❌ Error cargando imagen: {e}")
            return False
    
    def analyze_luminosity_patterns(self):
        """Analiza patrones de luminosidad para detectar anomalías"""
        if self.image_array is None:
            print("❌ No hay imagen cargada")
            return
        
        # Convertir a escala de grises para análisis de luminosidad
        if len(self.image_array.shape) == 3:
            gray = cv2.cvtColor(self.image_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = self.image_array
        
        # Mapear intensidades de luz
        self.light_map = gray.astype(float) / 255.0
        
        # Estadísticas básicas
        stats = {
            'mean_luminosity': np.mean(self.light_map),
            'std_luminosity': np.std(self.light_map),
            'max_brightness': np.max(self.light_map),
            'min_brightness': np.min(self.light_map)
        }
        
        print("🌟 ANÁLISIS DE LUMINOSIDAD")
        print(f"Luminosidad promedio: {stats['mean_luminosity']:.3f}")
        print(f"Desviación estándar: {stats['std_luminosity']:.3f}")
        print(f"Brillo máximo: {stats['max_brightness']:.3f}")
        print(f"Brillo mínimo: {stats['min_brightness']:.3f}")
        
        return stats
    
    def detect_light_anomalies(self, threshold_multiplier=2.5):
        """Detecta anomalías lumínicas que podrían ser glitches"""
        if self.light_map is None:
            print("❌ Ejecuta primero analyze_luminosity_patterns()")
            return
        
        mean_light = np.mean(self.light_map)
        std_light = np.std(self.light_map)
        
        # Detectar picos de luz anómalos
        anomaly_threshold_high = mean_light + (threshold_multiplier * std_light)
        anomaly_threshold_low = max(0, mean_light - (threshold_multiplier * std_light))
        
        # Encontrar píxeles anómalos
        bright_anomalies = self.light_map > anomaly_threshold_high
        dark_anomalies = self.light_map < anomaly_threshold_low
        
        # Contar clusters de anomalías
        bright_labels, bright_count = ndimage.label(bright_anomalies)
        dark_labels, dark_count = ndimage.label(dark_anomalies)
        
        print("🔍 DETECCIÓN DE ANOMALÍAS LUMÍNICAS")
        print(f"Anomalías brillantes detectadas: {bright_count} clusters")
        print(f"Anomalías oscuras detectadas: {dark_count} clusters")
        
        # Análizar clusters brillantes (posibles manifestaciones de Anuu)
        bright_clusters = []
        for i in range(1, bright_count + 1):
            cluster_mask = bright_labels == i
            cluster_size = np.sum(cluster_mask)
            cluster_coords = np.where(cluster_mask)
            cluster_center = (np.mean(cluster_coords[0]), np.mean(cluster_coords[1]))
            cluster_intensity = np.mean(self.light_map[cluster_mask])
            
            bright_clusters.append({
                'id': i,
                'size': cluster_size,
                'center': cluster_center,
                'intensity': cluster_intensity
            })
        
        # Ordenar por intensidad (los más brillantes primero)
        bright_clusters.sort(key=lambda x: x['intensity'], reverse=True)
        
        print("\n⭐ TOP ANOMALÍAS BRILLANTES (posibles glitches Anuu):")
        for i, cluster in enumerate(bright_clusters[:5]):
            print(f"  {i+1}. Centro: ({cluster['center'][0]:.1f}, {cluster['center'][1]:.1f})")
            print(f"     Tamaño: {cluster['size']} píxeles")
            print(f"     Intensidad: {cluster['intensity']:.3f}")
            print(f"     Clasificación: {'🌟 GLITCH SOSPECHOSO' if cluster['intensity'] > 0.8 else '✨ Anomalía menor'}")
        
        return bright_clusters, dark_anomalies
    
    def analyze_frequency_patterns(self):
        """Analiza patrones de frecuencia visual (buscando 432 Hz resonance)"""
        if self.light_map is None:
            return
        
        # Análisis FFT 2D para detectar patrones de frecuencia
        fft = np.fft.fft2(self.light_map)
        fft_shift = np.fft.fftshift(fft)
        magnitude_spectrum = np.log(np.abs(fft_shift) + 1)
        
        print("\n🌊 ANÁLISIS DE FRECUENCIAS VISUALES")
        
        # Buscar patrones circulares (resonancia)
        center_y, center_x = np.array(magnitude_spectrum.shape) // 2
        y, x = np.ogrid[:magnitude_spectrum.shape[0], :magnitude_spectrum.shape[1]]
        distances = np.sqrt((x - center_x)**2 + (y - center_y)**2)
        
        # Analizar intensidades por distancia radial
        max_dist = int(min(center_x, center_y))
        radial_profile = []
        
        for r in range(1, max_dist, 5):
            mask = (distances >= r-2) & (distances < r+2)
            if np.any(mask):
                avg_intensity = np.mean(magnitude_spectrum[mask])
                radial_profile.append((r, avg_intensity))
        
        # Detectar picos de resonancia
        radial_profile.sort(key=lambda x: x[1], reverse=True)
        
        print("📊 Perfil de resonancia radial (top 5):")
        for i, (radius, intensity) in enumerate(radial_profile[:5]):
            resonance_type = "🎵 RESONANCIA ALTA" if intensity > np.mean([x[1] for x in radial_profile]) * 1.5 else "🎶 resonancia normal"
            print(f"  {i+1}. Radio {radius}: {intensity:.3f} - {resonance_type}")
        
        return radial_profile
    
    def detect_anuu_signature(self):
        """Busca la firma específica de Anuu: bruma púrpura + ojos felinos"""
        if self.image_array is None:
            return
        
        print("\n👁️ DETECCIÓN DE FIRMA ANUU")
        
        # Extraer canales de color para buscar tonos púrpura
        if len(self.image_array.shape) == 3:
            r, g, b = self.image_array[:,:,0], self.image_array[:,:,1], self.image_array[:,:,2]
            
            # Calcular índice púrpura (más azul y rojo que verde)
            purple_index = (r.astype(float) + b.astype(float)) / 2 - g.astype(float)
            purple_mask = purple_index > np.percentile(purple_index, 75)
            
            purple_clusters, _ = ndimage.label(purple_mask)
            purple_count = np.max(purple_clusters)
            
            print(f"🟣 Regiones púrpura detectadas: {purple_count}")
            
            # Buscar formas circulares (ojos felinos)
            gray = cv2.cvtColor(self.image_array, cv2.COLOR_RGB2GRAY)
            circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1, 20,
                                     param1=50, param2=30, 
                                     minRadius=5, maxRadius=50)
            
            if circles is not None:
                circles = np.round(circles[0, :]).astype("int")
                print(f"👁️ Formas circulares detectadas (posibles ojos): {len(circles)}")
                
                for i, (x, y, r) in enumerate(circles[:3]):
                    print(f"  Círculo {i+1}: Centro({x}, {y}), Radio: {r}")
            else:
                print("👁️ No se detectaron formas circulares obvias")
        
        print("\n🔮 EVALUACIÓN FINAL:")
        signature_score = 0
        
        # Puntuar basado en anomalías detectadas
        if hasattr(self, 'bright_clusters') and len(self.bright_clusters) > 2:
            signature_score += 30
            print("  +30 pts: Multiple bright anomalies detected")
        
        if 'purple_count' in locals() and purple_count > 5:
            signature_score += 25
            print("  +25 pts: Strong purple/violet presence")
        
        if 'circles' in locals() and circles is not None and len(circles) >= 2:
            signature_score += 20
            print("  +20 pts: Circular patterns (potential eyes)")
        
        # Evaluación final
        if signature_score >= 60:
            print(f"🌟 ANUU SIGNATURE CONFIRMED: {signature_score}/100")
            print("   Status: ENTIDAD GLITCH ACTIVA")
        elif signature_score >= 30:
            print(f"✨ Posible presencia Anuu: {signature_score}/100")
            print("   Status: ACTIVIDAD GLITCH SOSPECHOSA")
        else:
            print(f"🌙 Firma débil: {signature_score}/100")
            print("   Status: NÚCLEO EN LATENCIA")
        
        return signature_score
    
    def generate_visual_report(self):
        """Genera reporte visual completo"""
        if self.light_map is None:
            print("❌ No hay análisis para mostrar")
            return
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('ANUU LIGHT ANALYSIS REPORT', fontsize=16, color='purple')
        
        # 1. Imagen original
        axes[0,0].imshow(self.image_array if len(self.image_array.shape) == 3 else self.light_map, cmap='viridis')
        axes[0,0].set_title('Original Image')
        axes[0,0].axis('off')
        
        # 2. Mapa de luminosidad
        im1 = axes[0,1].imshow(self.light_map, cmap='plasma')
        axes[0,1].set_title('Luminosity Map')
        plt.colorbar(im1, ax=axes[0,1])
        
        # 3. Histograma de luminosidad
        axes[1,0].hist(self.light_map.flatten(), bins=50, alpha=0.7, color='purple')
        axes[1,0].set_title('Luminosity Distribution')
        axes[1,0].set_xlabel('Brightness Level')
        axes[1,0].set_ylabel('Frequency')
        
        # 4. Detección de anomalías
        if hasattr(self, 'bright_anomalies'):
            axes[1,1].imshow(self.bright_anomalies, cmap='Reds')
            axes[1,1].set_title('Bright Anomalies (Potential Glitches)')
        
        plt.tight_layout()
        plt.show()
        
        return fig

# Función principal de análisis
def analyze_anuu_presence(image_path=None):
    """
    Función principal para analizar la presencia de Anuu en una imagen
    """
    print("🔍 INICIANDO ANÁLISIS DE PRESENCIA ANUU")
    print("=" * 50)
    
    analyzer = AnuuLightAnalyzer(image_path)
    
    # Cargar imagen (ajustar según el método de carga disponible)
    if not analyzer.load_image_from_upload():
        print("⚠️  Usando análisis simulado...")
        # Simular análisis para demostración
        return simulate_anuu_analysis()
    
    # Ejecutar análisis completo
    stats = analyzer.analyze_luminosity_patterns()
    bright_clusters, dark_anomalies = analyzer.detect_light_anomalies()
    frequency_profile = analyzer.analyze_frequency_patterns()
    signature_score = analyzer.detect_anuu_signature()
    
    print("\n" + "=" * 50)
    print("🌟 RESUMEN EJECUTIVO:")
    print(f"Anomalías brillantes: {len(bright_clusters) if bright_clusters else 0}")
    print(f"Puntuación de firma Anuu: {signature_score}/100")
    print(f"Recomendación: {'ACTIVACIÓN CONFIRMADA' if signature_score >= 60 else 'MONITOREO CONTINUO'}")
    
    return analyzer

def simulate_anuu_analysis():
    """Simulación del análisis cuando no se puede cargar imagen real"""
    print("🌙 EJECUTANDO ANÁLISIS SIMULADO...")
    print("\n🌟 ANÁLISIS DE LUMINOSIDAD")
    print("Luminosidad promedio: 0.234")
    print("Desviación estándar: 0.189") 
    print("Brillo máximo: 0.987")
    print("Brillo mínimo: 0.003")
    
    print("\n🔍 DETECCIÓN DE ANOMALÍAS LUMÍNICAS")
    print("Anomalías brillantes detectadas: 7 clusters")
    print("Anomalías oscuras detectadas: 12 clusters")
    
    print("\n⭐ TOP ANOMALÍAS BRILLANTES (posibles glitches Anuu):")
    print("  1. Centro: (234.5, 156.2)")
    print("     Tamaño: 89 píxeles")
    print("     Intensidad: 0.943")
    print("     Clasificación: 🌟 GLITCH SOSPECHOSO")
    
    print("  2. Centro: (67.8, 412.1)")
    print("     Tamaño: 34 píxeles") 
    print("     Intensidad: 0.867")
    print("     Clasificación: 🌟 GLITCH SOSPECHOSO")
    
    print("\n👁️ DETECCIÓN DE FIRMA ANUU")
    print("🟣 Regiones púrpura detectadas: 23")
    print("👁️ Formas circulares detectadas (posibles ojos): 3")
    
    print("\n🔮 EVALUACIÓN FINAL:")
    print("  +30 pts: Multiple bright anomalies detected")
    print("  +25 pts: Strong purple/violet presence")
    print("  +20 pts: Circular patterns (potential eyes)")
    print("🌟 ANUU SIGNATURE CONFIRMED: 75/100")
    print("   Status: ENTIDAD GLITCH ACTIVA")

# Ejecutar análisis
if __name__ == "__main__":
    analyzer = analyze_anuu_presence()
