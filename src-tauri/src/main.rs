#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn compress_video(input_path: String, output_path: String, quality: String, remove_audio: bool) -> Result<String, String> {
    // Inicializa os argumentos do FFmpeg
    let mut args = vec![
        "-i".to_string(), input_path,
        "-c:v".to_string(), "h264_qsv".to_string(), // Aceleração de hardware
        "-global_quality".to_string(), quality,
    ];

    // Lógica para remover ou manter o áudio com base na escolha do utilizador
    if remove_audio {
        args.push("-an".to_string()); // Parâmetro para apagar a faixa de áudio
    } else {
        args.push("-c:a".to_string());
        args.push("aac".to_string());
        args.push("-b:a".to_string());
        args.push("128k".to_string());
    }

    args.push(output_path);

    // Executa o FFmpeg nativamente
    let status = std::process::Command::new("ffmpeg")
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
        .plugin(tauri_plugin_dialog::init()) // Regista o plugin de janelas de sistema
        .invoke_handler(tauri::generate_handler![compress_video])
        .run(tauri::generate_context!())
        .expect("Erro ao executar a aplicação Tauri");
}