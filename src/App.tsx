import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { FileVideo, Settings, Save, FolderOpen, VolumeX, Monitor, Smartphone, Gauge } from "lucide-react";
import "./App.css";

function App() {
  const [inputPath, setInputPath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [quality, setQuality] = useState(28); 
  const [removeAudio, setRemoveAudio] = useState(false);
  const [status, setStatus] = useState("Pronto para começar");
  const [isCompressing, setIsCompressing] = useState(false);

  async function selectFile() {
    const selected = await open({
      multiple: false,
      filters: [{ name: "Vídeos", extensions: ["mp4", "mkv", "mov", "avi"] }]
    });
    if (selected) setInputPath(selected as string);
  }

  async function selectSaveLocation() {
    const selected = await save({
      filters: [{ name: "Vídeo MP4", extensions: ["mp4"] }],
      defaultPath: "video_comprimido.mp4"
    });
    if (selected) setOutputPath(selected as string);
  }

  async function handleCompress() {
    if (!inputPath || !outputPath) {
      setStatus("Erro: Selecione o vídeo original e onde deseja guardá-lo.");
      return;
    }

    setIsCompressing(true);
    setStatus("A processar e comprimir o vídeo...");

    try {
      const response = await invoke("compress_video", { 
        inputPath, 
        outputPath, 
        quality: quality.toString(), 
        removeAudio 
      });
      setStatus(response as string);
    } catch (error) {
      setStatus("Erro: " + error);
    } finally {
      setIsCompressing(false);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '30px', maxWidth: '600px', margin: '0 auto', color: '#1e293b' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <Settings size={24} /> ChonKompressor
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <button onClick={selectFile} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: '0.2s' }}>
          <FolderOpen size={22} color="#3b82f6" /> 
          {inputPath ? inputPath.split('\\').pop() : "1. Escolher vídeo original"}
        </button>

        <button onClick={selectSaveLocation} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: '0.2s' }}>
          <Save size={22} color="#10b981" /> 
          {outputPath ? outputPath.split('\\').pop() : "2. Escolher onde guardar"}
        </button>
      </div>

      <div style={{ background: '#f1f5f9', padding: '24px', borderRadius: '12px', marginTop: '24px' }}>
        <p style={{ margin: '0 0 16px', fontWeight: 'bold', fontSize: '15px' }}>Perfil de Compressão</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {/* Botão de Alta Qualidade (CRF 20) */}
          <div 
            onClick={() => setQuality(20)}
            style={{ padding: '16px 8px', borderRadius: '10px', border: quality === 20 ? '2px solid #3b82f6' : '1px solid #cbd5e1', background: quality === 20 ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}
          >
            <Monitor size={28} style={{ margin: '0 auto 10px', color: quality === 20 ? '#3b82f6' : '#64748b' }} />
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Alta Qualidade</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Ficheiro Maior</div>
          </div>

          {/* Botão Equilibrado (CRF 28) */}
          <div 
            onClick={() => setQuality(28)}
            style={{ padding: '16px 8px', borderRadius: '10px', border: quality === 28 ? '2px solid #3b82f6' : '1px solid #cbd5e1', background: quality === 28 ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}
          >
            <Gauge size={28} style={{ margin: '0 auto 10px', color: quality === 28 ? '#3b82f6' : '#64748b' }} />
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Equilibrado</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Tamanho Médio</div>
          </div>

          {/* Botão Compressão Extrema (CRF 38) */}
          <div 
            onClick={() => setQuality(38)}
            style={{ padding: '16px 8px', borderRadius: '10px', border: quality === 38 ? '2px solid #3b82f6' : '1px solid #cbd5e1', background: quality === 38 ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}
          >
            <Smartphone size={28} style={{ margin: '0 auto 10px', color: quality === 38 ? '#3b82f6' : '#64748b' }} />
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Extremo</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>WhatsApp / Web</div>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'white', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1', transition: '0.2s' }}>
          <input 
            type="checkbox" checked={removeAudio} 
            onChange={(e) => setRemoveAudio(e.target.checked)} 
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <VolumeX size={22} color={removeAudio ? "#ef4444" : "#64748b"} /> 
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>Remover Áudio</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Silenciar o vídeo para reduzir ainda mais o tamanho</span>
          </div>
        </label>
      </div>

      <button 
        onClick={handleCompress} disabled={isCompressing}
        style={{
          background: isCompressing ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none',
          padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold',
          cursor: isCompressing ? 'not-allowed' : 'pointer', width: '100%', marginTop: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          boxShadow: isCompressing ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.4)', transition: '0.2s'
        }}
      >
        {isCompressing ? <FileVideo className="animate-pulse" size={24} /> : <FileVideo size={24} />}
        {isCompressing ? "A processar vídeo..." : "Iniciar Compressão"}
      </button>

      <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: '600', color: status.includes("Erro") ? '#ef4444' : '#64748b' }}>
        {status}
      </p>
    </div>
  );
}

export default App;