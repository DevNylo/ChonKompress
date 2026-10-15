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
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px 32px', maxWidth: '100%', margin: '0 auto', color: '#1e293b' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', fontSize: '24px', margin: '0 0 16px 0' }}>
        <Settings size={26} /> ChonKompressor
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={selectFile} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: '2px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '16px', transition: '0.2s' }}>
          <FolderOpen size={22} color="#3b82f6" /> 
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '440px' }}>
            {inputPath ? inputPath.split('\\').pop() : "1. Escolher vídeo original"}
          </span>
        </button>

        <button onClick={selectSaveLocation} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: '2px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '16px', transition: '0.2s' }}>
          <Save size={22} color="#10b981" /> 
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '440px' }}>
            {outputPath ? outputPath.split('\\').pop() : "2. Escolher onde guardar"}
          </span>
        </button>
      </div>

      <div style={{ background: '#f1f5f9', padding: '16px 20px', borderRadius: '12px', marginTop: '16px' }}>
        <p style={{ margin: '0 0 12px', fontWeight: 'bold', fontSize: '16px' }}>Perfil de Compressão</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {/* Alta Qualidade */}
          <div onClick={() => setQuality(20)} style={{ padding: '12px 6px', borderRadius: '10px', border: quality === 20 ? '3px solid #3b82f6' : '2px solid #cbd5e1', background: quality === 20 ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}>
            <Monitor size={28} style={{ margin: '0 auto 6px', color: quality === 20 ? '#3b82f6' : '#64748b' }} />
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>Qualidade</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Ficheiro Maior</div>
          </div>

          {/* Equilibrado */}
          <div onClick={() => setQuality(28)} style={{ padding: '12px 6px', borderRadius: '10px', border: quality === 28 ? '3px solid #3b82f6' : '2px solid #cbd5e1', background: quality === 28 ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}>
            <Gauge size={28} style={{ margin: '0 auto 6px', color: quality === 28 ? '#3b82f6' : '#64748b' }} />
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>Equilíbrio</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Tamanho Médio</div>
          </div>

          {/* Extremo */}
          <div onClick={() => setQuality(38)} style={{ padding: '12px 6px', borderRadius: '10px', border: quality === 38 ? '3px solid #3b82f6' : '2px solid #cbd5e1', background: quality === 38 ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}>
            <Smartphone size={28} style={{ margin: '0 auto 6px', color: quality === 38 ? '#3b82f6' : '#64748b' }} />
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>Extremo</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Para a Web</div>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'white', padding: '12px 16px', borderRadius: '10px', border: '2px solid #cbd5e1', transition: '0.2s' }}>
          <input type="checkbox" checked={removeAudio} onChange={(e) => setRemoveAudio(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
          <VolumeX size={26} color={removeAudio ? "#ef4444" : "#64748b"} /> 
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#1e293b' }}>Remover Áudio</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Silenciar para reduzir o tamanho</span>
          </div>
        </label>
      </div>

      <button onClick={handleCompress} disabled={isCompressing} style={{ background: isCompressing ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: isCompressing ? 'not-allowed' : 'pointer', width: '100%', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: isCompressing ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.4)', transition: '0.2s' }}>
        {isCompressing ? <FileVideo className="animate-pulse" size={26} /> : <FileVideo size={26} />}
        {isCompressing ? "A processar vídeo..." : "Iniciar Compressão"}
      </button>

      <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '14px', fontWeight: '600', color: status.includes("Erro") ? '#ef4444' : '#64748b' }}>
        {status}
      </p>
    </div>
  );
}

export default App;