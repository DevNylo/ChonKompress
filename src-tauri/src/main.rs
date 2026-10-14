#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[tauri::command]
fn compress_video(app: tauri::AppHandle, input_path: String, output_path: String, quality: String, remove_audio: bool) -> Result<String, String> {
    // Localiza o motor FFmpeg que o GitHub embalou dentro do programa
    let ffmpeg_path = app.path().resource_dir().unwrap().join("ffmpeg.exe");

    let mut args = vec![
        "-i".to_string(), input_path,
        "-c:v".to_string(), "h264_qsv".to_string(), 
        "-global_quality".to_string(), quality,
    ];

    if remove_audio {
        args.push("-an".to_string());
    } else {
        args.push("-c:a".to_string());
        args.push("aac".to_string());
        args.push("-b:a".to_string());
        args.push("128k".to_string());
    }

    args.push(output_path);

    let status = std::process::Command::new(ffmpeg_path)
        .args(args)
        .status()
        .map_err(|e| format!("Falha ao iniciar o FFmpeg: {}", e))?;

    if status.success() {
        Ok("Compressão finalizada com sucesso!".into())
    } else {
        Err("Ocorreu um erro durante a compressão.".into())
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![compress_video])
        .run(tauri::generate_context!())
        .expect("Erro ao executar a aplicação Tauri");
}