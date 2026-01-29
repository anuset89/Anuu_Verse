# Configuración Requerida para ComfyUI (Anuu Cortex)

Para que los flujos de trabajo automáticos (`txt2img` y `txt2vid`) funcionen, tu instancia local de ComfyUI necesita los siguientes modelos en sus carpetas correspondientes.

## 1. Modelos Checkpoint (Base)
**Ruta:** `ComfyUI/models/checkpoints/`

*   **Pony Diffusion V6 XL** (Para Imágenes / Kali Avatar)
    *   Archivo esperado: `ponyDiffusionV6XL_v6StartWithThisOne.safetensors`
    *   Descarga: [Civitai Link](https://civitai.com/models/257749/pony-diffusion-v6-xl)
*   **DreamShaper 8** (Para Video Anime / General)
    *   Archivo esperado: `dreamshaper_8.safetensors`
    *   Descarga: [Civitai Link](https://civitai.com/models/4384/dreamshaper)

## 2. Modelos de Animación (AnimateDiff)
**Ruta:** `ComfyUI/custom_nodes/ComfyUI-AnimateDiff-Evolved/models/` (o donde tu instalación de AnimateDiff busque modelos)

*   **Motion Module v1.5 v2**
    *   Archivo esperado: `mm_sd_v15_v2.ckpt`
    *   Descarga: [HuggingFace - guoyww/animatediff](https://huggingface.co/guoyww/animatediff/tree/main)

## 3. Configuración de Anuu
Los flujos JSON se encuentran en:
`/home/kali/Anuu_Verse/systems/EXECUTION/skills/multimodal/workflows/`

Si tus modelos tienen nombres diferentes, puedes editar estos JSONs o simplemente renombrar tus archivos para que coincidan.

## 4. Notas Adicionales
*   Asegúrate de que ComfyUI esté corriendo en `http://127.0.0.1:8188`.
*   Si usamos `IPAdapter` o `ControlNet` en el futuro, los añadiré a esta lista.
