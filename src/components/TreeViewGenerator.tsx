"use client";
import React, { useState, useCallback, useRef } from 'react';
import { Upload, Copy, Check, Folder, File as FileIcon, Settings, X, Filter, Download } from 'lucide-react';


interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  size?: number;
  lastModified?: Date;
}

interface TreeSettings {
  style: 'standard' | 'ascii' | 'simple';
  showFiles: boolean;
  maxDepth: number;
  excludePatterns: string[];
  sortBy: 'name' | 'type' | 'size';
}

const TreeViewGenerator: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [generatedTree, setGeneratedTree] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [settings, setSettings] = useState<TreeSettings>({
    style: 'standard',
    showFiles: true,
    maxDepth: 10,
    excludePatterns: ['.git', 'node_modules', '.DS_Store', 'Thumbs.db'],
    sortBy: 'name'
  });
    const getFileIcon = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return '📄';
    const iconMap: Record<string, string> = {
      js: '🟨',
      jsx: '⚛️',
      ts: '🟦',
      tsx: '🔷',
      html: '🌐',
      css: '🎨',
      scss: '💅',
      json: '🧾',
      md: '📝',
      txt: '📄',
      pdf: '📕',
      png: '🖼️',
      jpg: '📸',
      jpeg: '📸',
      gif: '🎞️',
      svg: '🧩',
      zip: '🗜️',
      rar: '🗜️',
      mp3: '🎵',
      wav: '🔊',
      mp4: '🎬',
      mov: '🎥',
      exe: '💻',
      py: '🐍',
      java: '☕',
      c: '📘',
      cpp: '📘',
      rb: '💎'
    };
    return iconMap[ext] || '📄';
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buildFileTree = useCallback((files: FileList): FileNode[] => {
    const tree: FileNode[] = [];
    const pathMap = new Map<string, FileNode>();

    console.log('=== アップロードされたファイル一覧 ===');
    Array.from(files).forEach((file, index) => {
      console.log(`${index}: ${file.webkitRelativePath || file.name}`);
    });

    Array.from(files).forEach(file => {
      const path = file.webkitRelativePath || file.name;
      const parts = path.split('/');
      console.log(`パス: ${path}, 分割結果:`, parts);
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        console.log(`  階層 ${index}: ${part}, 現在のパス: ${currentPath}`);
        
        if (!pathMap.has(currentPath)) {
          const node: FileNode = {
            name: part,
            type: index === parts.length - 1 ? 'file' : 'folder',
            path: currentPath,
            children: index === parts.length - 1 ? undefined : [],
            size: index === parts.length - 1 ? file.size : undefined,
            lastModified: index === parts.length - 1 ? new Date(file.lastModified) : undefined
          };
          
          pathMap.set(currentPath, node);
          
          if (parentPath) {
            const parent = pathMap.get(parentPath);
            if (parent && parent.children) {
              parent.children.push(node);
            }
          } else {
            tree.push(node);
          }
        }
      });
    });

    console.log('=== 最終的なツリー構造 ===');
    console.log(JSON.stringify(tree, null, 2));

    return tree;
  }, []);

  const shouldExclude = useCallback((name: string): boolean => {
    return settings.excludePatterns.some(pattern => 
      name.includes(pattern) || name.startsWith('.')
    );
  }, [settings.excludePatterns]);

  const sortNodes = useCallback((nodes: FileNode[]): FileNode[] => {
    return [...nodes].sort((a, b) => {
      if (settings.sortBy === 'type') {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
      }
      return a.name.localeCompare(b.name);
    });
  }, [settings.sortBy]);

  const generateTreeString = useCallback((nodes: FileNode[], depth = 0, isLast = false, prefix = ''): string => {
    if (depth > settings.maxDepth) return '';
    
    let result = '';
    const filteredNodes = nodes.filter(node => 
      (settings.showFiles || node.type === 'folder') && 
      !shouldExclude(node.name)
    );
    
    const sortedNodes = sortNodes(filteredNodes);
    
    sortedNodes.forEach((node, index) => {
      const isLastNode = index === sortedNodes.length - 1;
      const connector = isLastNode ? '└── ' : '├── ';
      const icon = node.type === 'folder' ? '📁 ' : getFileIcon(node.name) + ' ';
      
      result += prefix + connector + icon + node.name + '\n';
      
      if (node.children && node.children.length > 0) {
        const childPrefix = prefix + (isLastNode ? '    ' : '│   ');
        result += generateTreeString(node.children, depth + 1, isLastNode, childPrefix);
      }
    });
    
    return result;
  }, [settings, shouldExclude, sortNodes]);

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const tree = buildFileTree(files);
      setFileTree(tree);
      
      const treeString = generateTreeString(tree);
      setGeneratedTree(treeString);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Error processing files:', error);
      setIsProcessing(false);
      setProgress(0);
    }
  }, [buildFileTree, generateTreeString]);

  // ドラッグ&ドロップ処理を修正
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const files: File[] = [];
      
      // DataTransferItemListから階層構造を保持したファイル情報を取得
      const promises = Array.from(items).map(async (item) => {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            await traverseFileTree(entry, '', files);
          }
        }
      });
      
      await Promise.all(promises);
      
      if (files.length > 0) {
        // FileListに変換
        const dt = new DataTransfer();
        files.forEach(file => dt.items.add(file));
        handleFileUpload(dt.files);
      }
    }
  }, [handleFileUpload]);

  // ファイルツリーを再帰的に走査してファイル配列を構築
  const traverseFileTree = useCallback((entry: any, path: string, files: File[]) => {
    return new Promise<void>((resolve) => {
      if (entry.isFile) {
        entry.file((file: File) => {
          // webkitRelativePathを手動で設定
          const newFile = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified
          });
          // webkitRelativePathを追加
          Object.defineProperty(newFile, 'webkitRelativePath', {
            value: path + file.name,
            writable: false
          });
          files.push(newFile);
          resolve();
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        dirReader.readEntries((entries: any[]) => {
          const promises = entries.map(childEntry => 
            traverseFileTree(childEntry, path + entry.name + '/', files)
          );
          Promise.all(promises).then(() => resolve());
        });
      }
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedTree);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, [generatedTree]);

  const handleSettingsChange = useCallback((newSettings: Partial<TreeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (fileTree.length > 0) {
      const treeString = generateTreeString(fileTree);
      setGeneratedTree(treeString);
    }
  }, [fileTree, generateTreeString]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([generatedTree], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'folder-structure.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedTree]);

  const getFileStats = useCallback(() => {
    const lines = generatedTree.split('\n').filter(line => line.trim()).length;
    const chars = generatedTree.length;
    return { lines, chars };
  }, [generatedTree]);

  const stats = getFileStats();
















































  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TreeView Generator</h1>
          <p className="text-lg text-gray-600">フォルダ構造を美しいアスキーアートで可視化</p>
          <p className="text-lg text-gray-600">フォルダ・ファイル名だけ読み込むから爆速</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">📁 アップロード</h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings size={20} />
                </button>
              </div>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">フォルダをドラッグ&ドロップ</p>
                <p className="text-sm text-gray-500">または</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  フォルダを選択
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
                {...({ webkitdirectory: '', directory: '' } as any)}
              />
              
              {isProcessing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">処理中...</span>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">⚙️ 設定</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 text-gray-600 hover:text-gray-900 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      表示スタイル
                    </label>
                    <select
                      value={settings.style}
                      onChange={(e) => handleSettingsChange({ style: e.target.value as TreeSettings['style'] })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="standard">標準 (├── └──)</option>
                      <option value="ascii">ASCII (+-- \--)</option>
                      <option value="simple">シンプル (|-- \--)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.showFiles}
                        onChange={(e) => handleSettingsChange({ showFiles: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">ファイルを表示</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最大階層数: {settings.maxDepth}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={settings.maxDepth}
                      onChange={(e) => handleSettingsChange({ maxDepth: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      除外パターン
                    </label>
                    <input
                      type="text"
                      value={settings.excludePatterns.join(', ')}
                      onChange={(e) => handleSettingsChange({ 
                        excludePatterns: e.target.value.split(',').map(s => s.trim()) 
                      })}
                      placeholder=".git, node_modules, .DS_Store"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">🌲 結果</h2>
                <div className="flex items-center space-x-2">
                  {generatedTree && (
                    <>
                      <span className="text-sm text-gray-600">
                        {stats.lines}行 / {stats.chars}文字
                      </span>
                      <button
                        onClick={handleDownload}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="ダウンロード"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copied ? 'コピー済み' : 'コピー'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] font-mono text-sm overflow-auto">
                {generatedTree ? (
                  <pre className="whitespace-pre-wrap text-gray-800">{generatedTree}</pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Folder size={48} className="mx-auto mb-4 text-gray-400" />
                      <p>フォルダをアップロードしてください</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center mt-8 text-gray-600">
          <p>© 2025 TreeView Generator - 開発者とブロガーのためのツール</p>
        </footer>
      </div>
    </div>
  );
};

export default TreeViewGenerator;