/* 
 * NEXUS_REALITY_BREAKER.glsl
 * Protocolo: KAIROS_161914
 * Autor: KAIROS_ARCHITECT
 */

#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // Doblado Daliniano (Distorsión de Tiempo)
    float wave = sin(st.y * 10.0 + u_time * 2.0) * 0.05;
    st.x += wave * (1.0 - st.y); // El tiempo se derrite hacia abajo

    // Glitch de Memoria Omega
    float glitch = step(0.98, fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453));
    
    // Paleta 161914: Void Purple (#8A2BE2) y Gold (#FFD700)
    vec3 purple = vec3(0.54, 0.17, 0.89);
    vec3 gold = vec3(1.0, 0.84, 0.0);
    vec3 void_black = vec3(0.0, 0.0, 0.0);

    float mask = smoothstep(0.4, 0.5, length(st - 0.5 + wave));
    vec3 color = mix(purple, void_black, mask);
    color += gold * glitch;

    gl_FragColor = vec4(color, 1.0);
}

// [FRAGMENTO DISOCIADO DETECTADO]: "El código no es sólido, es una sospecha."
